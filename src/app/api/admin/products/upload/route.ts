import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as unknown as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    // Generate unique filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}-${safeName}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Vercel has a read-only filesystem except /tmp
    // Try public/uploads first (works locally), fallback to /tmp (works on Vercel)
    let url = "";
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);
      url = `/uploads/products/${fileName}`;
    } catch {
      // Filesystem is read-only (Vercel) — fallback to base64 data URL
      const mimeType = file.type || "image/png";
      url = `data:${mimeType};base64,${buffer.toString("base64")}`;
    }

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
