import { getCachedProducts } from "@/lib/queries";
import { ShopListing } from "@/components/ShopListing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Collections | Fox Falcon",
  description: "Explore the Fox Falcon premium heavyweight streetwear catalog. Browse our collection of oversized graphic tees, utility cargo pants, rider jackets, and custom blanks.",
  keywords: [
    "Fox Falcon shop",
    "Fox Falcon catalog",
    "Foc Falcon products",
    "buy Fox Falcon online",
    "oversized streetwear tees",
    "utility cargo pants",
    "rider clothing jackets",
    "heavyweight hoodies",
    "streetwear shop India",
    "premium cotton blanks",
    "fox CLothing",
    "falcon CLothing",
    "foxfalcon clothing",
    "foxfalcon streetwear",
    "foxfalcon hoodie",
    "foxfalcon t-shirt",
    "foxfalcon jacket",
    "foxfalcon pants",
    "foxfalcon shorts",
    "foxfalcon bag",
    "foxfalcon accessories",
    "foxfalcon hoodie",
    "foxfalcon t-shirt",
    "foxfalcon jacket",
    "foxfalcon pants",
    "foxfalcon shorts",
    "foxfalcon bag",
    "foxfalcon accessories",
    "foxfalcon hoodie",
    "foxfalcon t-shirt",
    "foxfalcon jacket",
    "foxfalcon pants",
    "foxfalcon shorts",
    "foxfalcon bag",
    "foxfalcon accessories",
  ],
  openGraph: {
    title: "Shop All Collections | Fox Falcon",
    description: "Explore the Fox Falcon premium heavyweight streetwear catalog.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
        width: 800,
        height: 600,
        alt: "Fox Falcon Collections",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop All Collections | Fox Falcon",
    description: "Explore the Fox Falcon premium heavyweight streetwear catalog.",
  },
};

export default async function ShopPage() {
  // Query all active products directly from the database on the server (cached)
  const dbProducts = await getCachedProducts();

  // Serialize Prisma types (Decimals & Dates) to POJO (Plain Old JavaScript Objects)
  const products = dbProducts.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    categoryId: product.categoryId,
    images: product.images,
    inventory: product.inventory,
    sizes: product.sizes,
    colors: product.colors,
    isFeatured: product.isFeatured,
    createdAt: typeof product.createdAt === "string" ? product.createdAt : (product.createdAt as Date).toISOString(),
    updatedAt: typeof product.updatedAt === "string" ? product.updatedAt : (product.updatedAt as Date).toISOString(),
    deletedAt: product.deletedAt ? (typeof product.deletedAt === "string" ? product.deletedAt : (product.deletedAt as Date).toISOString()) : null,
    category: product.category
      ? {
        id: product.category.id,
        name: product.category.name,
      }
      : null,
  }));

  return <ShopListing initialProducts={products} />;
}
