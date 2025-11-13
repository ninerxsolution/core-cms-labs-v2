import { NextRequest, NextResponse } from "next/server";
import { requireServerAuth } from "@/lib/auth/session";
import { pageService } from "@/features/pages/services/page.service";
import type { CreatePageInput } from "@/features/pages/types";

/**
 * GET /api/pages
 * List all pages (with filters)
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    await requireServerAuth();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as
      | "DRAFT"
      | "PUBLISHED"
      | "ARCHIVED"
      | null;
    const search = searchParams.get("search") || undefined;
    const authorId = searchParams.get("authorId") || undefined;

    const pages = await pageService.listPages({
      status: status || undefined,
      authorId,
      search,
    });

    return NextResponse.json({ pages }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("List pages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pages
 * Create a new page
 * If no body is provided, creates a new page with auto-generated slug (untitled, untitled-1, etc.)
 * If body is provided, creates page with provided data
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireServerAuth();

    const body = await request.json().catch(() => ({}));
    const { slug, title, description, content } = body;

    // If no body or empty body, create new page with auto-generated slug
    if (!slug && !title && !content) {
      const page = await pageService.createNewPage(session.user.id);
      return NextResponse.json({ page }, { status: 201 });
    }

    // Validate input for manual creation
    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: "Slug, title, and content are required" },
        { status: 400 }
      );
    }

    const input: CreatePageInput = {
      slug,
      title,
      description,
      content,
    };

    const page = await pageService.createPage(input, session.user.id);

    return NextResponse.json({ page }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (
      error instanceof Error &&
      (error.message.includes("Slug") ||
        error.message.includes("already exists"))
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Create page error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

