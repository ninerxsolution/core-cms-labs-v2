import { prisma } from "@/lib/prisma";
import type { PageStatus, Prisma } from "@prisma/client";
import type { Data } from "@measured/puck";
import type { Page } from "../types";

/**
 * Page Repository
 * Handles all database operations for pages
 */

export const pageRepository = {
  /**
   * Find page by ID
   */
  async findById(id: string): Promise<Page | null> {
    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!page) {
      return null;
    }

    return {
      ...page,
      description: page.description ?? undefined,
      publishedAt: page.publishedAt ?? undefined,
      authorId: page.authorId ?? undefined,
      author: page.author
        ? {
            ...page.author,
            name: page.author.name ?? undefined,
          }
        : undefined,
      status: page.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      content: page.content as Data, // Puck Data type
    };
  },

  /**
   * Find page by slug
   */
  async findBySlug(slug: string): Promise<Page | null> {
    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!page) {
      return null;
    }

    return {
      ...page,
      description: page.description ?? undefined,
      publishedAt: page.publishedAt ?? undefined,
      authorId: page.authorId ?? undefined,
      author: page.author
        ? {
            ...page.author,
            name: page.author.name ?? undefined,
          }
        : undefined,
      status: page.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      content: page.content as Data, // Puck Data type
    };
  },

  /**
   * Find all pages with filters
   */
  async findAll(options?: {
    status?: PageStatus;
    authorId?: string;
    search?: string;
  }): Promise<Page[]> {
    const where: Prisma.PageWhereInput = {};

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.authorId) {
      where.authorId = options.authorId;
    }

    if (options?.search) {
      where.OR = [
        { title: { contains: options.search, mode: "insensitive" } },
        { slug: { contains: options.search, mode: "insensitive" } },
        { description: { contains: options.search, mode: "insensitive" } },
      ];
    }

    const pages = await prisma.page.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return pages.map((page) => ({
      ...page,
      description: page.description ?? undefined,
      publishedAt: page.publishedAt ?? undefined,
      authorId: page.authorId ?? undefined,
      author: page.author
        ? {
            ...page.author,
            name: page.author.name ?? undefined,
          }
        : undefined,
      status: page.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      content: page.content as Data, // Puck Data type
    }));
  },

  /**
   * Create a new page
   */
  async create(data: {
    slug: string;
    title: string;
    description?: string;
    content: Data; // Puck Data type
    authorId?: string;
  }): Promise<Page> {
    const page = await prisma.page.create({
      data: {
        slug: data.slug,
        title: data.title,
        description: data.description,
        content: data.content,
        authorId: data.authorId,
        status: "DRAFT",
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return {
      ...page,
      description: page.description ?? undefined,
      publishedAt: page.publishedAt ?? undefined,
      authorId: page.authorId ?? undefined,
      author: page.author
        ? {
            ...page.author,
            name: page.author.name ?? undefined,
          }
        : undefined,
      status: page.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      content: page.content as Data, // Puck Data type
    };
  },

  /**
   * Update a page
   */
  async update(
    id: string,
    data: {
      slug?: string;
      title?: string;
      description?: string;
      content?: Data; // Puck Data type
      status?: PageStatus;
    }
  ): Promise<Page> {
    const page = await prisma.page.update({
      where: { id },
      data: {
        ...data,
        ...(data.status === "PUBLISHED" && !data.content
          ? { publishedAt: new Date() }
          : {}),
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return {
      ...page,
      description: page.description ?? undefined,
      publishedAt: page.publishedAt ?? undefined,
      authorId: page.authorId ?? undefined,
      author: page.author
        ? {
            ...page.author,
            name: page.author.name ?? undefined,
          }
        : undefined,
      status: page.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      content: page.content as Data, // Puck Data type
    };
  },

  /**
   * Delete a page
   */
  async delete(id: string): Promise<void> {
    await prisma.page.delete({
      where: { id },
    });
  },

  /**
   * Publish a page
   */
  async publish(id: string): Promise<Page> {
    const page = await prisma.page.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return {
      ...page,
      description: page.description ?? undefined,
      publishedAt: page.publishedAt ?? undefined,
      authorId: page.authorId ?? undefined,
      author: page.author
        ? {
            ...page.author,
            name: page.author.name ?? undefined,
          }
        : undefined,
      status: page.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      content: page.content as Data, // Puck Data type
    };
  },

  /**
   * Unpublish a page
   */
  async unpublish(id: string): Promise<Page> {
    const page = await prisma.page.update({
      where: { id },
      data: {
        status: "DRAFT",
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return {
      ...page,
      description: page.description ?? undefined,
      publishedAt: page.publishedAt ?? undefined,
      authorId: page.authorId ?? undefined,
      author: page.author
        ? {
            ...page.author,
            name: page.author.name ?? undefined,
          }
        : undefined,
      status: page.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      content: page.content as Data, // Puck Data type
    };
  },
};

