import { NextResponse } from "next/server";
import { getSessionOrJwt } from "@/lib/jwt-auth";
import { MemoryEngine } from "@/lib/ai/engines/memory.engine";

export async function GET(req: Request) {
  try {
    const session = await getSessionOrJwt(req);
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const memories = MemoryEngine.getAll();
    return NextResponse.json(memories);
  } catch (error) {
    console.error("[AI_WORKSPACE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionOrJwt(req);
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { category, content, tags } = await req.json();
    if (!category || !content) {
      return NextResponse.json({ error: "Missing category or content" }, { status: 400 });
    }

    const newItem = MemoryEngine.add(category, content, tags || []);
    return NextResponse.json(newItem);
  } catch (error: any) {
    console.error("[AI_WORKSPACE_POST]", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
