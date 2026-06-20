import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In | Fox Falcon",
  description: "Log in to your Fox Falcon profile to check order status, view loyalty stamps, and access the Creator Studio.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
