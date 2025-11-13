import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pageService } from "@/features/pages/services/page.service";
import { PageRenderer } from "@/features/pages/components/PageRenderer";
import { getAdminBasePath } from "@/lib/config/admin";

/**
 * Public Page Route
 * 
 * Renders published pages based on slug
 * - Only PUBLISHED pages are accessible
 * - Returns 404 if page not found or not published
 * - Includes SEO metadata
 * 
 * Note: This route should not conflict with:
 * - /admin/* (admin routes)
 * - /login (auth route)
 * - /api/* (API routes)
 * - Reserved Next.js routes
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  // Check if slug is a reserved route
  const adminBasePath = getAdminBasePath();
  if (slug === adminBasePath || slug === "login" || slug === "api") {
    return {
      title: "Not Found",
    };
  }

  const page = await pageService.getPublishedPageBySlug(slug);

  if (!page) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: page.title,
    description: page.description || undefined,
    // Add more SEO metadata as needed
    openGraph: {
      title: page.title,
      description: page.description || undefined,
      type: "website",
    },
  };
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const adminBasePath = getAdminBasePath();

  // Prevent access to reserved routes
  if (slug === adminBasePath || slug === "login" || slug === "api") {
    notFound();
  }

  // Fetch published page by slug
  const page = await pageService.getPublishedPageBySlug(slug);

  if (!page) {
    notFound();
  }

  // Render page content using Puck.js
  return <PageRenderer data={page.content} />;
}

