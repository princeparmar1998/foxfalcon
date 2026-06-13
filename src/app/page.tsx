import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { LoyaltyCard } from "@/components/LoyaltyCard";

const categories = [
  { name: "Summer Tees", count: "12 Items", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop" },
  { name: "Urban Hoodies", count: "8 Items", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop" },
  { name: "Classic Denims", count: "15 Items", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop" },
  { name: "Street Caps", count: "6 Items", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop" },
];

const features = [
  { icon: ShoppingBag, title: "Premium Quality", description: "Only the finest fabrics and materials." },
  { icon: Truck, title: "Fast Delivery", description: "Express shipping to your doorstep." },
  { icon: ShieldCheck, title: "Secure Checkout", description: "Fully encrypted payment gateway." },
  { icon: Zap, title: "Custom Designs", description: "Create your own unique apparel." },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      <Hero />

      {/* Loyalty Reward Card */}
      <LoyaltyCard />

      {/* Categories Grid */}
      <section className="container px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-black tracking-tighter">POPULAR CATEGORIES</h2>
            <p className="text-muted-foreground mt-2">Explore our curated collections of premium streetwear.</p>
          </div>
          <Button variant="ghost" className="text-primary font-bold group">
            View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link key={cat.name} href="/shop" className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
              <Image 
                src={cat.image} 
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <span className="text-secondary text-xs font-bold uppercase tracking-widest mb-1">{cat.count}</span>
                <h3 className="text-white text-2xl font-black tracking-tight">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-20">
        <div className="container px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center text-center space-y-4 group">
                <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action for Custom Design */}
      <section className="container px-6 mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 dark:bg-zinc-900 border border-zinc-800/80 py-20 px-10 text-center shadow-2xl shadow-black/20">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
              WEAR YOUR <span className="text-primary italic underline decoration-primary">IMAGINATION</span>
            </h2>
            <p className="text-zinc-400 text-lg">
              Upload your designs or create from scratch. We bring your vision to life on premium quality fabrics.
            </p>
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 font-bold h-14 px-10 rounded-xl shadow-lg active-scale">
              <Link href="/custom-design">Start Designing Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
