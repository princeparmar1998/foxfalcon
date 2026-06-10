import { NextResponse } from "next/server";
import { getSessionOrJwt } from "@/lib/jwt-auth";
import { db } from "@/lib/db";
import { sendOrderNotificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const session = await getSessionOrJwt(req);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { items, addressId, paymentMethod, cardDetails } = await req.json();

    if (!items || items.length === 0) {
      return new NextResponse("No items in cart", { status: 400 });
    }

    if (!addressId) {
      return new NextResponse("Address is required", { status: 400 });
    }

    // Fetch a fallback product to avoid foreign key violations for custom designer items
    const fallbackProduct = await db.product.findFirst();
    if (!fallbackProduct) {
      return new NextResponse("Database must contain at least one product to check out", { status: 400 });
    }

    // Verify all item productIds exist, otherwise map to fallback
    const verifiedItems = [];
    for (const item of items) {
      const dbProduct = await db.product.findUnique({
        where: { id: item.id }
      });
      verifiedItems.push({
        ...item,
        dbId: dbProduct ? dbProduct.id : fallbackProduct.id
      });
    }

    // Set order status based on payment type
    // COD starts as PENDING, CARD (since dummy payment is mock-completed successfully) starts as PROCESSING
    const initialStatus = paymentMethod === "COD" ? "PENDING" : "PROCESSING";

    // Create Order in DB directly
    const order = await db.order.create({
      data: {
        userId: session.user.id,
        addressId: addressId,
        totalAmount: items.reduce((total: number, item: any) => total + item.price * item.quantity, 0),
        status: initialStatus,
        items: {
          create: verifiedItems.map((item: any) => ({
            productId: item.dbId,
            quantity: item.quantity,
            price: item.price,
            size: item.size || null,
            color: item.color || null,
          })),
        },
      },
    });

    // Send order notification email to admin (non-blocking)
    // sendOrderNotificationEmail(order.id).catch((err) => {
    //   console.error("[CHECKOUT_MAIL_ERROR]", err);
    // });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("[CHECKOUT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
