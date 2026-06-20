import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Profile | Fox Falcon",
  description: "Manage your Fox Falcon account, profile details, delivery addresses, and view your VIP loyalty status.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
