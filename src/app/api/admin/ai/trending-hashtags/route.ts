import { NextResponse } from "next/server";
import { getSessionOrJwt } from "@/lib/jwt-auth";
import { db } from "@/lib/db";

const DEFAULT_STREETWEAR_HASHTAGS = [
  { tag: "streetwear", popularity: 98, category: "streetwear" },
  { tag: "hypebeast", popularity: 95, category: "streetwear" },
  { tag: "luxurywear", popularity: 92, category: "luxury" },
  { tag: "oversized", popularity: 94, category: "style" },
  { tag: "frenchterry", popularity: 88, category: "fabric" },
  { tag: "hoodie", popularity: 90, category: "product" },
  { tag: "urbanfashion", popularity: 89, category: "streetwear" },
  { tag: "minimalist", popularity: 85, category: "luxury" },
  { tag: "dropculture", popularity: 91, category: "marketing" },
  { tag: "outfitoftheday", popularity: 96, category: "social" },
  { tag: "d2cfashion", popularity: 84, category: "business" },
  { tag: "premiumcotton", popularity: 87, category: "fabric" }
];

export async function GET(req: Request) {
  try {
    const session = await getSessionOrJwt(req);
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let hashtags = await db.trendingHashtag.findMany({
      orderBy: { popularity: "desc" }
    });

    // Seed default hashtags if table is empty
    if (hashtags.length === 0) {
      const seedPromises = DEFAULT_STREETWEAR_HASHTAGS.map((h) =>
        db.trendingHashtag.upsert({
          where: { tag: h.tag },
          update: { popularity: h.popularity, category: h.category },
          create: { tag: h.tag, popularity: h.popularity, category: h.category }
        })
      );
      await Promise.all(seedPromises);
      hashtags = await db.trendingHashtag.findMany({
        orderBy: { popularity: "desc" }
      });
    }

    return NextResponse.json(hashtags);
  } catch (error: any) {
    console.error("[TRENDING_HASHTAGS_GET]", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionOrJwt(req);
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { tag, popularity, category } = await req.json();
    if (!tag) {
      return NextResponse.json({ error: "Missing tag name" }, { status: 400 });
    }

    const cleanTag = tag.trim().replace(/^#/, "").toLowerCase();

    const hashtag = await db.trendingHashtag.upsert({
      where: { tag: cleanTag },
      update: {
        popularity: popularity !== undefined ? Number(popularity) : { increment: 1 },
        category: category || "general"
      },
      create: {
        tag: cleanTag,
        popularity: popularity !== undefined ? Number(popularity) : 1,
        category: category || "general"
      }
    });

    return NextResponse.json(hashtag);
  } catch (error: any) {
    console.error("[TRENDING_HASHTAGS_POST]", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
