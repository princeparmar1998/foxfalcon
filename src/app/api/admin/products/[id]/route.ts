import { NextResponse } from "next/server";
import { getSessionOrJwt } from "@/lib/jwt-auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionOrJwt(req);

    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if product has any order items
    const orderItemCount = await db.orderItem.count({
      where: { productId: params.id },
    });

    if (orderItemCount > 0) {
      // Soft delete: set inventory 0, unfeature - can't hard delete due to FK constraints
      const product = await db.product.update({
        where: { id: params.id },
        data: { inventory: 0, isFeatured: false, name: `[DELETED] ${(await db.product.findUnique({ where: { id: params.id }, select: { name: true } }))?.name}` },
      });
      return NextResponse.json({ ...product, softDeleted: true });
    }

    const product = await db.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

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
    const { name, description, price, categoryName, inventory, image, images, sizes, colors, isFeatured } = body;

    const data: any = {};
    if (name) data.name = name;
    if (description) data.description = description;
    if (price !== undefined) data.price = parseFloat(price);
    if (inventory !== undefined) data.inventory = parseInt(inventory) || 0;
    if (images !== undefined) {
      data.images = images;
    } else if (image !== undefined) {
      data.images = image ? [image] : [];
    }
    if (sizes !== undefined) data.sizes = sizes;
    if (colors !== undefined) data.colors = colors;
    if (isFeatured !== undefined) data.isFeatured = !!isFeatured;

    if (categoryName) {
      const category = await db.category.upsert({
        where: { name: categoryName },
        update: {},
        create: { name: categoryName },
      });
      data.categoryId = category.id;
    }

    const product = await db.product.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
