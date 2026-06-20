import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Fox Falcon",
  description: "Read the Fox Falcon privacy policy to understand how we safeguard your personal information, customized artwork, and transaction history.",
};

export default function PrivacyPage() {
  return (
    <div className="container px-6 mx-auto pt-32 pb-20 max-w-4xl text-foreground bg-background">
      {/* Back button */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      {/* Page Header */}
      <div className="space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5" /> Security & Privacy
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
          PRIVACY POLICY
        </h1>
        <p className="text-muted-foreground text-sm">
          Last Updated: June 16, 2026. Your privacy and trust are paramount to Fox Falcon.
        </p>
      </div>

      {/* Main Content Card */}
      <Card className="p-8 md:p-10 border border-border bg-card rounded-3xl space-y-10 shadow-lg">
        {/* Intro */}
        <div className="space-y-3">
          <h3 className="font-sans font-black text-sm uppercase tracking-widest text-primary">
            1. Information We Collect
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We collect personal information that you directly provide to us when creating an account, ordering custom garments, or filling out profile details. This includes your name, email address, physical delivery addresses, and any graphic files you upload to our Creator Studio canvas.
          </p>
        </div>

        {/* How We Use Information */}
        <div className="space-y-3">
          <h3 className="font-sans font-black text-sm uppercase tracking-widest text-primary">
            2. How We Use Your Data
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your personal data is used to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Process, print, and ship your streetwear orders.</li>
            <li>Maintain your user profile, saved addresses, and active order records.</li>
            <li>Track and credit your loyalty stamps on your digital loyalty card.</li>
            <li>Provide real-time updates regarding order status using secure notification servers.</li>
          </ul>
        </div>

        {/* Data Protection */}
        <div className="space-y-3">
          <h3 className="font-sans font-black text-sm uppercase tracking-widest text-primary">
            3. Data Protection & Encryption
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We implement industry-standard administrative, technical, and physical security measures to safeguard your personal data. All connection endpoints are encrypted using SSL/TLS protocols, ensuring data integrity. Simulated credit card details entered in the checkout form are never processed on live bank networks.
          </p>
        </div>

        {/* Graphic Uploads */}
        <div className="space-y-3">
          <h3 className="font-sans font-black text-sm uppercase tracking-widest text-primary">
            4. Art assets & Graphics Privacy
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Any artwork, logo, or text uploaded to our custom design studio is strictly private. We do not index, share, or sell your design assets to any external marketing agencies. They are hosted securely in our product storage containers exclusively for printing and order validation.
          </p>
        </div>

        {/* Cookies */}
        <div className="space-y-3">
          <h3 className="font-sans font-black text-sm uppercase tracking-widest text-primary">
            5. Cookies & Local Storage
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use persistent local storage mechanisms and session cookies to maintain your login status, active shopping cart, and theme preferences (Light/Dark mode) across browser visits. You can adjust your browser settings to disable cookies, though this may limit your ability to place orders.
          </p>
        </div>

        {/* Third Parties */}
        <div className="space-y-3">
          <h3 className="font-sans font-black text-sm uppercase tracking-widest text-primary">
            6. Third-Party Service Providers
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We only share data with essential third-party service providers (such as logistics carriers for shipping packages, and real-time notification brokers to handle status updates). These third parties are contractually bound to process your data strictly in accordance with our instructions and privacy regulations.
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="font-sans font-black text-sm uppercase tracking-widest text-primary">
            7. Contact Us
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you have questions about our privacy policies or wish to request the deletion of your account records, please contact us at <span className="text-foreground font-semibold">support@foxfalcon.com</span>.
          </p>
        </div>
      </Card>
    </div>
  );
}
