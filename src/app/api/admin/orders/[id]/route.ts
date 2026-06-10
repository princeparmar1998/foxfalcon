import { NextResponse } from "next/server";
import { getSessionOrJwt } from "@/lib/jwt-auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { sendUserOrderStatusEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionOrJwt(req);

    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return new NextResponse("Status is required", { status: 400 });
    }

    const order = await db.order.update({
      where: { id: params.id },
      data: { status },
    });

    // Trigger Pusher update for the user tracking the order
    if (pusherServer) {
      await pusherServer.trigger(`order-${params.id}`, "status-update", {
        status: status,
      });
    }

    // Send order confirmation/processing email to the user
    // if (status === "PROCESSING") {
    //   sendUserOrderStatusEmail(order.id, "PROCESSING").catch((err) => {
    //     console.error("[USER_MAIL_ERROR] Failed to send order processing email:", err);
    //   });
    // }

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
