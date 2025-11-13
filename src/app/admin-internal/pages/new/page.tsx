import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { getAdminPath } from "@/lib/config/admin";

/**
 * This page is no longer used.
 * New pages are created directly from the pages list.
 * Redirect to pages list.
 */
export default async function NewPagePage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  redirect(getAdminPath("pages"));
}

