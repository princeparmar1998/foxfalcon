import { NextResponse } from "next/server";
import { getSessionOrJwt } from "@/lib/jwt-auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET: Fetch reviews for a specific product
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reviews = await db.review.findMany({
      where: { productId: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("[REVIEWS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST: Add a review for a product
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionOrJwt(req);

    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return new NextResponse("Rating must be between 1 and 5", { status: 400 });
    }

    if (!comment || !comment.trim()) {
      return new NextResponse("Comment is required", { status: 400 });
    }

    // Check if the product exists
    const product = await db.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Check if the user has already reviewed this product
    const existingReview = await db.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: params.id,
        },
      },
    });

    if (existingReview) {
      return new NextResponse("You have already reviewed this product", { status: 400 });
    }

    const review = await db.review.create({
      data: {
        rating: parseInt(rating),
        comment: comment.trim(),
        userId: session.user.id,
        productId: params.id,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("[REVIEWS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PUT: Edit user's own review
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionOrJwt(req);

    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return new NextResponse("Rating must be between 1 and 5", { status: 400 });
    }

    if (!comment || !comment.trim()) {
      return new NextResponse("Comment is required", { status: 400 });
    }

    // Find the review belonging to this user for this product
    const review = await db.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: params.id,
        },
      },
    });

    if (!review) {
      return new NextResponse("Review not found", { status: 404 });
    }

    const updatedReview = await db.review.update({
      where: { id: review.id },
      data: {
        rating: parseInt(rating),
        comment: comment.trim(),
      },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error("[REVIEWS_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE: Delete user's own review
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionOrJwt(req);

    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the review belonging to this user for this product
    const review = await db.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: params.id,
        },
      },
    });

    if (!review) {
      return new NextResponse("Review not found", { status: 404 });
    }

    // Ensure user is the owner or an ADMIN
    if (review.userId !== session.user.id && session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.review.delete({
      where: { id: review.id },
    });

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("[REVIEWS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
