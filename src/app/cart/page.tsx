"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container px-6 mx-auto pt-40 pb-20 text-center space-y-6">
        <div className="w-20 h-20 bg-muted/30 border border-border rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase">YOUR CART IS EMPTY</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto uppercase tracking-wide leading-relaxed font-bold">
          Looks like you haven't added anything to your cart yet. Explore our latest collections and find something you love.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 font-bold px-10 h-14 mt-4 rounded-xl active-scale">
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-6 mx-auto pt-32 pb-20 bg-background text-foreground">
      <h1 className="text-5xl font-black tracking-tighter mb-12 uppercase">SHOPPING CART</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                layout
                key={`${item.id}-${item.size}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6 border border-border bg-card flex flex-col sm:flex-row gap-6 relative overflow-hidden group hover:border-primary/40 transition-all duration-300 shadow-md hover:shadow-lg dark:shadow-black/40">
                  <div className="absolute top-0 left-0 w-[3px] h-full bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                  
                  <div className="relative w-full sm:w-28 aspect-square rounded-xl overflow-hidden bg-muted border border-border">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-lg font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">{item.name}</h3>
                        <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
                          {item.size && <span>Size: <span className="text-primary font-mono">{item.size}</span></span>}
                          {item.color && <span>Color: <span className="text-primary font-mono">{item.color}</span></span>}
                        </div>
                      </div>
                      <p className="text-lg font-black text-primary font-mono">₹{item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center border border-border rounded-xl bg-muted/20">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-2 hover:text-primary transition-colors active-scale"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-black font-mono">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-2 hover:text-primary transition-colors active-scale"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:bg-destructive/10 h-9 font-bold px-3 rounded-lg active-scale"
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" /> Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="p-8 border-border bg-card">
            <h2 className="text-2xl font-black tracking-tighter mb-6 uppercase">ORDER SUMMARY</h2>
            
            <div className="space-y-4 text-xs font-bold uppercase tracking-wider">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono text-foreground">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-mono text-foreground">{shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[9px] text-primary font-black uppercase tracking-widest leading-relaxed">
                  * Add ₹{ (100 - subtotal).toFixed(2) } more for FREE shipping
                </p>
              )}
              <Separator className="bg-border" />
              <div className="flex justify-between text-lg font-black text-foreground">
                <span>Total</span>
                <span className="text-primary font-mono">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Button asChild className="w-full h-14 mt-8 bg-primary hover:bg-primary/95 text-sm font-black uppercase tracking-widest group rounded-xl active-scale">
              <Link href="/checkout" className="flex items-center justify-center gap-2">
                Checkout Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <div className="mt-6 flex items-center justify-center gap-4 grayscale opacity-30">
              <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={40} height={12} />
              <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width={30} height={12} />
              <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" width={60} height={12} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
