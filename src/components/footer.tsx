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
          <h4 className="font-bold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/shop/men" className="hover:text-primary">Men's Wear</Link></li>
            <li><Link href="/shop/women" className="hover:text-primary">Women's Wear</Link></li>
            <li><Link href="/shop/accessories" className="hover:text-primary">Accessories</Link></li>
            <li><Link href="/custom-design" className="hover:text-primary">Custom T-shirts</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Customer Service</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
            <li><Link href="/shipping" className="hover:text-primary">Shipping Info</Link></li>
            <li><Link href="/returns" className="hover:text-primary">Returns & Exchanges</Link></li>
            <li><Link href="/track-order" className="hover:text-primary">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-4">Subscribe to get special offers and once-in-a-lifetime deals.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-muted border border-border px-3 py-2 text-sm rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
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
