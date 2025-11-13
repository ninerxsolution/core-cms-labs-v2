"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAdminPath } from "@/lib/config/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Loader2,
  Pencil,
} from "lucide-react";
import type { Page } from "../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageInfoModal } from "./PageInfoModal";
import { toast } from "sonner";

export function PageList() {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);
  const [quickEditDialogOpen, setQuickEditDialogOpen] = useState(false);
  const [pageToEdit, setPageToEdit] = useState<Page | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingNewPage, setIsCreatingNewPage] = useState(false);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (search) {
        params.append("search", search);
      }

      const response = await fetch(`/api/pages?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch pages");
      }

      const data = await response.json();
      setPages(data.pages || []);
    } catch {
      toast.error("Failed to load pages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleDelete = async (page: Page) => {
    setPageToDelete(page);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pageToDelete) return;

    try {
      const response = await fetch(`/api/pages/${pageToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete page");
      }

      toast.success("Page deleted successfully");
      setDeleteDialogOpen(false);
      setPageToDelete(null);
      fetchPages();
    } catch {
      toast.error("Failed to delete page");
    }
  };

  const handleCreateNewPage = async () => {
    setIsCreatingNewPage(true);
    try {
      const response = await fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create page");
      }

      const result = await response.json();
      toast.success("Page created successfully");
      router.push(getAdminPath("pages", result.page.id));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create page";
      toast.error(errorMessage);
    } finally {
      setIsCreatingNewPage(false);
    }
  };

  const handleQuickEdit = (page: Page) => {
    setPageToEdit(page);
    setQuickEditDialogOpen(true);
  };

  const handleSaveQuickEdit = async (data: {
    slug: string;
    title: string;
    description?: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  }) => {
    if (!pageToEdit) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/pages/${pageToEdit.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: data.slug,
          title: data.title,
          description: data.description,
          status: data.status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update page");
      }

      toast.success("Page updated successfully");
      setQuickEditDialogOpen(false);
      setPageToEdit(null);
      fetchPages();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update page";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: Page["status"]) => {
    const variants = {
      DRAFT: "secondary",
      PUBLISHED: "default",
      ARCHIVED: "outline",
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status}
      </Badge>
    );
  };

  const filteredPages = pages.filter((page) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      page.title.toLowerCase().includes(searchLower) ||
      page.slug.toLowerCase().includes(searchLower) ||
      page.description?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
          <p className="text-muted-foreground">
            Manage your pages and content
          </p>
        </div>
        <Button
          onClick={handleCreateNewPage}
          disabled={isCreatingNewPage}
        >
          {isCreatingNewPage ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              New Page
            </>
          )}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No pages found
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    /{page.slug}
                  </TableCell>
                  <TableCell>{getStatusBadge(page.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {page.author?.email || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link href={`/${page.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuickEdit(page)}
                        title="Quick Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link href={getAdminPath("pages", page.id)}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(page)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              page &quot;{pageToDelete?.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quick Edit Dialog */}
      {pageToEdit && (
        <PageInfoModal
          page={pageToEdit}
          open={quickEditDialogOpen}
          onOpenChange={setQuickEditDialogOpen}
          onSave={handleSaveQuickEdit}
          isSaving={isSaving}
          initialValues={{
            slug: pageToEdit.slug,
            title: pageToEdit.title,
            description: pageToEdit.description || "",
            status: pageToEdit.status,
          }}
        />
      )}
    </div>
  );
}

