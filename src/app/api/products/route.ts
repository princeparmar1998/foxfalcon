import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const isFeatured = searchParams.get("isFeatured");

    const products = await db.product.findMany({
      where: {
        categoryId: categoryId || undefined,
        isFeatured: isFeatured === "true" ? true : undefined,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, description, price, categoryId, images, inventory, sizes, colors, isFeatured } = body;

    if (!name || !description || !price || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const product = await db.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        images,
        inventory,
        sizes,
        colors,
        isFeatured,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
