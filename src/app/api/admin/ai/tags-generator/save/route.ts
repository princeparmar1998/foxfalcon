import { NextResponse } from "next/server";
import { getSessionOrJwt } from "@/lib/jwt-auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getSessionOrJwt(req);
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { imageUrl, title, tags, hashtags, caption, description } = await req.json();

    if (!imageUrl || !title) {
      return NextResponse.json({ error: "Missing required fields: imageUrl and title are mandatory." }, { status: 400 });
    }

    const savedRecord = await db.aiImageTags.create({
      data: {
        imageUrl,
        title,
        tags: tags || [],
        hashtags: hashtags || [],
        caption: caption || "",
        description: description || ""
      }
    });

    // Increment popularity of used hashtags in the trending table (200% IQ feedback loop)
    if (hashtags && hashtags.length > 0) {
      try {
        const updatePromises = hashtags.map((h: string) => {
          const cleanTag = h.replace(/^#/, "").toLowerCase().trim();
          if (!cleanTag) return Promise.resolve();
          return db.trendingHashtag.upsert({
            where: { tag: cleanTag },
            update: { popularity: { increment: 2 } },
            create: { tag: cleanTag, popularity: 2, category: "auto-used" }
          });
        });
        await Promise.all(updatePromises);
      } catch (dbErr) {
        console.warn("Failed to increment hashtag popularities:", dbErr);
      }
    }

    return NextResponse.json(savedRecord);
  } catch (error: any) {
    console.error("[TAGS_SAVE_POST]", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
