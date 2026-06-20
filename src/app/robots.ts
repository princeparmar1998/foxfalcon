import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/profile/", "/cart/", "/checkout/"],
    },
    sitemap: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/sitemap.xml`,
  };
}
