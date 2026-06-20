import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Wishlist | Fox Falcon",
  description: "View and manage your favorite premium heavyweight streetwear and custom graphic tees in your wishlist.",
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
