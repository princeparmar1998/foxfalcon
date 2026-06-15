import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Eye, Heart, Shield, RefreshCw, Compass, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { LoyaltyCard } from "@/components/LoyaltyCard";

const categories = [
  { name: "New Arrivals", count: "32 Items", image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop", href: "/shop?category=new" },
  { name: "Oversized Tees", count: "24 Items", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop", href: "/shop?category=t-shirts" },
  { name: "Urban Hoodies", count: "18 Items", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop", href: "/shop?category=hoodies" },
  { name: "Rider Lifestyle", count: "12 Items", image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop", href: "/shop?category=rider" },
  { name: "Accessories", count: "9 Items", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop", href: "/shop?category=accessories" },
];

const bestSellers = [
  { id: "1", name: "Classic Falcon Bomber", price: 149, tag: "ESSENTIAL OUTWEAR", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop" },
  { id: "2", name: "Heavyweight Loopback Hoodie", price: 89, tag: "450GSM COTTON", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop" },
  { id: "3", name: "Signature Cargo V2", price: 119, tag: "RELAXED FIT", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop" },
  { id: "4", name: "Falcon Embroidered Cap", price: 39, tag: "LIMITED DROP", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop" },
];

const instagramFeed = [
  { id: 1, image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=400" },
  { id: 2, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400" },
  { id: 3, image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=400" },
  { id: 4, image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=400" },
  { id: 5, image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?q=80&w=400" },
  { id: 6, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400" },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-28 pb-24">
      {/* Hero Section */}
      <Hero />

      {/* Loyalty Reward Card */}
      <LoyaltyCard />

      {/* Brand Ethos / Banner */}
      <section className="container px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-8 border-y border-border/50">
          <div className="flex items-start gap-4">
            <Compass className="w-8 h-8 text-primary shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold tracking-tight">PREMIUM STREETWEAR</h4>
              <p className="text-sm text-muted-foreground mt-1">Contemporary oversized designs crafted with heavyweight materials, built to elevate daily streetwear expression.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-primary shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold tracking-tight">CRAFTED FOR DURABILITY</h4>
              <p className="text-sm text-muted-foreground mt-1">High-GSM combed cotton fabrics, reinforced stitching, and refined washes ensuring garments that maintain structure over time.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <RefreshCw className="w-8 h-8 text-primary shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold tracking-tight">RIDER SUB-CULTURE</h4>
              <p className="text-sm text-muted-foreground mt-1">Integrating a 30% subtle riding aesthetic—inspired by speed, freedom, and the classic cafe racer heritage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="container px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-widest uppercase mb-3">
              <Sparkles className="w-3 h-3" /> Curated Drops
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
              THE RANGE
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md">Filter your aesthetic. Premium heavyweight garments designed for high-street comfort with a subtle riding edge.</p>
          </div>
          <Button asChild variant="link" className="text-primary font-black uppercase text-xs tracking-wider gap-1.5 p-0 hover:no-underline">
            <Link href="/shop">Explore Entire Catalog <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href} className="group relative aspect-[3/4] overflow-hidden rounded-card bg-card border border-border/20 shadow-premium transition-all duration-500 hover:shadow-glow">
              <Image 
                src={cat.image} 
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-x-3 bottom-3 z-20">
                <div className="bg-background/70 dark:bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-3.5 transition-all duration-500 group-hover:bg-primary group-hover:border-primary">
                  <span className="text-[8px] font-black tracking-widest uppercase text-muted-foreground group-hover:text-primary-foreground/80 transition-colors">{cat.count}</span>
                  <h3 className="text-foreground font-black text-sm uppercase tracking-tight mt-0.5 group-hover:text-primary-foreground transition-colors">{cat.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers (Asymmetric Editorial Presentation) */}
      <section className="container px-6 mx-auto">
        <div className="flex flex-col mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">BEST SELLERS</h2>
          <div className="h-1 w-16 bg-primary mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map((item) => (
            <div key={item.id} className="group relative flex flex-col bg-card rounded-card border border-border/30 p-3 shadow-premium hover:shadow-glow transition-all duration-500 overflow-hidden">
              <Link href={`/shop/${item.id}`} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-background">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-background/90 dark:bg-card/90 backdrop-blur-sm border border-border/30 text-foreground font-black text-[7px] uppercase tracking-wider px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                  {item.tag}
                </span>
              </Link>
              <div className="mt-4 px-1 pb-1 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="font-bold text-base tracking-tight text-foreground line-clamp-1">{item.name}</h3>
                    <span className="font-extrabold text-sm text-primary font-mono">${item.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <Button asChild size="sm" className="flex-1 rounded-button h-9 text-[10px] font-black uppercase tracking-wider bg-foreground text-background hover:bg-primary hover:text-primary-foreground shadow-sm">
                    <Link href={`/shop/${item.id}`} className="flex items-center justify-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5" /> QUICK SHOP
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" className="w-9 h-9 p-0 rounded-button border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story Presentation */}
      <section className="container px-6 mx-auto">
        <div className="relative rounded-banner overflow-hidden bg-foreground text-background py-20 px-8 md:px-16 shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">FOX FALCON ARCHIVE</span>
              <h2 className="text-4xl md:text-6xl font-black text-background tracking-tighter leading-none">
                HIGH STREET SILHOUETTES. <br />
                MOTO LIFESTYLE INFLUENCE.
              </h2>
              <p className="text-background/80 text-base leading-relaxed font-medium">
                We craft premium contemporary garments designed for metropolitan life, taking artistic cues from vintage rider and cafe racer culture. 
                Our focus is premium heavy textiles, relaxed fits, and a distinct, minimalist design signature.
              </p>
              <div className="flex items-center gap-6 pt-4">
                <div>
                  <h5 className="text-primary text-3xl font-black">70%</h5>
                  <span className="text-[10px] uppercase text-background/60 font-bold tracking-widest">Streetwear Fashion</span>
                </div>
                <div className="h-8 w-px bg-background/20" />
                <div>
                  <h5 className="text-primary text-3xl font-black">30%</h5>
                  <span className="text-[10px] uppercase text-background/60 font-bold tracking-widest">Riding Subculture</span>
                </div>
              </div>
            </div>
            <div className="relative aspect-video rounded-card overflow-hidden border border-background/10 bg-background/5">
              <Image 
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop" 
                alt="Brand Campaign Streetwear"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="container px-6 mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">#FOXFALCONCREW</span>
          <h2 className="text-4xl font-black tracking-tighter uppercase">STREET SNAPSHOTS</h2>
          <p className="text-muted-foreground text-sm mt-2">Tag us in your custom streetwear layouts & weekend rides.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {instagramFeed.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl bg-card border border-border/20 shadow-premium">
              <Image
                src={img.image}
                alt="Instagram Streetwear Feed"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Design Call to Action */}
      <section className="container px-6 mx-auto">
        <div className="relative rounded-banner overflow-hidden bg-card border border-border/40 py-20 px-10 text-center shadow-premium">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">DESIGN LAB</span>
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter">
              MAKE YOUR OWN <span className="text-primary italic font-serif">STATEMENT</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Our interactive lab empowers you to customize graphic placements on premium luxury heavyweight blanks.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/95 font-bold h-14 px-10 rounded-button shadow-lg mt-4">
              <Link href="/custom-design">Start Customizing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
