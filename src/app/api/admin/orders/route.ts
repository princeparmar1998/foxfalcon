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

export async function DELETE(req: Request) {
  try {
    const session = await getSessionOrJwt(req);

    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { orderIds } = body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return new NextResponse("Order IDs are required", { status: 400 });
    }

    // Delete associated OrderItem records first due to foreign key references
    await db.orderItem.deleteMany({
      where: {
        orderId: {
          in: orderIds
        }
      }
    });

    // Delete the Order records
    const deleteResult = await db.order.deleteMany({
      where: {
        id: {
          in: orderIds
        }
      }
    });

    return NextResponse.json({ success: true, count: deleteResult.count });
  } catch (error) {
    console.error("[ORDERS_BATCH_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
