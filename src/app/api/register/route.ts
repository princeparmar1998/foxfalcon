import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        error: "All fields are required"
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: "User with this email already exists"
      }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with USER role explicitly
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER" // Explicitly setting USER role
      }
    });

    return NextResponse.json({
      success: true,
      message: "Account successfully created!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error: any) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json({
      success: false,
      error: error.message || "An unexpected error occurred"
    }, { status: 500 });
  }
}
