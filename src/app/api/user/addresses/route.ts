import { NextResponse } from "next/server";
import { getSessionOrJwt } from "@/lib/jwt-auth";
import { db } from "@/lib/db";

// GET user's addresses
export async function GET(req: Request) {
  try {
    const session = await getSessionOrJwt(req);

    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const addresses = await db.address.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: "desc" },
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("[USER_ADDRESSES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST create a new address
export async function POST(req: Request) {
  try {
    const session = await getSessionOrJwt(req);

    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { street, city, state, postalCode, country, isDefault } = body;

    if (!street || !city || !state || !postalCode || !country) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // If setting as default, unset existing defaults
    if (isDefault) {
      await db.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const address = await db.address.create({
      data: {
        userId: session.user.id,
        street,
        city,
        state,
        postalCode,
        country,
        isDefault: !!isDefault,
      },
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error("[USER_ADDRESSES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE an address
export async function DELETE(req: Request) {
  try {
    const session = await getSessionOrJwt(req);

    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Address ID required", { status: 400 });
    }

    // Ensure user owns this address
    const address = await db.address.findUnique({ where: { id } });
    if (!address || address.userId !== session.user.id) {
      return new NextResponse("Not found", { status: 404 });
    }

    await db.address.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[USER_ADDRESSES_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
