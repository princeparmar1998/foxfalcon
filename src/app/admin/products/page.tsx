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
  HelpCircle,
  Edit,
  FileSpreadsheet,
  DownloadCloud
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

  // Edit states
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Bulk / Multi-add states
  const [dialogTab, setDialogTab] = useState<"single" | "bulk">("single");
  const [bulkInput, setBulkInput] = useState("");
  const [bulkFormat, setBulkFormat] = useState<"csv" | "json">("json");
  const [bulkProducts, setBulkProducts] = useState<any[]>([]);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [isBulkImporting, setIsBulkImporting] = useState(false);

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
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);

  const handleImageUploads = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploadingCount(prev => prev + files.length);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      try {
        const data = await adminApi.uploadProductImage(formData);
        setImages((prev) => [...prev, data.url]);
      } catch (err) {
        showToast.error(`Image upload error for ${file.name}`, err);
      } finally {
        setUploadingCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleImageUploads(Array.from(files));
    }
  };

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

  const handleResetForm = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategoryName("T-Shirts");
    setInventory("50");
    setImages([]);
    setSizes(["S", "M", "L", "XL"]);
    setIsFeatured(false);
    setBulkInput("");
    setBulkProducts([]);
    setBulkProgress(0);
  };

  const handleStartEdit = (product: any) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setCategoryName(product.category?.name || "T-Shirts");
    setInventory(product.inventory.toString());
    setImages(product.images || []);
    setSizes(product.sizes || ["S", "M", "L", "XL"]);
    setColors(product.colors || ["Black", "White", "Orange"]);
    setIsFeatured(product.isFeatured || false);
    setDialogTab("single");
    setIsOpen(true);
  };

  // Handle single create or update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || !categoryName) {
      showToast.error("Validation Error", "Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name,
        description,
        price,
        categoryName,
        inventory,
        images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"],
        sizes,
        colors,
        isFeatured,
      };

      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, payload);
        showToast.success("Product updated successfully!");
      } else {
        await adminApi.createProduct(payload);
        showToast.success("Product created successfully!");
      }

      setIsOpen(false);
      handleResetForm();
      fetchProducts();
    } catch (err) {
      showToast.error(editingProduct ? "Failed to update product" : "Failed to create product", err);
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

  // Parsing CSV or JSON dynamically for Bulk adding
  const handleParseBulk = () => {
    if (!bulkInput.trim()) {
      showToast.error("Please paste import details first.");
      return;
    }

    try {
      if (bulkFormat === "json") {
        const data = JSON.parse(bulkInput);
        const parsed = Array.isArray(data) ? data : [data];

        const sanitized = parsed.map((item: any, idx: number) => {
          if (!item.name || !item.price) {
            throw new Error(`Item #${idx + 1} is missing Name or Price.`);
          }
          return {
            name: item.name,
            categoryName: item.categoryName || "T-Shirts",
            price: item.price.toString(),
            inventory: (item.inventory || "50").toString(),
            description: item.description || `Premium custom ${item.categoryName || "T-Shirts"} garment by Fox Falcon.`,
            sizes: Array.isArray(item.sizes) ? item.sizes : ["S", "M", "L", "XL"],
            colors: Array.isArray(item.colors) ? item.colors : ["Black", "White", "Orange"],
            images: Array.isArray(item.images) ? item.images : ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"],
            isFeatured: !!item.isFeatured
          };
        });

        setBulkProducts(sanitized);
        showToast.success(`Successfully parsed ${sanitized.length} products!`);
      } else {
        // Parse CSV
        const lines = bulkInput.split("\n");
        const parsed = [];
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const parts = line.split(",").map(p => p.trim());
          if (parts.length < 3) continue; // Requires at least: Name, Category, Price

          const name = parts[0];
          const categoryName = parts[1] || "T-Shirts";
          const price = parts[2] || "0";
          const inventory = parts[3] || "50";
          const description = parts[4] || `Premium custom ${categoryName} custom-designed garment by Fox Falcon.`;
          const sizes = parts[5] ? parts[5].split(";").map(s => s.trim()) : ["S", "M", "L", "XL"];
          const colors = parts[6] ? parts[6].split(";").map(c => c.trim()) : ["Black", "White", "Orange"];
          const images = parts[7] ? parts[7].split(";").map(img => img.trim()) : ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"];

          parsed.push({
            name,
            categoryName,
            price,
            inventory,
            description,
            sizes,
            colors,
            images,
            isFeatured: false
          });
        }

        if (parsed.length === 0) {
          throw new Error("No valid rows parsed. Template: Name,Category,Price,Inventory,Description,Sizes(S;M),Colors(Black;White),Images(url;url)");
        }

        setBulkProducts(parsed);
        showToast.success(`Successfully parsed ${parsed.length} products from CSV!`);
      }
    } catch (err: any) {
      showToast.error("Failed to parse data", err.message || err);
      setBulkProducts([]);
    }
  };

  // Sequential batch upload from frontend client side
  const handleBulkImport = async () => {
    if (bulkProducts.length === 0) {
      showToast.error("Please parse product details first.");
      return;
    }

    try {
      setIsBulkImporting(true);
      setBulkProgress(0);
      let successCount = 0;

      for (let i = 0; i < bulkProducts.length; i++) {
        const prod = bulkProducts[i];
        try {
          await adminApi.createProduct(prod);
          successCount++;
        } catch (err) {
          console.error(`Bulk import failed for item #${i + 1} (${prod.name}):`, err);
        }
        setBulkProgress(Math.round(((i + 1) / bulkProducts.length) * 100));
      }

      showToast.success(`Bulk upload completed! Imported ${successCount} of ${bulkProducts.length} items successfully.`);
      setIsOpen(false);
      handleResetForm();
      fetchProducts();
    } catch (err) {
      showToast.error("Bulk upload import failed", err);
    } finally {
      setIsBulkImporting(false);
    }
  };

  const handleLoadSampleJSON = () => {
    const sample = [
      {
        "name": "Oversized Falcon Graphic Tee",
        "categoryName": "T-Shirts",
        "price": "45.00",
        "inventory": "100",
        "description": "Heavyweight vintage-washed custom graphic streetwear tee with drop-shoulder detail.",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["Black", "Vintage Gray"],
        "images": ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"],
        "isFeatured": true
      },
      {
        "name": "Falcon Stealth Utility Cargo",
        "categoryName": "Pants",
        "price": "95.00",
        "inventory": "75",
        "description": "Premium utility multi-pocket cargo pants featuring straps and durable zippers.",
        "sizes": ["M", "L", "XL"],
        "colors": ["Carbon Black", "Dark Khaki"],
        "images": ["https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop"],
        "isFeatured": false
      }
    ];
    setBulkInput(JSON.stringify(sample, null, 2));
    setBulkFormat("json");
  };

  const handleLoadSampleCSV = () => {
    const sample = `Streetwear Acid Tee,T-Shirts,49.99,120,Acid washed organic cotton drop shoulder tee,S;M;L;XL,Acid Black;Acid Wash,https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop
Stealth Tech Windbreaker,Hoodies,119.99,40,Lightweight water resistant utility windbreaker,M;L;XL,Carbon Black,https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop`;
    setBulkInput(sample);
    setBulkFormat("csv");
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
        <Button
          onClick={() => {
            handleResetForm();
            setDialogTab("single");
            setIsOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 font-bold group h-12 px-6"
        >
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
            <Button
              onClick={() => {
                handleResetForm();
                setDialogTab("single");
                setIsOpen(true);
              }}
              variant="outline"
              className="border-2 font-bold"
            >
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
                            <DropdownMenuItem
                              onClick={() => handleStartEdit(product)}
                              className="font-bold cursor-pointer"
                            >
                              <Edit className="w-4 h-4 mr-2 text-primary" /> Edit Details
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

      {/* Main Action Dialog (Single Add/Edit or Bulk Importer) */}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) handleResetForm();
        }}
      >
        <DialogContent className={cn("bg-background border-border max-h-[90vh] overflow-y-auto transition-all duration-300", dialogTab === "bulk" && !editingProduct ? "sm:max-w-[850px]" : "sm:max-w-[550px]")}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              {editingProduct
                ? "EDIT PRODUCT DETAILS"
                : dialogTab === "bulk"
                  ? "BULK IMPORT STREETWEAR"
                  : "ADD NEW STREETWEAR"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? `Modifying ${editingProduct.name} parameters inside Neon PostgreSQL.`
                : dialogTab === "bulk"
                  ? "Perform rapid database updates by pasting bulk JSON arrays or standard CSV rows."
                  : "Upload a premium new streetwear garment to the database with detailed metadata."}
            </DialogDescription>
          </DialogHeader>

          {/* Dynamic Action Tabs (Only displayed when creating new products) */}
          {!editingProduct && (
            <div className="flex border-b border-border my-4">
              <button
                type="button"
                onClick={() => setDialogTab("single")}
                className={cn(
                  "flex-1 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all flex items-center justify-center gap-2",
                  dialogTab === "single"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Plus className="w-3.5 h-3.5" /> Single Product Add
              </button>
              <button
                type="button"
                onClick={() => setDialogTab("bulk")}
                className={cn(
                  "flex-1 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all flex items-center justify-center gap-2",
                  dialogTab === "bulk"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Multi-Add / Bulk Importer
              </button>
            </div>
          )}

          {/* TAB 1: Single Product Adding / Editing Details */}
          {dialogTab === "single" ? (
            <form onSubmit={handleSubmit} className="space-y-6 pt-2">
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

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Showcase Images</label>

                {/* Premium Drag and Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-input")?.click()}
                  className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 overflow-hidden bg-muted/5 group",
                    isDragging
                      ? "border-primary bg-primary/5 scale-[1.01]"
                      : "border-border hover:border-primary/50 hover:bg-muted/15"
                  )}
                >
                  {isDragging && (
                    <div className="absolute inset-0 bg-primary/5 backdrop-blur-[2px] pointer-events-none transition-all" />
                  )}

                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {uploadingCount > 0 ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">
                      {uploadingCount > 0 ? `Uploading ${uploadingCount} files...` : "Drag & drop product images here"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Or <span className="text-primary font-black underline">browse local files</span> (PNG, JPG up to 10MB)
                    </p>
                  </div>

                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      if (e.target.files) {
                        await handleImageUploads(e.target.files);
                      }
                    }}
                  />
                </div>

                {/* Uploading Files Indicator */}
                {uploadingCount > 0 && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center gap-3 text-xs text-primary font-bold">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>Processing and uploading garments to Cloud Storage...</span>
                  </div>
                )}

                {/* Previews Grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mt-3">
                    {images.map((imgUrl, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-border group bg-black shadow-lg">
                        <img src={imgUrl} alt="preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-all duration-300">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImages((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className="bg-destructive hover:bg-destructive/90 text-white font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-md hover:scale-105 transition-transform"
                          >
                            Delete
                          </button>
                        </div>
                        <Badge className="absolute top-2 left-2 bg-black/60 border border-border text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 pointer-events-none">
                          #{idx + 1}
                        </Badge>
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
                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold text-xs transition-all ${isSelected
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    handleResetForm();
                  }}
                  className="border-2 font-bold"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90 font-bold px-6">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {editingProduct ? "Updating..." : "Uploading..."}
                    </>
                  ) : (
                    editingProduct ? "Save Changes" : "Create Product"
                  )}
                </Button>
              </div>
            </form>
          ) : (
            /* TAB 2: Multi-Add / Bulk Importer */
            <div className="space-y-6 pt-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBulkFormat("json");
                      setBulkProducts([]);
                    }}
                    className={cn(
                      "px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg border-2 transition-all",
                      bulkFormat === "json"
                        ? "border-primary text-primary bg-primary/5"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    JSON Array Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBulkFormat("csv");
                      setBulkProducts([]);
                    }}
                    className={cn(
                      "px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg border-2 transition-all",
                      bulkFormat === "csv"
                        ? "border-primary text-primary bg-primary/5"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    CSV Rows Mode
                  </button>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={bulkFormat === "json" ? handleLoadSampleJSON : handleLoadSampleCSV}
                    variant="outline"
                    className="h-8 text-[10px] font-bold uppercase tracking-wider border-dashed flex items-center gap-1.5"
                  >
                    <DownloadCloud className="w-3.5 h-3.5" /> Load Example Template
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex justify-between">
                  <span>Raw Import Script</span>
                  <span className="text-[10px] text-primary lowercase tracking-normal">
                    {bulkFormat === "json" ? "JSON Format: [{ name, price, categoryName, sizes: [] }]" : "CSV Format: Name,Category,Price,Inventory,Description,Sizes,Colors,Images"}
                  </span>
                </label>
                <textarea
                  className="w-full min-h-[160px] font-mono rounded-lg border border-input bg-muted/30 px-3 py-3 text-xs focus-visible:outline-none text-foreground border-border bg-black"
                  placeholder={bulkFormat === "json"
                    ? "[\n  {\n    \"name\": \"Premium Bomber Jacket\",\n    \"categoryName\": \"Hoodies\",\n    \"price\": \"120.00\",\n    \"inventory\": \"30\"\n  }\n]"
                    : "Premium Acid Tee,T-Shirts,49.99,100,Carbon washed graphic custom tee,S;M;L,Black;White,https://img.url"
                  }
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  disabled={isBulkImporting}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleParseBulk}
                  disabled={isBulkImporting || !bulkInput.trim()}
                  className="bg-zinc-800 hover:bg-zinc-700 text-foreground border border-zinc-700 font-bold px-6"
                >
                  Parse & Validate Data
                </Button>
              </div>

              {/* Parsed Live Preview Table */}
              {bulkProducts.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4" /> Live Import Preview ({bulkProducts.length} Items Parsed)
                  </h4>

                  <div className="border border-border rounded-xl overflow-hidden max-h-[220px] overflow-y-auto bg-black/40">
                    <Table>
                      <TableHeader className="bg-zinc-950/80 sticky top-0">
                        <TableRow className="border-border">
                          <TableHead className="text-[10px] font-bold uppercase py-2">Garment Name</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-2">Category</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-2">Price</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-2">Stock</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-2 text-right">Sizes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bulkProducts.map((p, idx) => (
                          <TableRow key={idx} className="border-border hover:bg-muted/30">
                            <TableCell className="font-bold py-2">{p.name}</TableCell>
                            <TableCell className="py-2">
                              <Badge variant="secondary" className="text-[8px] font-bold">{p.categoryName}</Badge>
                            </TableCell>
                            <TableCell className="font-black text-primary py-2">${parseFloat(p.price).toFixed(2)}</TableCell>
                            <TableCell className="font-bold py-2">{p.inventory}</TableCell>
                            <TableCell className="text-right py-2 text-[10px] text-muted-foreground font-semibold">{p.sizes.join(",")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Progressive Batch Upload Indicator */}
              {isBulkImporting && (
                <div className="space-y-2.5 py-2 border-t border-border">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-primary">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Batch uploading garments to Neon PostgreSQL...
                    </span>
                    <span>{bulkProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700 shadow-inner">
                    <div className="h-full bg-primary transition-all duration-300" style={{ width: `${bulkProgress}%` }} />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isBulkImporting}
                  onClick={() => {
                    setIsOpen(false);
                    handleResetForm();
                  }}
                  className="border-2 font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleBulkImport}
                  disabled={isBulkImporting || bulkProducts.length === 0}
                  className="bg-primary hover:bg-primary/90 font-bold px-8"
                >
                  {isBulkImporting ? `Importing (${bulkProgress}%)` : `Import ${bulkProducts.length} Products`}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
