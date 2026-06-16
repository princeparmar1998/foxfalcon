import { NextResponse } from "next/server";
import { getSessionOrJwt } from "@/lib/jwt-auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionOrJwt(req);

    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingProduct = await db.product.findUnique({
      where: { id: params.id }
    });

    if (!existingProduct) {
      return new NextResponse("Product not found", { status: 404 });
    }

    let cleanName = existingProduct.name;
    while (cleanName.startsWith("[DELETED]")) {
      cleanName = cleanName.replace("[DELETED]", "").trim();
    }

    const product = await db.product.update({
      where: { id: params.id },
      data: {
        name: cleanName,
        deletedAt: null,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_RESTORE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
