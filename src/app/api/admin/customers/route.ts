import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const isDev = process.env.NODE_ENV === "development";

    if (!isDev && (!session || session.user?.role !== "ADMIN")) {
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
          select: { totalAmount: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate total spent per customer
    const enriched = customers.map((c) => ({
      ...c,
      totalSpent: c.orders
        .reduce((sum, o) => sum + parseFloat(o.totalAmount.toString()), 0)
        .toFixed(2),
      orders: undefined, // remove raw orders from response
    }));

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("[ADMIN_CUSTOMERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
