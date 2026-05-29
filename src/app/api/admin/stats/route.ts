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

    // Total revenue from delivered/shipped orders
    const revenueResult = await db.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: { in: ["DELIVERED", "SHIPPED", "PROCESSING"] },
      },
    });

    // Previous period revenue (last 30 days vs prior 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const currentRevenue = await db.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: { in: ["DELIVERED", "SHIPPED", "PROCESSING"] },
      },
    });

    const previousRevenue = await db.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        status: { in: ["DELIVERED", "SHIPPED", "PROCESSING"] },
      },
    });

    // Total orders
    const totalOrders = await db.order.count();
    const currentOrders = await db.order.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });
    const previousOrders = await db.order.count({
      where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
    });

    // Total customers
    const totalCustomers = await db.user.count({
      where: { role: "USER" },
    });
    const currentCustomers = await db.user.count({
      where: { role: "USER", createdAt: { gte: thirtyDaysAgo } },
    });
    const previousCustomers = await db.user.count({
      where: { role: "USER", createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
    });

    // Products in stock
    const totalProducts = await db.product.count();
    const outOfStock = await db.product.count({ where: { inventory: 0 } });

    // Calculate percentage changes
    const calcChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return parseFloat((((current - previous) / previous) * 100).toFixed(1));
    };

    const curRev = parseFloat(currentRevenue._sum.totalAmount?.toString() || "0");
    const prevRev = parseFloat(previousRevenue._sum.totalAmount?.toString() || "0");

    return NextResponse.json({
      totalRevenue: parseFloat(revenueResult._sum.totalAmount?.toString() || "0"),
      revenueChange: calcChange(curRev, prevRev),
      totalOrders,
      ordersChange: calcChange(currentOrders, previousOrders),
      totalCustomers,
      customersChange: calcChange(currentCustomers, previousCustomers),
      totalProducts,
      outOfStock,
    });
  } catch (error) {
    console.error("[ADMIN_STATS]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
