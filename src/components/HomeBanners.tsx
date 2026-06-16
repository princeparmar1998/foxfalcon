"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gift, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StoreLocatorBanner() {
  const router = useRouter();
  const [zipCode, setZipCode] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.trim()) {
      router.push(`/stores?search=${encodeURIComponent(zipCode.trim())}`);
    } else {
      router.push("/stores");
    }
  };

  return (
    <section className="w-full bg-[#0f294a] text-white py-10 md:py-8 border-y border-white/10 select-none">
      <div className="container px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
        {/* Left text */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-2.5 rounded-full bg-white/10 text-primary shrink-0 hidden md:block">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-slate-300 block uppercase">LOCATE</span>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white leading-none mt-1">
              FOX FALCON STORE
            </h3>
          </div>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full md:w-auto flex-grow max-w-xl">
          <div className="flex flex-col gap-1 w-full relative">
            <label className="text-[9px] font-black tracking-widest text-slate-300 uppercase">
              FIND A STORE
            </label>
            <input
              type="text"
              placeholder="Enter Your Pin Code/City/Area"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full bg-transparent border border-white/30 text-white placeholder:text-slate-400 text-xs px-4 py-2.5 rounded-sm focus:outline-none focus:border-primary transition-colors h-10"
            />
          </div>
          <button
            type="submit"
            className="text-xs font-black uppercase tracking-wider text-white border-b-2 border-primary hover:text-primary transition-colors pb-1 shrink-0 h-8 self-end sm:self-auto mb-1"
          >
            SHOW ME
          </button>
        </form>
      </div>
    </section>
  );
}

export function MembersBanner() {
  const router = useRouter();

  return (
    <section className="w-full bg-[#006f43] text-white py-10 md:py-8 border-y border-white/5 select-none">
      <div className="container px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
        {/* Text */}
        <div className="text-center md:text-left max-w-2xl">
          <span className="text-[9px] font-black tracking-widest text-emerald-200 block uppercase">
            EARN POINTS EVERY TIME YOU PURCHASE!
          </span>
          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white leading-none mt-1">
            FOX FALCON MEMBERS
          </h3>
          <p className="text-[11px] text-emerald-100/80 mt-1.5 font-medium">
            Register with us to get latest updates and spend your points to buy.
          </p>
        </div>

        {/* Button */}
        <Button
          onClick={() => router.push("/login")}
          className="bg-white hover:bg-neutral-100 text-[#006f43] hover:text-[#005d37] font-black px-8 py-5 text-xs rounded-sm uppercase tracking-wider transition-all duration-300 shrink-0 shadow-md hover:scale-105 active:scale-98"
        >
          SIGN UP NOW
        </Button>
      </div>
    </section>
  );
}

export function ReferralBanner() {
  const router = useRouter();

  return (
    <section className="w-full bg-[#006f43] text-white py-10 md:py-8 border-y border-white/5 select-none">
      <div className="container px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
        {/* Left text with icon */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-2.5 rounded-full bg-white/10 text-emerald-200 shrink-0 hidden md:block">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white leading-none">
              REFER & EARN WITH THE REFERRAL PROGRAM
            </h3>
            <p className="text-[11px] text-emerald-100/80 mt-1.5 font-medium">
              Invite your friends and earn up to ₹ 7500 in discounts.
            </p>
          </div>
        </div>

        {/* Button */}
        <Button
          onClick={() => router.push("/login")}
          className="bg-white hover:bg-neutral-100 text-[#006f43] hover:text-[#005d37] font-black px-8 py-5 text-xs rounded-sm uppercase tracking-wider transition-all duration-300 shrink-0 shadow-md hover:scale-105 active:scale-98"
        >
          SIGN UP NOW
        </Button>
      </div>
    </section>
  );
}
