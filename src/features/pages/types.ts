import type { Data } from "@measured/puck";

/**
 * Page type matching Prisma schema
 */
export interface Page {
  id: string;
  slug: string;
  title: string;
  description?: string;
  content: Data; // Puck Data type
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  authorId?: string;
  author?: {
    id: string;
    email: string;
    name?: string;
  };
}

/**
 * Create page input
 */
export interface CreatePageInput {
  slug: string;
  title: string;
  description?: string;
  content: Data;
}

/**
 * Update page input
 */
export interface UpdatePageInput {
  slug?: string;
  title?: string;
  description?: string;
  content?: Data;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

