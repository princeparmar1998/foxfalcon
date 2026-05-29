"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Trash2, ShoppingCart, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { showToast } from "@/lib/toast";

export default function CustomDesignPage() {
  const cart = useCart();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [tshirtColor, setTshirtColor] = useState("white");
  const [selectedSize, setSelectedSize] = useState("M");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colors = [
    { name: "white", hex: "#FFFFFF" },
    { name: "black", hex: "#000000" },
    { name: "royal-blue", hex: "#4169E1" },
    { name: "neon-green", hex: "#39FF14" },
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
        // Upload to server using the products upload api endpoint
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/products/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setSelectedImage(data.url);
          showToast.success("Design uploaded successfully!");
        } else {
          showToast.error("Failed to upload image. Please try again.");
        }
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
      price: 24.99,
      image: selectedImage,
      quantity: 1,
      size: selectedSize,
      color: tshirtColor,
    });
  };

  return (
    <div className="container px-6 mx-auto pt-32 pb-20 text-foreground bg-background">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Mockup Section */}
        <div className="flex-1 space-y-8">
          <div className="relative aspect-square rounded-3xl bg-muted overflow-hidden flex items-center justify-center border-2 border-dashed border-border group">
            {/* T-Shirt Mockup */}
            <div className="relative w-full h-full flex items-center justify-center p-12">
              <div 
                className="absolute inset-0 transition-colors duration-500"
                style={{ backgroundColor: tshirtColor === 'white' ? '#f5f5f5' : tshirtColor === 'black' ? '#1a1a1a' : tshirtColor === 'royal-blue' ? '#4169E1' : '#39FF14' }}
              />
              <div className="relative w-full h-full">
                <Image 
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop" 
                  alt="T-shirt Mockup"
                  fill
                  className="object-contain mix-blend-multiply opacity-50 pointer-events-none"
                />
                
                {/* Uploaded Design Overlay */}
                {selectedImage && (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-1/3 aspect-square relative shadow-2xl rounded-lg overflow-hidden border border-white/20">
                      <Image 
                        src={selectedImage} 
                        alt="Your Design"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            
            {!selectedImage && !uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center mb-4 border border-border group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold">Preview Your Design</h3>
                <p className="text-sm text-muted-foreground mt-2">Upload a high-quality PNG or JPG to see it on the shirt.</p>
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center bg-black/40 backdrop-blur-sm">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <h3 className="text-xl font-bold">Uploading Design...</h3>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground italic">
              * Mockup for visualization only. Actual print quality may vary based on image resolution.
            </p>
            {selectedImage && (
              <Button variant="outline" size="sm" onClick={() => setSelectedImage(null)} className="text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4 mr-2" /> Remove Design
              </Button>
            )}
          </div>
        </div>

        {/* Controls Section */}
        <div className="lg:w-[400px] space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              Creator Studio
            </div>
            <h1 className="text-4xl font-black tracking-tighter">CUSTOM T-SHIRT</h1>
            <p className="text-muted-foreground">Define your style. Premium cotton, personalized for you.</p>
          </div>

          <Card className="p-6 space-y-6 bg-muted/30 border-border">
            {/* Color selector */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">1. Select Color</label>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setTshirtColor(color.name)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      tshirtColor === color.name ? "border-primary scale-110 shadow-lg" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">2. Select Size</label>
              <div className="flex gap-2">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-black text-sm transition-all ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground scale-105 shadow-md shadow-primary/20"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Design Uploader */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">3. Upload Design</label>
              <input 
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
                className="w-full h-12 border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all font-bold"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" /> {selectedImage ? "Change Design" : "Choose File"}
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Price</span>
                <span className="text-primary font-black">$24.99</span>
              </div>
              <Button onClick={handleAddToCart} className="w-full h-14 text-lg font-black bg-primary hover:bg-primary/90">
                <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
              </Button>
            </div>
          </Card>

          <div className="space-y-4">
            <h4 className="font-bold">Printing Specs</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Direct-to-Garment (DTG) printing
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Max design area: 12" x 16"
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Premium 180 GSM Bio-wash cotton
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
