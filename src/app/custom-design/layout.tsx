import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creator Lab — Custom Streetwear | Fox Falcon",
  description: "Design your own custom T-shirt. Upload transparent artwork assets to preview graphic placements on premium heavy-GSM blanks in our Creator Lab.",
};

export default function CustomDesignLayout({ children }: { children: React.ReactNode }) {
  return children;
}
