import { NextResponse } from "next/server";
import { getSessionOrJwt } from "@/lib/jwt-auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET user's own orders, or all orders if admin calls with all=true
export async function GET(req: Request) {
  try {
    const session = await getSessionOrJwt(req);

    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const getAll = searchParams.get("all") === "true";
    const isAdmin = (session.user as any).role === "ADMIN";

    const whereClause = getAll && isAdmin ? {} : { userId: session.user.id };

    const orders = await db.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: {
              select: { name: true, images: true },
            },
          },
        },
        address: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[USER_ORDERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
