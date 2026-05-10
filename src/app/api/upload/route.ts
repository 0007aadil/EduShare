import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadPDF } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDFs are allowed" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const secure_url = await uploadPDF(buffer, file.name);

    return NextResponse.json({ success: true, secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
