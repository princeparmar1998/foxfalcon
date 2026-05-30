import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { decode } from "next-auth/jwt";

export interface AuthenticatedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: "USER" | "ADMIN";
}

export interface AuthenticatedSession {
  user: AuthenticatedUser;
}

/**
 * Retrieves the current authenticated user session dynamically.
 * First checks cookie-based sessions (standard web), then falls back to verifying
 * standard JWT tokens from the Authorization Bearer header (headless/API clients).
 */
export async function getSessionOrJwt(req: Request): Promise<AuthenticatedSession | null> {
  // 1. Try standard cookie-based NextAuth session
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      return {
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: (session.user as any).role || "USER",
        }
      };
    }
  } catch (err) {
    console.error("Cookie session parsing failed:", err);
  }

  // 2. Try standard JWT token from Authorization header
  try {
    const authHeader = req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      const decoded = await decode({
        token,
        secret: process.env.NEXTAUTH_SECRET!,
      });

      if (decoded && decoded.id) {
        return {
          user: {
            id: decoded.id as string,
            name: decoded.name as string,
            email: decoded.email as string,
            role: (decoded.role as "USER" | "ADMIN") || "USER",
          }
        };
      }
    }
  } catch (err) {
    console.error("JWT Bearer token verification failed:", err);
  }

  return null;
}
