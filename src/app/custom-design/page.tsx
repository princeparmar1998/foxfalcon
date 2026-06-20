"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Trash2, ShoppingCart, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { showToast } from "@/lib/toast";
import { adminApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CustomDesignPage() {
  const cart = useCart();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [tshirtColor, setTshirtColor] = useState("white");
  const [selectedSize, setSelectedSize] = useState("M");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const customItemId = `custom-${tshirtColor}-${selectedSize}`;
  const isInCart = cart.items.some(item => item.id === customItemId);

  const colors = [
    { name: "white", hex: "#FFFFFF" },
    { name: "black", hex: "#0E0E11" },
    { name: "royal-blue", hex: "#1D4ED8" },
    { name: "neon-green", hex: "#22C55E" },
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast.error("Image size should be less than 5MB");
        return;
      }

      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const data = await adminApi.uploadProductImage(formData);
        setSelectedImage(data.url);
        showToast.success("Design uploaded successfully!");
      } catch (err) {
        showToast.error("An error occurred during upload.");
        console.error(err);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleAddToCart = () => {
    if (!selectedImage) {
      showToast.error("Please upload a design first!");
      return;
    }
    if (!selectedSize) {
      showToast.error("Please select a size first!");
      return;
    }

    cart.addItem({
      id: `custom-${tshirtColor}-${selectedSize}`,
      name: `Custom Streetwear Tee (${tshirtColor.toUpperCase()})`,
      price: 999.00,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
      color: tshirtColor,
    });
    showToast.success("Custom T-shirt added to cart!");
  };

  return (
    <div className="container px-6 mx-auto pt-32 pb-20 text-foreground bg-background">
      <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
        
        {/* Mockup Workbench Section */}
        <div className="flex-1 space-y-6">
          <div className="relative aspect-square rounded-3xl bg-zinc-950 overflow-hidden flex items-center justify-center border border-border group shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            
            {/* Workbench Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

            {/* T-Shirt Mockup */}
            <div className="relative w-full h-full flex items-center justify-center p-16 z-10">
              <div 
                className="absolute inset-0 transition-colors duration-700 opacity-80"
                style={{ backgroundColor: tshirtColor === 'white' ? '#FFFFFF' : tshirtColor === 'black' ? '#18181B' : tshirtColor === 'royal-blue' ? '#1D4ED8' : '#22C55E' }}
              />
              
              <div className="relative w-full h-full">
                <Image 
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop" 
                  alt="T-shirt Mockup"
                  fill
                  className="object-contain mix-blend-multiply opacity-40 pointer-events-none"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                
                {/* Uploaded Design Overlay */}
                {selectedImage && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-[30%] aspect-square relative shadow-2xl rounded-lg overflow-hidden border border-white/20 bg-zinc-900/60 backdrop-blur-md">
                      {/* Checkered print backing simulation */}
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,#2e2e3e_25%,transparent_25%),linear-gradient(-45deg,#2e2e3e_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#2e2e3e_75%),linear-gradient(-45deg,transparent_75%,#2e2e3e_75%)] bg-[size:10px_10px] bg-[position:0_0,0_5px,5px_-5px,-5px_0] opacity-10 pointer-events-none" />
                      <Image 
                        src={selectedImage} 
                        alt="Your Custom graphic"
                        fill
                        className="object-contain z-10 p-2"
                        unoptimized
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            
            {!selectedImage && !uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center pointer-events-none z-20">
                <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center mb-4 border border-border group-hover:scale-105 transition-transform duration-300">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-wider text-white">PREVIEW YOUR STREETWEAR DESIGN</h3>
                <p className="text-xs text-muted-foreground mt-2 max-w-sm leading-relaxed uppercase tracking-wider font-bold">
                  Upload custom transparency PNG graphics to render preview layout on canvas
                </p>
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center bg-black/60 backdrop-blur-md z-30">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <h3 className="text-lg font-black uppercase tracking-wider text-white">Uploading artwork asset...</h3>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-relaxed">
              * Creator Studio uses mockups for visual reference. Prints will correspond strictly to transparent layer files.
            </p>
            {selectedImage && (
              <Button variant="outline" size="sm" onClick={() => setSelectedImage(null)} className="text-destructive hover:bg-destructive/10 border-destructive/20 h-9 font-bold rounded-xl active-scale">
                <Trash2 className="w-4 h-4 mr-1.5" /> Remove Artwork
              </Button>
            )}
          </div>
        </div>

        {/* Studio Controls Side Panel */}
        <div className="lg:w-[380px] space-y-8 shrink-0">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> CREATOR LAB WORKBENCH
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">CUSTOM STREETWEAR</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">Compose custom luxury heavyweight graphic garments using our server-side print renderer.</p>
          </div>

          <Card className="p-6 space-y-6 bg-card border-border rounded-2xl">
            {/* Color selector */}
            <div className="space-y-3">
              <label className="text-xs font-sans font-black uppercase tracking-widest text-muted-foreground">1. Select Garment Color</label>
              <div className="flex gap-3">
                {colors.map((color) => {
                  const isActive = tshirtColor === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setTshirtColor(color.name)}
                      className={cn(
                        "w-9 h-9 rounded-full border-2 transition-all active-scale relative flex items-center justify-center",
                        isActive ? "border-primary scale-110 shadow-lg" : "border-border/40"
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {isActive && (
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          color.name === "white" ? "bg-black" : "bg-white"
                        )} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <label className="text-xs font-sans font-black uppercase tracking-widest text-muted-foreground">2. Select Garment Fit</label>
              <div className="flex gap-2">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "w-11 h-11 rounded-xl border-2 flex items-center justify-center font-black text-xs transition-all active-scale",
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground scale-105 shadow-md shadow-primary/20"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Design Uploader */}
            <div className="space-y-3">
              <label htmlFor="artwork-upload" className="text-xs font-sans font-black uppercase tracking-widest text-muted-foreground">3. Upload Transparency Artwork</label>
              <input 
                id="artwork-upload"
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline" 
                disabled={uploading}
                className="w-full h-12 border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all font-bold rounded-xl active-scale"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 mr-2 animate-spin text-primary" /> Uploading artwork...
                  </>
                ) : (
                  <>
                    <Upload className="w-4.5 h-4.5 mr-2 text-primary" /> {selectedImage ? "Change Artwork Asset" : "Select Transparency PNG"}
                  </>
                )}
              </Button>
            </div>

            {/* Checkout Pricing breakdown */}
            <div className="space-y-3 pt-6 border-t border-border/80">
              <div className="flex justify-between items-center text-sm font-black uppercase tracking-wider">
                <span>Calculated Unit Price</span>
                <span className="text-primary font-mono text-lg">₹999.00</span>
              </div>
              {isInCart ? (
                <Button asChild className="w-full h-14 text-sm font-black uppercase tracking-widest bg-green-600 hover:bg-green-700 text-white rounded-xl active-scale">
                  <Link href="/cart" className="flex items-center justify-center">
                    <ShoppingCart className="w-4.5 h-4.5 mr-2" /> View in Cart
                  </Link>
                </Button>
              ) : (
                <Button onClick={handleAddToCart} className="w-full h-14 text-sm font-black uppercase tracking-widest bg-primary hover:bg-primary/95 rounded-xl active-scale">
                  <ShoppingCart className="w-4.5 h-4.5 mr-2" /> Add Custom Garment
                </Button>
              )}
            </div>
          </Card>

          {/* Specifications */}
          <div className="space-y-4">
            <h4 className="text-xs font-sans font-black uppercase tracking-widest text-foreground">Creator Studio Specifications</h4>
            <ul className="space-y-2 text-xs text-muted-foreground font-medium uppercase tracking-wide">
              <li className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Direct-to-Garment (DTG) print process</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Max graphic dimensions: 12" x 16"</span>
              </li>
              <li className="flex items-center gap-2">
                <Upload className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Luxury 240 GSM Bio-wash organic cotton</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
