import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const getHandler = (req: Request, ctx: any) => {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  if (host) {
    process.env.NEXTAUTH_URL = `${proto}://${host}`;
  }
  return NextAuth(authOptions)(req, ctx);
};

const postHandler = (req: Request, ctx: any) => {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  if (host) {
    process.env.NEXTAUTH_URL = `${proto}://${host}`;
  }
  return NextAuth(authOptions)(req, ctx);
};

export { getHandler as GET, postHandler as POST };
