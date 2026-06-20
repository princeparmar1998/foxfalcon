import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout | Fox Falcon",
  description: "Complete your order securely at Fox Falcon. Select shipping options, apply members discounts, and finalize your purchase.",
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
