import { NextResponse } from "next/server";
import { getSessionOrJwt } from "@/lib/jwt-auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET: Fetch all reviews system-wide (Admin only)
export async function GET(req: Request) {
  try {
    const session = await getSessionOrJwt(req);

    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const reviews = await db.review.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("[ADMIN_REVIEWS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE: Delete any review by ID (Admin only)
export async function DELETE(req: Request) {
  try {
    const session = await getSessionOrJwt(req);

    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("id");

    if (!reviewId) {
      return new NextResponse("Review ID is required", { status: 400 });
    }

    await db.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ message: "Review deleted successfully by Admin" });
  } catch (error) {
    console.error("[ADMIN_REVIEWS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
