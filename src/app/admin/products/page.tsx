"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  ExternalLink,
  Package,
  Loader2,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { showToast } from "@/lib/toast";
import { adminApi } from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryName, setCategoryName] = useState("T-Shirts");
  const [inventory, setInventory] = useState("50");
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>(["S", "M", "L", "XL"]);
  const [colors, setColors] = useState<string[]>(["Black", "White", "Orange"]);
  const [isFeatured, setIsFeatured] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getProducts();
      setProducts(data);
    } catch (err) {
      showToast.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle create
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || !categoryName) {
      showToast.error("Validation Error", "Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      await adminApi.createProduct({
        name,
        description,
        price,
        categoryName,
        inventory,
        images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"],
        sizes,
        colors,
        isFeatured,
      });

      showToast.success("Product created successfully!");
      setIsOpen(false);
      
      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setCategoryName("T-Shirts");
      setInventory("50");
      setImages([]);
      setSizes(["S", "M", "L", "XL"]);
      setIsFeatured(false);

      fetchProducts();
    } catch (err) {
      showToast.error("Failed to create product", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await adminApi.deleteProduct(id);
      showToast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      showToast.error("Failed to delete product", err);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">PRODUCT MANAGEMENT</h1>
          <p className="text-muted-foreground">Manage your inventory, prices, and product details.</p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="bg-primary hover:bg-primary/90 font-bold group h-12 px-6">
          <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" /> Add Product
        </Button>
      </div>

      <Card className="p-6 border-border bg-card">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-10 bg-muted/30 border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <span className="font-bold">Loading products from Neon Postgres...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <Package className="w-16 h-16 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground font-medium">No products found. Start by uploading one!</p>
            <Button onClick={() => setIsOpen(true)} variant="outline" className="border-2 font-bold">
              Add First Product
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="font-bold w-[100px]">Image</TableHead>
                  <TableHead className="font-bold">Product Name</TableHead>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="font-bold">Price</TableHead>
                  <TableHead className="font-bold">Stock</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const imageSrc = product.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop";
                  const isOutOfStock = product.inventory <= 0;
                  const isLowStock = product.inventory > 0 && product.inventory < 15;
                  
                  return (
                    <TableRow key={product.id} className="border-border hover:bg-muted/50 transition-colors group">
                      <TableCell>
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border bg-black">
                          <img src={imageSrc} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">
                        <div className="flex items-center gap-2">
                          <span>{product.name}</span>
                          {product.isFeatured && (
                            <Badge className="bg-primary/10 text-primary border-none text-[8px] uppercase tracking-wider font-black px-1.5 py-0.5">Featured</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-muted text-muted-foreground border-none font-bold text-[10px] tracking-widest uppercase">
                          {product.category?.name || "T-Shirts"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-black text-primary">${parseFloat(product.price).toFixed(2)}</TableCell>
                      <TableCell className="font-bold">{product.inventory}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px] font-black uppercase tracking-widest",
                            isOutOfStock ? "border-red-500 text-red-500" : isLowStock ? "border-yellow-500 text-yellow-500" : "border-green-500 text-green-500"
                          )}
                        >
                          {isOutOfStock ? "OUT OF STOCK" : isLowStock ? "LOW STOCK" : "IN STOCK"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => window.open(`/shop/${product.id}`, "_blank")} 
                              className="font-bold cursor-pointer"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" /> View Live
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(product.id)} className="font-bold text-destructive cursor-pointer">
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[550px] bg-background border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">ADD NEW PRODUCT</DialogTitle>
            <DialogDescription>
              Upload a new streetwear garment to the Neon Postgres database.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Name *</label>
                <Input 
                  placeholder="e.g. Vintage Oversized Hoodie" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                  className="bg-muted/30 border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price ($) *</label>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="e.g. 59.99" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  required
                  className="bg-muted/30 border-border text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category *</label>
                <select 
                  className="w-full h-9 rounded-lg border border-input bg-muted/30 px-3 py-1 text-sm focus-visible:outline-none text-foreground bg-black border-border"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                >
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Hoodies">Hoodies</option>
                  <option value="Pants">Pants</option>
                  <option value="Caps">Caps</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Stock Count</label>
                <Input 
                  type="number" 
                  placeholder="e.g. 50" 
                  value={inventory} 
                  onChange={(e) => setInventory(e.target.value)} 
                  className="bg-muted/30 border-border text-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Images (Multiple Allowed)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;
                  
                  for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                      const data = await adminApi.uploadProductImage(formData);
                      setImages((prev) => [...prev, data.url]);
                    } catch (err) {
                      showToast.error(`Image upload error for ${file.name}`, err);
                    }
                  }
                }}
              />
              {/* Previews Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {images.map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-square rounded overflow-hidden border border-border group bg-black">
                      <img src={imgUrl} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute inset-0 bg-red-600/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold text-xs transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Available Sizes *</label>
              <div className="flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL", "XXL", "3XL"].map((size) => {
                  const isSelected = sizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSizes(sizes.filter((s) => s !== size));
                        } else {
                          setSizes([...sizes, size]);
                        }
                      }}
                      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold text-xs transition-all ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground scale-105"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description *</label>
              <textarea 
                className="w-full min-h-[100px] rounded-lg border border-input bg-muted/30 px-3 py-2 text-sm focus-visible:outline-none text-foreground border-border bg-black"
                placeholder="Write premium marketing copy for this streetwear garment..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-2 relative">
              <input 
                type="checkbox" 
                id="isFeatured" 
                checked={isFeatured} 
                onChange={(e) => setIsFeatured(e.target.checked)} 
                className="w-4 h-4 rounded border-border text-primary accent-primary"
              />
              <label htmlFor="isFeatured" className="text-xs font-bold uppercase tracking-widest text-muted-foreground cursor-pointer">Feature this product on the home page</label>
              
              <div className="relative group flex items-center">
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-popover border border-border text-popover-foreground text-[10px] font-bold p-2.5 rounded-lg shadow-2xl w-56 text-center uppercase tracking-widest leading-relaxed z-50">
                  Enabling this will showcase this garment in the main "Featured Collections" section on the front homepage for visitors.
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="border-2 font-bold">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90 font-bold px-6">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
