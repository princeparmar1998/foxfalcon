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
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter">YOUR CART IS EMPTY</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Explore our latest collections and find something you love.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 font-bold px-10 h-14 mt-4">
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-6 mx-auto pt-32 pb-20">
      <h1 className="text-5xl font-black tracking-tighter mb-12">SHOPPING CART</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                layout
                key={`${item.id}-${item.size}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="p-6 border-border bg-card/50 flex flex-col sm:flex-row gap-6 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary/100 transition-all duration-300" />
                  
                  <div className="relative w-full sm:w-32 aspect-square rounded-xl overflow-hidden bg-muted border border-border">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold tracking-tight">{item.name}</h3>
                        <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
                          {item.size && <span>Size: <span className="text-primary">{item.size}</span></span>}
                          {item.color && <span>Color: <span className="text-primary">{item.color}</span></span>}
                        </div>
                      </div>
                      <p className="text-xl font-black text-primary">${item.price}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center border border-border rounded-lg bg-muted/30">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 hover:text-primary transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 hover:text-primary transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:bg-destructive/10 h-8"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Remove
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
          <Card className="p-8 border-border bg-muted/10">
            <h2 className="text-2xl font-black tracking-tighter mb-6">ORDER SUMMARY</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Subtotal</span>
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Shipping</span>
                <span className="font-bold">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
                  Add ${ (100 - subtotal).toFixed(2) } more for FREE shipping
                </p>
              )}
              <Separator className="bg-border" />
              <div className="flex justify-between text-xl font-black">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button asChild className="w-full h-14 mt-8 bg-primary hover:bg-primary/90 text-lg font-black group">
              <Link href="/checkout" className="flex items-center justify-center gap-2">
                Checkout Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <div className="mt-6 flex items-center justify-center gap-4 grayscale opacity-50">
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
