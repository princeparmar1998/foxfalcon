import { NextResponse } from "next/server";
import { getSessionOrJwt } from "@/lib/jwt-auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getSessionOrJwt(req);

    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const orders = await db.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        address: true,
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
