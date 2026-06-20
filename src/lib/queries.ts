import { db } from "./db";
import { unstable_cache } from "next/cache";

export const getCachedProducts = unstable_cache(
  async () => {
    return await db.product.findMany({
      where: {
        deletedAt: null,
        NOT: {
          name: { startsWith: "[DELETED]" }
        }
      },
      include: {
        category: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  },
  ["all-products-list"],
  { revalidate: 3600, tags: ["products"] }
);

export const getCachedProductById = (id: string) => unstable_cache(
  async () => {
    return await db.product.findUnique({
      where: { id },
      include: {
        category: true
      }
    });
  },
  [`product-${id}`],
  { revalidate: 3600, tags: [`product-${id}`, "products"] }
)();

export const getCachedReviews = (productId: string) => unstable_cache(
  async () => {
    return await db.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  },
  [`reviews-${productId}`],
  { revalidate: 3600, tags: [`reviews-${productId}`, "reviews"] }
)();
