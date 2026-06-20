import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order | Fox Falcon",
  description: "Track your Fox Falcon streetwear orders in real-time. Enter your order ID to see processing, printing, and shipping updates.",
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
