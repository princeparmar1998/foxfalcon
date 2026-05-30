import { NextResponse } from "next/server";
import { getSessionOrJwt } from "@/lib/jwt-auth";
import { db } from "@/lib/db";

// PATCH - update user name
export async function PATCH(req: Request) {
  try {
    const session = await getSessionOrJwt(req);

    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || name.trim().length < 2) {
      return new NextResponse("Name must be at least 2 characters", { status: 400 });
    }

    const updated = await db.user.update({
      where: { id: session.user.id },
      data: { name: name.trim() },
    });

    return NextResponse.json({ name: updated.name });
  } catch (error) {
    console.error("[USER_PROFILE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
