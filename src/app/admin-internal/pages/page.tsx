import { PageList } from "@/features/pages/components/PageList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pages",
  description: "Manage your pages and content",
};

export default function PagesPage() {
  return <PageList />;
}

