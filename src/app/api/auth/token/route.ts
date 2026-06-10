import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { encode } from "next-auth/jwt";

export const dynamic = "force-dynamic";

// Handle CORS preflight requests from browsers (Expo web view, etc.)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

/**
 * POST endpoint to authenticate credentials and generate a secure JWT token.
 * Enables API-driven integrations, headless applications, and mobile apps to interact
 * securely with store APIs.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new NextResponse("Email and password are required", { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return new NextResponse("Invalid email or password", { status: 401 });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      return new NextResponse("Invalid email or password", { status: 401 });
    }

    // Standardize encoding using NextAuth JWT standard structures and secrets
    const token = await encode({
      token: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      secret: process.env.NEXTAUTH_SECRET!,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[AUTH_TOKEN_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
