import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Fox Falcon",
  description: "Get in touch with the Fox Falcon customer support team for inquiries regarding orders, shipping, custom designs, or store locations.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
