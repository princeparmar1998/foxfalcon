import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Shield, RefreshCw, Compass, Sparkles, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { LoyaltyCard } from "@/components/LoyaltyCard";
import { getCachedProducts } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCarousel } from "@/components/ProductCarousel";
import { StoreLocatorBanner, MembersBanner, ReferralBanner } from "@/components/HomeBanners";

export default async function Home() {
  // Fetch active products from the database (cached)
  const dbProducts = await getCachedProducts();

  // Safe mapping of decimal price
  const products = dbProducts.map(p => ({
    ...p,
    price: parseFloat(p.price as any)
  }));

  // Setup fallbacks if database is empty
  const sampleProducts = [
    {
      id: "sample-1",
      name: "Oversized Falcon Graphic Tee",
      price: 1299,
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "White", "Orange"],
      category: { name: "T-Shirts" },
      isFeatured: true,
      description: ""
    },
    {
      id: "sample-2",
      name: "Falcon Stealth Utility Cargo",
      price: 2499,
      images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop"],
      sizes: ["M", "L", "XL"],
      colors: ["Black", "Khaki"],
      category: { name: "Pants" },
      isFeatured: false,
      description: ""
    },
    {
      id: "sample-3",
      name: "Classic Linen Street Shirt",
      price: 1899,
      images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["White", "Beige", "Blue"],
      category: { name: "Shirts" },
      isFeatured: true,
      description: ""
    },
    {
      id: "sample-4",
      name: "Premium Cotton Linen Jacket",
      price: 3299,
      images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop"],
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["Olive", "Black"],
      category: { name: "Jackets" },
      isFeatured: false,
      description: ""
    }
  ];

  const activeProducts = products.length > 0 ? products : sampleProducts;
  const latestDrops = activeProducts.slice(0, 6);
  const newArrivals = activeProducts.slice().reverse().slice(0, 6);
  const linenProducts = activeProducts.filter(p => 
    p.name.toLowerCase().includes("linen") || 
    p.description?.toLowerCase().includes("linen") ||
    p.category?.name.toLowerCase().includes("shirt")
  );
  const displayLinen = linenProducts.length > 0 ? linenProducts : activeProducts.slice(0, 6);

  const instagramFeed = [
    { id: 1, image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=400" },
    { id: 2, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400" },
    { id: 3, image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=400" },
    { id: 4, image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=400" },
    { id: 5, image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?q=80&w=400" },
    { id: 6, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400" },
  ];

  return (
    <div className="flex flex-col gap-28 pb-0">
      {/* Hero Section */}
      <Hero />


      {/* Categories Row Section (3 category cards in a single row) */}
      <section className="container px-6 mx-auto">
        <div className="flex flex-col mb-12">
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">Curated Drops</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">THE RANGE</h2>
          <p className="text-muted-foreground mt-2 max-w-md">Filter your aesthetic. Premium heavyweight garments designed for high-street comfort with a subtle riding edge.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/shop?category=t-shirts" className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-card border border-border/20 shadow-premium">
            <Image 
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop" 
              alt="Oversized Tees Category"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-300" />
            <div className="absolute inset-x-6 bottom-6 flex flex-col items-start text-white gap-2">
              <h3 className="text-2xl font-black uppercase tracking-tight">Oversized Tees</h3>
              <span className="text-[10px] font-black uppercase tracking-widest border-b-2 border-white pb-1 group-hover:text-primary group-hover:border-primary transition-colors">
                Explore Collection
              </span>
            </div>
          </Link>
          <Link href="/shop?category=hoodies" className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-card border border-border/20 shadow-premium">
            <Image 
              src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop" 
              alt="Urban Hoodies Category"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-300" />
            <div className="absolute inset-x-6 bottom-6 flex flex-col items-start text-white gap-2">
              <h3 className="text-2xl font-black uppercase tracking-tight">Urban Hoodies</h3>
              <span className="text-[10px] font-black uppercase tracking-widest border-b-2 border-white pb-1 group-hover:text-primary group-hover:border-primary transition-colors">
                Explore Collection
              </span>
            </div>
          </Link>
          <Link href="/shop?category=jackets" className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-card border border-border/20 shadow-premium">
            <Image 
              src="https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop" 
              alt="Rider Outerwear Category"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-300" />
            <div className="absolute inset-x-6 bottom-6 flex flex-col items-start text-white gap-2">
              <h3 className="text-2xl font-black uppercase tracking-tight">Rider Jackets</h3>
              <span className="text-[10px] font-black uppercase tracking-widest border-b-2 border-white pb-1 group-hover:text-primary group-hover:border-primary transition-colors">
                Explore Collection
              </span>
            </div>
          </Link>
        </div>
      </section>

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

      {/* "Latest Drop" Carousel Section */}
      <section className="container px-6 mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">Exclusive Release</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">LATEST DROP</h2>
          </div>
          <Button asChild variant="link" className="text-primary font-black uppercase text-xs tracking-wider gap-1.5 p-0 hover:no-underline">
            <Link href="/shop">View All <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>

        <ProductCarousel products={latestDrops} type="standard" />
      </section>

      {/* Members Signup Banner */}
      <MembersBanner />

      {/* "New Arrival" Carousel Section (Displays exactly 2 cards per view on mobile viewport) */}
      <section className="container px-6 mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">Fresh In Store</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">NEW ARRIVALS</h2>
          </div>
          <Button asChild variant="link" className="text-primary font-black uppercase text-xs tracking-wider gap-1.5 p-0 hover:no-underline">
            <Link href="/shop">View All <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>

        <ProductCarousel products={newArrivals} type="new-arrivals" />
      </section>

      {/* Referral Reward Program Banner */}
      <ReferralBanner />

      {/* "Trending in Cotton Linen" Carousel Section */}
      <section className="container px-6 mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">Summer Lightweight comfort</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">TRENDING IN COTTON LINEN</h2>
          </div>
          <Button asChild variant="link" className="text-primary font-black uppercase text-xs tracking-wider gap-1.5 p-0 hover:no-underline">
            <Link href="/shop">View All <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>

        <ProductCarousel products={displayLinen} type="standard" />
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
                  <p className="text-primary text-3xl font-black">70%</p>
                  <span className="text-[10px] uppercase text-background/60 font-bold tracking-widest">Streetwear Fashion</span>
                </div>
                <div className="h-8 w-px bg-background/20" />
                <div>
                  <p className="text-primary text-3xl font-black">30%</p>
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
                sizes="(max-width: 1024px) 100vw, 50vw"
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
                sizes="(max-width: 768px) 50vw, 16vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Loyalty Reward Card */}
      <LoyaltyCard />

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

      {/* Store Locator Banner */}
      <StoreLocatorBanner />
    </div>
  );
}
