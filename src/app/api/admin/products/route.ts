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

    const products = await db.product.findMany({
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
    const session = await getSessionOrJwt(req);

    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, description, price, categoryName, inventory, image, images, sizes, colors, isFeatured } = body;

    if (!name || !description || !price || !categoryName) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Safely find or create the category
    const category = await db.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });

    const product = await db.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        images: Array.isArray(images) && images.length > 0
          ? images
          : image
            ? [image]
            : [],
        categoryId: category.id,
        inventory: parseInt(inventory) || 0,
        sizes: sizes || [],
        colors: colors || [],
        isFeatured: !!isFeatured,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
