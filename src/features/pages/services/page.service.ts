import { pageRepository } from "../repositories/page.repository";
import type { Page, CreatePageInput, UpdatePageInput } from "../types";

/**
 * Page Service
 * Handles page business logic
 */

export const pageService = {
  /**
   * Get page by ID
   */
  async getPageById(id: string): Promise<Page | null> {
    return pageRepository.findById(id);
  },

  /**
   * Get page by slug (for public view)
   */
  async getPublishedPageBySlug(slug: string): Promise<Page | null> {
    const page = await pageRepository.findBySlug(slug);
    
    if (!page || page.status !== "PUBLISHED") {
      return null;
    }

    return page;
  },

  /**
   * List pages with filters
   */
  async listPages(options?: {
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    authorId?: string;
    search?: string;
  }): Promise<Page[]> {
    return pageRepository.findAll(options);
  },

  /**
   * Generate a unique slug starting from baseSlug
   * If baseSlug exists, tries baseSlug-1, baseSlug-2, etc.
   */
  async generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 0;

    while (true) {
      const existingPage = await pageRepository.findBySlug(slug);
      if (!existingPage) {
        return slug;
      }

      counter++;
      slug = `${baseSlug}-${counter}`;
    }
  },

  /**
   * Create a new page with auto-generated unique slug
   * Uses "untitled" as base slug and generates untitled, untitled-1, untitled-2, etc.
   */
  async createNewPage(authorId?: string): Promise<Page> {
    const baseSlug = "untitled";
    const uniqueSlug = await this.generateUniqueSlug(baseSlug);

    // Default empty Puck data
    const defaultContent = {
      content: [],
      root: {},
      zones: {},
    };

    return this.createPage(
      {
        slug: uniqueSlug,
        title: "Untitled",
        description: undefined,
        content: defaultContent,
      },
      authorId
    );
  },

  /**
   * Create a new page
   */
  async createPage(
    input: CreatePageInput,
    authorId?: string
  ): Promise<Page> {
    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(input.slug)) {
      throw new Error(
        "Slug must contain only lowercase letters, numbers, and hyphens"
      );
    }

    // Check if slug already exists
    const existingPage = await pageRepository.findBySlug(input.slug);
    if (existingPage) {
      throw new Error("Slug already exists");
    }

    return pageRepository.create({
      slug: input.slug,
      title: input.title,
      description: input.description,
      content: input.content,
      authorId,
    });
  },

  /**
   * Update a page
   */
  async updatePage(
    id: string,
    input: UpdatePageInput
  ): Promise<Page> {
    const page = await pageRepository.findById(id);
    if (!page) {
      throw new Error("Page not found");
    }

    // Validate slug format if provided
    if (input.slug !== undefined) {
      if (!/^[a-z0-9-]+$/.test(input.slug)) {
        throw new Error(
          "Slug must contain only lowercase letters, numbers, and hyphens"
        );
      }

      // Check if slug already exists (excluding current page)
      const existingPage = await pageRepository.findBySlug(input.slug);
      if (existingPage && existingPage.id !== id) {
        throw new Error("Slug already exists");
      }
    }

    return pageRepository.update(id, input);
  },

  /**
   * Delete a page
   */
  async deletePage(id: string): Promise<void> {
    const page = await pageRepository.findById(id);
    if (!page) {
      throw new Error("Page not found");
    }

    await pageRepository.delete(id);
  },

  /**
   * Publish a page
   */
  async publishPage(id: string): Promise<Page> {
    const page = await pageRepository.findById(id);
    if (!page) {
      throw new Error("Page not found");
    }

    return pageRepository.publish(id);
  },

  /**
   * Unpublish a page
   */
  async unpublishPage(id: string): Promise<Page> {
    const page = await pageRepository.findById(id);
    if (!page) {
      throw new Error("Page not found");
    }

    return pageRepository.unpublish(id);
  },
};

