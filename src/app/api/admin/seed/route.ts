import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function GET(req: Request) {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await db.user.upsert({
      where: { email: "admin@foxfalcon.com" },
      update: {
        password: hashedPassword,
        role: "ADMIN",
      },
      create: {
        name: "Fox Falcon Admin",
        email: "admin@foxfalcon.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin seeded successfully in Neon Postgres!",
      email: admin.email,
      credentials: {
        email: "admin@foxfalcon.com",
        password: "admin123"
      }
    });
  } catch (error: any) {
    console.error("[SEED_ERROR]", error);
    return NextResponse.json({
      success: false,
      error: error.message || error,
    }, { status: 500 });
  }
}
