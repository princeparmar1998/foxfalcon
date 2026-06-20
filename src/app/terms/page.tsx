import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Scale, FileText, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Fox Falcon",
  description: "Review the Fox Falcon terms of service governing user accounts, dynamic print customization, simulated purchases, and our rewards system.",
};

export default function TermsPage() {
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
          <Scale className="w-3.5 h-3.5" /> Legal Framework
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
          TERMS OF SERVICE
        </h1>
        <p className="text-muted-foreground text-sm">
          Last Updated: June 16, 2026. Please read these terms carefully before accessing our store services.
        </p>
      </div>

      {/* Main Content Card */}
      <Card className="p-8 md:p-10 border border-border bg-card rounded-3xl space-y-10 shadow-lg">
        {/* Intro */}
        <div className="space-y-3">
          <h3 className="font-sans font-black text-sm uppercase tracking-widest text-primary">
            1. Agreement to Terms
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By accessing or using the Fox Falcon store website, mobile application, or any other digital platform (collectively, the "Services"), you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not access or use the Services.
          </p>
        </div>

        {/* User Account */}
        <div className="space-y-3">
          <h3 className="font-sans font-black text-sm uppercase tracking-widest text-primary">
            2. Customer Account Responsibility
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            When you create an account with us, you represent and warrant that the information you provide is accurate, complete, and current at all times. You are entirely responsible for maintaining the confidentiality of your credentials, and you agree to accept responsibility for any and all activities that occur under your account.
          </p>
        </div>

        {/* Custom Designs */}
        <div className="space-y-3">
          <h3 className="font-sans font-black text-sm uppercase tracking-widest text-primary">
            3. Creator Studio & Custom Printing
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By uploading custom designs or graphics to our Creator Studio, you grant Fox Falcon a non-exclusive, royalty-free, worldwide license to host, store, and print those assets solely for the purpose of fulfilling your customized apparel orders. You warrant that you own or have the necessary intellectual property rights for any content you upload, and that it does not violate any third-party copyrights or trademarks.
          </p>
        </div>

        {/* Orders & Payments */}
        <div className="space-y-3">
          <h3 className="font-sans font-black text-sm uppercase tracking-widest text-primary">
            4. Purchase Orders & Simulated Payment System
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All prices are calculated in Indian Rupees (₹). We reserve the right to refuse or cancel any order at our discretion. Our credit/debit card payment system currently operates as a simulated sandbox environment for demonstration purposes. Cash on Delivery (COD) orders represent binding requests for delivery, and customers must make ready the exact amount upon package arrival.
          </p>
        </div>

        {/* Loyalty Program */}
        <div className="space-y-3">
          <h3 className="font-sans font-black text-sm uppercase tracking-widest text-primary">
            5. Loyalty Stamp System
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Fox Falcon operates a digital stamp and reward program. Stamps are collected upon successful delivery of qualifying purchases. Rewards have no cash redemption value, are non-transferable, and may be modified or terminated under program policies at any time without prior notice.
          </p>
        </div>

        {/* Limitations */}
        <div className="space-y-3">
          <h3 className="font-sans font-black text-sm uppercase tracking-widest text-primary">
            6. Limitation of Liability
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            In no event shall Fox Falcon, nor its directors, employees, or developers (including Prince Parmar), be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of the website or customized apparel products.
          </p>
        </div>

        {/* Governing Law */}
        <div className="space-y-3">
          <h3 className="font-sans font-black text-sm uppercase tracking-widest text-primary">
            7. Governing Law
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>
        </div>
      </Card>
    </div>
  );
}
