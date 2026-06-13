import { NextResponse } from "next/server";
import { getSessionOrJwt } from "@/lib/jwt-auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getSessionOrJwt(req);

    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Count all active orders placed by this user (exclude cancelled/rejected ones)
    const ordersCount = await db.order.count({
      where: {
        userId: session.user.id,
        status: {
          notIn: ["CANCELLED", "REJECTED"],
        },
      },
    });

    // 7 stamps per cycle
    const stampCount = ordersCount % 7;
    const isRewardReady = stampCount === 0 && ordersCount > 0;
    const stampsToShow = isRewardReady ? 7 : stampCount;

    return NextResponse.json({
      ordersCount,
      stamps: stampsToShow,
      isRewardReady,
    });
  } catch (error) {
    console.error("[USER_LOYALTY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
