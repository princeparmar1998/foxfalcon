"use client";

import Link from "next/link";
import { useState } from "react";
import { DeveloperModal } from "./modal-developer";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer className="bg-background border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-3 group">
            <div className="w-12 h-12 bg-black rounded-full overflow-hidden border border-border flex items-center justify-center">
              <img src="/logo-icon.png" alt="Fox Falcon Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-sans uppercase font-black">
              FOX <span className="text-primary">FALCON</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Instinct meets power. Premium apparel for the modern individual. Designed for comfort, styled for impact.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-foreground mb-6">Shop</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/shop/men" className="hover:text-primary transition-colors duration-300">Men's Wear</Link></li>
            <li><Link href="/shop/women" className="hover:text-primary transition-colors duration-300">Women's Wear</Link></li>
            <li><Link href="/shop/accessories" className="hover:text-primary transition-colors duration-300">Accessories</Link></li>
            <li><Link href="/custom-design" className="hover:text-primary transition-colors duration-300">Custom T-shirts</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-foreground mb-6">Customer Service</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/contact" className="hover:text-primary transition-colors duration-300">Contact Us</Link></li>
            <li><Link href="/shipping" className="hover:text-primary transition-colors duration-300">Shipping Info</Link></li>
            <li><Link href="/returns" className="hover:text-primary transition-colors duration-300">Returns & Exchanges</Link></li>
            <li><Link href="/track-order" className="hover:text-primary transition-colors duration-300">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-foreground mb-6">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">Subscribe to get special offers and once-in-a-lifetime deals.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/60 px-4 py-2.5 text-sm rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-300"
            />
            <button className="bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold rounded-lg hover:bg-primary/90 transition-all duration-300 active:scale-95 shadow-lg shadow-primary/20">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Fox Falcon. All rights reserved.
        </p>
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
