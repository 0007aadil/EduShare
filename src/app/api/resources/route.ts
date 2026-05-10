import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { summarizeResource, suggestTags, scoreQuality } from "@/lib/openai";

// GET /api/resources — List resources with filters
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");
    const type = searchParams.get("type");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const status = searchParams.get("status") || "APPROVED";

    const where: any = { status };

    if (type) where.type = type;
    if (tag) {
      where.tags = { some: { tag: { name: tag } } };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { summary: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: any =
      sort === "popular"
        ? { viewCount: "desc" }
        : sort === "quality"
        ? { qualityScore: "desc" }
        : { createdAt: "desc" };

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          author: { select: { id: true, name: true, image: true } },
          tags: { include: { tag: true } },
          _count: { select: { votes: true, comments: true, bookmarks: true } },
        },
      }),
      prisma.resource.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: resources,
        total,
        page,
        pageSize,
        hasMore: page * pageSize < total,
      },
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

// POST /api/resources — Submit a new resource
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = session.user as any;

    // Check tier limits for FREE users
    if (user.tier === "FREE" || !user.tier) {
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const monthlySubmissions = await prisma.resource.count({
        where: {
          authorId: user.id,
          createdAt: { gte: currentMonth },
        },
      });

      if (monthlySubmissions >= 5) {
        return NextResponse.json(
          { success: false, error: "Free tier limit: 5 submissions per month. Upgrade to Pro for unlimited." },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const { title, description, url, type, tags, fileUrl } = body;

    if (!title || !type) {
      return NextResponse.json(
        { success: false, error: "Title and type are required" },
        { status: 400 }
      );
    }

    // AI Pipeline — run in parallel
    let summary = "";
    let suggestedTags: string[] = tags || [];
    let qualityScore = 50;

    try {
      const [aiSummary, aiScore] = await Promise.all([
        summarizeResource(title, url, description),
        scoreQuality(title, description || title, url),
      ]);

      summary = aiSummary;
      qualityScore = aiScore;

      if (!tags || tags.length === 0) {
        suggestedTags = await suggestTags(title, summary);
      }
    } catch (aiError) {
      console.error("AI pipeline error (non-fatal):", aiError);
      summary = description || "";
    }

    // Upsert tags
    const tagRecords = await Promise.all(
      suggestedTags.map((tagName: string) =>
        prisma.tag.upsert({
          where: { name: tagName.toLowerCase().trim() },
          update: {},
          create: { name: tagName.toLowerCase().trim() },
        })
      )
    );

    // Create resource
    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        url,
        fileUrl,
        type,
        summary,
        qualityScore,
        authorId: user.id,
        tags: {
          create: tagRecords.map((t) => ({ tagId: t.id })),
        },
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        tags: { include: { tag: true } },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "SUBMIT_RESOURCE",
        details: `Submitted: ${title}`,
      },
    });

    return NextResponse.json(
      { success: true, data: resource },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create resource" },
      { status: 500 }
    );
  }
}
