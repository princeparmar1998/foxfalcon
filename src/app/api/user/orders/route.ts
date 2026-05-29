import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET user's own orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const orders = await db.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, images: true },
            },
          },
        },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[USER_ORDERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
