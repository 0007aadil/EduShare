import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/resources/[id]/vote — { type: "UP" | "DOWN" }
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
    const { type } = await req.json();

    if (!["UP", "DOWN"].includes(type)) {
      return NextResponse.json({ success: false, error: "Invalid vote type" }, { status: 400 });
    }

    const existing = await prisma.vote.findUnique({
      where: { userId_resourceId: { userId, resourceId } },
    });

    if (existing) {
      if (existing.type === type) {
        // Remove vote (toggle off)
        await prisma.vote.delete({
          where: { id: existing.id },
        });
        return NextResponse.json({ success: true, data: { action: "removed" } });
      } else {
        // Change vote
        await prisma.vote.update({
          where: { id: existing.id },
          data: { type },
        });
        return NextResponse.json({ success: true, data: { action: "changed", type } });
      }
    }

    // New vote
    await prisma.vote.create({
      data: { type, userId, resourceId },
    });

    return NextResponse.json({ success: true, data: { action: "created", type } });
  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json({ success: false, error: "Failed to vote" }, { status: 500 });
  }
}
