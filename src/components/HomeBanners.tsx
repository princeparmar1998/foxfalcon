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
    <section className="w-full bg-gradient-to-r from-[#0c1424] via-[#060b13] to-[#0c1424] text-white py-12 md:py-10 border-y border-primary/10 select-none relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full filter blur-[80px] pointer-events-none" />
      
      <div className="container px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 relative z-10">
        {/* Left text */}
        <div className="flex items-center gap-5 text-center md:text-left">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-primary shrink-0 hidden md:block shadow-[0_0_15px_rgba(255,106,0,0.1)]">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-[0.25em] text-primary block uppercase">LOCATE</span>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-none mt-1 font-sans">
              FOX FALCON STORE
            </h3>
          </div>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full md:w-auto flex-grow max-w-xl">
          <div className="flex flex-col gap-1.5 w-full relative">
            <label htmlFor="store-zip-code" className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">
              FIND A STORE
            </label>
            <input
              id="store-zip-code"
              type="text"
              placeholder="Enter Your Pin Code / City / Area"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 focus:border-primary/50 text-white placeholder:text-slate-500 text-xs px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all h-11"
            />
          </div>
          <button
            type="submit"
            className="text-xs font-black uppercase tracking-widest text-white border-b-2 border-primary hover:text-primary transition-all duration-300 pb-1.5 shrink-0 h-9 self-end sm:self-auto mb-1 hover:scale-105 active:scale-95"
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
    <section className="w-full bg-gradient-to-r from-[#032014] via-[#01140c] to-[#032014] text-white py-12 md:py-10 border-y border-emerald-950 select-none relative overflow-hidden">
      {/* Ambient Green Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="container px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 relative z-10">
        {/* Text */}
        <div className="text-center md:text-left max-w-2xl">
          <span className="text-[10px] font-black tracking-[0.25em] text-emerald-400 block uppercase">
            EARN POINTS EVERY TIME YOU PURCHASE!
          </span>
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-none mt-1 font-sans">
            FOX FALCON MEMBERS
          </h3>
          <p className="text-xs text-emerald-100/60 mt-2 font-medium max-w-lg leading-relaxed">
            Register with us to get latest updates, unlock VIP tier rewards, and spend your points on exclusive drops.
          </p>
        </div>

        {/* Button */}
        <Button
          onClick={() => router.push("/login")}
          className="bg-white hover:bg-[#f8f5ef] text-[#01140c] font-black px-8 py-6 text-xs rounded-xl uppercase tracking-widest transition-all duration-300 shrink-0 shadow-lg shadow-black/20 hover:scale-105 active:scale-95 border border-white/10"
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
    <section className="w-full bg-gradient-to-r from-[#032014] via-[#01140c] to-[#032014] text-white py-12 md:py-10 border-y border-emerald-950 select-none relative overflow-hidden">
      {/* Ambient Green Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="container px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 relative z-10">
        {/* Left text with icon */}
        <div className="flex items-center gap-5 text-center md:text-left">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-emerald-400 shrink-0 hidden md:block shadow-[0_0_15px_rgba(16,185,129,0.08)]">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-[0.25em] text-emerald-400 block uppercase mb-1">REFERRAL PROGRAM</span>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-none font-sans">
              REFER & EARN WITH FRIENDS
            </h3>
            <p className="text-xs text-emerald-100/60 mt-2 font-medium leading-relaxed">
              Invite your crew to the league and earn up to <span className="text-emerald-400 font-bold">₹7,500</span> in discount credits.
            </p>
          </div>
        </div>

        {/* Button */}
        <Button
          onClick={() => router.push("/login")}
          className="bg-white hover:bg-[#f8f5ef] text-[#01140c] font-black px-8 py-6 text-xs rounded-xl uppercase tracking-widest transition-all duration-300 shrink-0 shadow-lg shadow-black/20 hover:scale-105 active:scale-95 border border-white/10"
        >
          SIGN UP NOW
        </Button>
      </div>
    </section>
  );
}
