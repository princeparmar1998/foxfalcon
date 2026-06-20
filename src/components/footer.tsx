"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { DeveloperModal } from "./modal-developer";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer className="bg-background border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <Link 
            href="/" 
            className="inline-flex flex-row items-center gap-4 px-5 py-4 rounded-2xl bg-gradient-to-br from-[#0c1424] via-[#050b14] to-black border border-primary/20 hover:border-primary/50 shadow-[0_4px_20px_rgba(0,0,0,0.35),0_0_15px_rgba(255,106,0,0.08)] hover:shadow-[0_8px_30px_rgba(255,106,0,0.22)] transition-all duration-300 group max-w-fit relative overflow-hidden"
          >
            {/* Glossy sheen overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-white/[0.03] pointer-events-none" />
            
            <div className="w-12 h-8 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image 
                src="/logo-icon.png?v=6" 
                width={48}
                height={32}
                alt="Fox Falcon Logo" 
                className="object-contain brightness-100 transition-all duration-300" 
              />
            </div>
            <div className="flex flex-col gap-0.5 z-10">
              <span className="font-sans font-black tracking-[0.15em] text-2xl uppercase select-none leading-none text-white">
                FOX <span className="text-primary">FALCON</span>
              </span>
              <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-neutral-400 mt-0.5 leading-none">
                Instinct Meets Power
              </span>
            </div>
          </Link>
          <p className="text-sm text-muted-foreground">
            Instinct meets power. Premium apparel for the modern individual. Designed for comfort, styled for impact.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-sans font-black uppercase tracking-widest text-foreground mb-6">Shop</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/shop/men" className="hover:text-primary transition-colors duration-300">Men's Wear</Link></li>
            <li><Link href="/shop/women" className="hover:text-primary transition-colors duration-300">Women's Wear</Link></li>
            <li><Link href="/shop/accessories" className="hover:text-primary transition-colors duration-300">Accessories</Link></li>
            <li><Link href="/custom-design" className="hover:text-primary transition-colors duration-300">Custom T-shirts</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-sans font-black uppercase tracking-widest text-foreground mb-6">Customer Service</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/contact" className="hover:text-primary transition-colors duration-300">Contact Us</Link></li>
            <li><Link href="/shipping" className="hover:text-primary transition-colors duration-300">Shipping Info</Link></li>
            <li><Link href="/returns" className="hover:text-primary transition-colors duration-300">Returns & Exchanges</Link></li>
            <li><Link href="/track-order" className="hover:text-primary transition-colors duration-300">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-sans font-black uppercase tracking-widest text-foreground mb-6">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">Subscribe to get special offers and once-in-a-lifetime deals.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email" 
              aria-label="Your email"
              className="bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/60 px-4 py-2.5 text-sm rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-300"
            />
            <button className="bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold rounded-lg hover:bg-primary/90 transition-all duration-300 active:scale-95 shadow-lg shadow-primary/20">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Fox Falcon. All rights reserved.
          </p>
          <div className="hidden md:block w-px h-3 bg-border" />
          <div className="flex gap-4">
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-xs font-medium hover:text-primary transition-colors cursor-pointer group"
        >
          Website developed by <span className="underline decoration-secondary decoration-2 underline-offset-4 group-hover:text-secondary">Prince Parmar</span>
        </button>
      </div>

      <DeveloperModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </footer>
  );
};

export default Footer;
