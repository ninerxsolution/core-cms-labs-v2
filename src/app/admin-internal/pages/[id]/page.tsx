import { notFound, redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { pageService } from "@/features/pages/services/page.service";
import { PageEditorWrapper } from "@/features/pages/components/PageEditorWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Page",
  description: "Edit page content with Puck.js",
};

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const page = await pageService.getPageById(id);

  if (!page) {
    notFound();
  }

  return <PageEditorWrapper page={page} />;
}

