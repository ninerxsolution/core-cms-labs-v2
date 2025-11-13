"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminPath } from "@/lib/config/admin";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import type { Data } from "@measured/puck";

const newPageSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

type NewPageFormValues = z.infer<typeof newPageSchema>;

export function NewPageForm() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<NewPageFormValues>({
    resolver: zodResolver(newPageSchema),
    defaultValues: {
      slug: "",
      title: "",
      description: "",
    },
  });

  const handleSubmit = async (values: NewPageFormValues) => {
    setIsCreating(true);
    try {
      // Default empty Puck data
      const defaultContent: Data = {
        content: [],
        root: {},
        zones: {},
      };

      const response = await fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: values.slug,
          title: values.title,
          description: values.description || undefined,
          content: defaultContent,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create page");
      }

      const result = await response.json();
      toast.success("Page created successfully");
      router.push(getAdminPath("pages", result.page.id));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create page";
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Page</h1>
        <p className="text-muted-foreground">
          Create a new page and start editing with Puck.js
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="about-us"
                        disabled={isCreating}
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      URL: /{field.value || "slug"}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="About Us"
                        disabled={isCreating}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Meta description for SEO"
                        disabled={isCreating}
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Page
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

