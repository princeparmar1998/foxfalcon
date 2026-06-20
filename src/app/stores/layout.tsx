import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Stores | Fox Falcon",
  description: "Locate Fox Falcon premium streetwear stores near you. Find locations, directions, and hours of operation.",
};

export default function StoresLayout({ children }: { children: React.ReactNode }) {
  return children;
}
