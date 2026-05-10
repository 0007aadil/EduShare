import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/resources/[id]
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    const resource = await prisma.resource.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, image: true } },
        tags: { include: { tag: true } },
        comments: {
          where: { parentId: null },
          include: {
            user: { select: { id: true, name: true, image: true } },
            replies: {
              include: {
                user: { select: { id: true, name: true, image: true } },
              },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { votes: true, comments: true, bookmarks: true } },
      },
    });

    if (!resource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.resource.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    // Get user-specific data
    let userVote = null;
    let userBookmark = null;
    if (session?.user) {
      const userId = (session.user as any).id;
      [userVote, userBookmark] = await Promise.all([
        prisma.vote.findUnique({ where: { userId_resourceId: { userId, resourceId: id } } }),
        prisma.bookmark.findUnique({ where: { userId_resourceId: { userId, resourceId: id } } }),
      ]);
    }

    // Get vote counts
    const [upvotes, downvotes] = await Promise.all([
      prisma.vote.count({ where: { resourceId: id, type: "UP" } }),
      prisma.vote.count({ where: { resourceId: id, type: "DOWN" } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...resource,
        upvotes,
        downvotes,
        netVotes: upvotes - downvotes,
        userVote: userVote?.type || null,
        isBookmarked: !!userBookmark,
      },
    });
  } catch (error) {
    console.error("Error fetching resource:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resource" },
      { status: 500 }
    );
  }
}
