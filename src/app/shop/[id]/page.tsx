import { getCachedProductById, getCachedReviews, getCachedProducts } from "@/lib/queries";
import { Metadata } from "next";
import ProductDetailClient from "@/components/ProductDetailClient";
import { notFound } from "next/navigation";

interface ProductDetailPageProps {
  params: { id: string };
}

// 1. Dynamic SEO Metadata Generator Hook
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = await getCachedProductById(params.id);

  if (!product || product.deletedAt || product.name.startsWith("[DELETED]")) {
    return {
      title: "Product Not Found | Fox Falcon",
    };
  }

  const title = `${product.name} | Premium Heavyweight Streetwear | Fox Falcon`;
  const description = `${product.description.slice(0, 155)}... Shop luxury heavy-GSM oversized graphic tees and utility wear at Fox Falcon.`;
  const mainImage = product.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop";
  const categoryName = product.category?.name || "streetwear";

  return {
    title,
    description,
    keywords: [
      product.name,
      `${product.name} Fox Falcon`,
      `${product.name} Foc Falcon`,
      categoryName,
      `${categoryName} clothing`,
      "Fox Falcon custom",
      "buy streetwear India"
    ],
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: mainImage,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [mainImage],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Query product, reviews, and recommendations in parallel using cache
  const [productData, dbReviews, dbRecommendations] = await Promise.all([
    getCachedProductById(params.id),
    getCachedReviews(params.id),
    getCachedProducts()
  ]);

  if (!productData || productData.deletedAt || productData.name.startsWith("[DELETED]")) {
    notFound();
  }

  // Serialize models (Prisma decimals and dates) to Plain Old JS Objects
  const product = {
    id: productData.id,
    name: productData.name,
    description: productData.description,
    price: Number(productData.price),
    categoryId: productData.categoryId,
    images: productData.images,
    inventory: productData.inventory,
    sizes: productData.sizes,
    colors: productData.colors,
    isFeatured: productData.isFeatured,
    createdAt: typeof productData.createdAt === "string" ? productData.createdAt : (productData.createdAt as Date).toISOString(),
    updatedAt: typeof productData.updatedAt === "string" ? productData.updatedAt : (productData.updatedAt as Date).toISOString(),
    deletedAt: null,
    category: productData.category
      ? {
          id: productData.category.id,
          name: productData.category.name,
        }
      : null,
  };

  const reviews = dbReviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    productId: r.productId,
    userId: r.userId,
    createdAt: typeof r.createdAt === "string" ? r.createdAt : (r.createdAt as Date).toISOString(),
    user: r.user,
  }));

  const recommendations = dbRecommendations.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    categoryId: p.categoryId,
    images: p.images,
    inventory: p.inventory,
    sizes: p.sizes,
    colors: p.colors,
    isFeatured: p.isFeatured,
    createdAt: typeof p.createdAt === "string" ? p.createdAt : (p.createdAt as Date).toISOString(),
    updatedAt: typeof p.updatedAt === "string" ? p.updatedAt : (p.updatedAt as Date).toISOString(),
    deletedAt: null,
    category: p.category
      ? {
          id: p.category.id,
          name: p.category.name,
        }
      : null,
  }));

  // 2. Dynamic JSON-LD Structured Product Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images || [],
    "description": product.description,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/shop/${product.id}`,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": "2030-01-01",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.inventory > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Fox Falcon",
      },
    },
    ...(reviews.length > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1),
        "reviewCount": reviews.length,
      },
      "review": reviews.map((r) => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": r.user?.name || "Customer",
        },
        "datePublished": r.createdAt.split("T")[0],
        "reviewBody": r.comment,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": r.rating,
          "bestRating": "5",
        },
      })),
    }),
  };

  return (
    <>
      {/* Inject JSON-LD Schema markup into page head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient 
        product={product} 
        initialReviews={reviews} 
        recommendations={recommendations} 
        params={params} 
      />
    </>
  );
}
