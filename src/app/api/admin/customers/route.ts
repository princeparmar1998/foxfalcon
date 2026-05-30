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

    const customers = await db.user.findMany({
      where: { role: "USER" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        addresses: {
          select: {
            id: true,
            street: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
            isDefault: true,
          },
        },
        _count: {
          select: { orders: true },
        },
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate total spent per customer
    const enriched = customers.map((c: any) => ({
      ...c,
      totalSpent: c.orders
        .reduce((sum: number, o: any) => sum + parseFloat(o.totalAmount.toString()), 0)
        .toFixed(2),
      orderHistory: c.orders, // keep the details of orders for the front-end modal
      orders: undefined, // remove raw orders reference from response
    }));

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("[ADMIN_CUSTOMERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
