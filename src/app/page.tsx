import { redirect } from "next/navigation";
import { pageService } from "@/features/pages/services/page.service";

/**
 * Home Page
 * 
 * For now, we'll try to find a page with slug "home" or "index"
 * If not found, we'll show a simple landing page
 * 
 * TODO: Add configuration for default home page slug
 */
export default async function HomePage() {
  // Try to find a home page
  const homePage = await pageService.getPublishedPageBySlug("home");
  
  if (homePage) {
    redirect(`/home`);
  }

  // Try index page
  const indexPage = await pageService.getPublishedPageBySlug("index");
  
  if (indexPage) {
    redirect(`/index`);
  }

  // No home page found, show default landing
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome</h1>
        <p className="text-muted-foreground">
          No home page has been published yet.
        </p>
        <p className="text-sm text-muted-foreground">
          Create and publish a page with slug &quot;home&quot; or &quot;index&quot; to set your home page.
        </p>
      </div>
    </div>
  );
}
