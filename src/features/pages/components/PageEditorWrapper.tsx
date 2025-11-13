"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageEditor } from "./PageEditor";
import { PageInfoModal } from "./PageInfoModal";
import { getAdminPath } from "@/lib/config/admin";
import { toast } from "sonner";
import type { Data } from "@measured/puck";
import type { Page } from "../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const pageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

type PageFormValues = z.infer<typeof pageSchema>;

interface PageEditorWrapperProps {
  page: Page;
}

export function PageEditorWrapper({ page: initialPage }: PageEditorWrapperProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [puckData, setPuckData] = useState<Data>(initialPage.content);
  const [isPageInfoModalOpen, setIsPageInfoModalOpen] = useState(false);

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: initialPage.title,
      description: initialPage.description || "",
      status: initialPage.status,
    },
  });

  const handleSave = async (
    pageFormData: PageFormValues,
    puckContent: Data,
    publish: boolean = false
  ) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/pages/${initialPage.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: pageFormData.title,
          description: pageFormData.description || undefined,
          content: puckContent, // Use the latest puck content passed in
          status: publish ? "PUBLISHED" : pageFormData.status, // If publish, set to PUBLISHED, otherwise keep current status
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save page");
      }

      // Update local state after successful save
      setPuckData(puckContent);

      if (publish) {
        toast.success("Page published successfully");
      } else {
        toast.success("Page saved successfully");
      }
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save page";
      toast.error(publish ? `Failed to publish page: ${errorMessage}` : `Failed to save page: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    window.open(`/${initialPage.slug}`, "_blank");
  };

  const handleExit = () => {
    router.push(getAdminPath("pages"));
  };

  return (
    <div className="flex h-full flex-col">
      {/* Fullscreen Puck Editor */}
      <div className="flex-1 overflow-hidden">
        <PageEditor
          initialData={puckData}
          onSave={async (data) => {
            // Pass the latest puck data directly to handleSave
            await handleSave(form.getValues(), data, false); // Save as draft (keep current status)
          }}
          onPublish={async (data) => {
            // Pass the latest puck data directly to handleSave
            await handleSave(form.getValues(), data, true); // Publish (set status to PUBLISHED)
          }}
          onPreview={handlePreview}
          onPageInfo={() => setIsPageInfoModalOpen(true)}
          onExit={handleExit}
          isLoading={isSaving}
        />
      </div>

      {/* Page Info Modal */}
      <PageInfoModal
        page={initialPage}
        open={isPageInfoModalOpen}
        onOpenChange={setIsPageInfoModalOpen}
        onSave={async (data) => {
          // Update form values before saving
          form.setValue("title", data.title);
          form.setValue("description", data.description);
          form.setValue("status", data.status);
          // Use current puckData when saving from modal
          await handleSave(data, puckData, false);
        }}
        isSaving={isSaving}
        initialValues={form.getValues()}
      />
    </div>
  );
}

