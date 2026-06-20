import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  // Static routes
  const staticRoutes = [
    "",
    "/shop",
    "/stores",
    "/contact",
    "/terms",
    "/privacy",
    "/custom-design",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Active products from the database
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await db.product.findMany({
      where: {
        deletedAt: null,
        NOT: {
          name: { startsWith: "[DELETED]" },
        },
      },
      select: {
        id: true,
        updatedAt: true,
      },
    });

    productRoutes = products.map((product) => ({
      url: `${baseUrl}/shop/${product.id}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Sitemap dynamic product generation error:", error);
  }

  // Active categories from the database
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await db.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    categoryRoutes = categories.map((cat) => ({
      url: `${baseUrl}/shop?category=${encodeURIComponent(cat.name.toLowerCase())}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap dynamic category generation error:", error);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
