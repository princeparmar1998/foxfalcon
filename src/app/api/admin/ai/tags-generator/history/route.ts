import { NextResponse } from "next/server";
import { getSessionOrJwt } from "@/lib/jwt-auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getSessionOrJwt(req);
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const history = await db.aiImageTags.findMany({
      orderBy: { createdAt: "desc" },
      take: 20
    });

    return NextResponse.json(history);
  } catch (error: any) {
    console.error("[TAGS_HISTORY_GET]", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
