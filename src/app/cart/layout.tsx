import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Shopping Bag | Fox Falcon",
  description: "Review items in your shopping bag. Adjust quantities, calculate delivery parameters, and proceed to secure checkout.",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
