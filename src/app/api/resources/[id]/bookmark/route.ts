import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/resources/[id]/bookmark — Toggle bookmark
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: resourceId } = await params;
    const userId = (session.user as any).id;
    const userTier = (session.user as any).tier;

    const existing = await prisma.bookmark.findUnique({
      where: { userId_resourceId: { userId, resourceId } },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, data: { bookmarked: false } });
    }

    // Check tier limits
    if (userTier === "FREE" || !userTier) {
      const bookmarkCount = await prisma.bookmark.count({ where: { userId } });
      if (bookmarkCount >= 20) {
        return NextResponse.json(
          { success: false, error: "Free tier limit: 20 bookmarks. Upgrade to Pro for unlimited." },
          { status: 403 }
        );
      }
    }

    await prisma.bookmark.create({ data: { userId, resourceId } });
    return NextResponse.json({ success: true, data: { bookmarked: true } });
  } catch (error) {
    console.error("Bookmark error:", error);
    return NextResponse.json({ success: false, error: "Failed to bookmark" }, { status: 500 });
  }
}
