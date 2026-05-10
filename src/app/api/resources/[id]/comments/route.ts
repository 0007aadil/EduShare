import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/resources/[id]/comments — Create a comment
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
    const { content, parentId } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ success: false, error: "Comment cannot be empty" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId,
        resourceId,
        parentId: parentId || null,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch (error) {
    console.error("Comment error:", error);
    return NextResponse.json({ success: false, error: "Failed to create comment" }, { status: 500 });
  }
}

// DELETE /api/resources/[id]/comments — Delete a comment
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;
    const { commentId } = await req.json();

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment) {
      return NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 });
    }

    if (comment.userId !== userId && userRole !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete comment error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete comment" }, { status: 500 });
  }
}
