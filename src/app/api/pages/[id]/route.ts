import { NextRequest, NextResponse } from "next/server";
import { requireServerAuth } from "@/lib/auth/session";
import { pageService } from "@/features/pages/services/page.service";
import type { UpdatePageInput } from "@/features/pages/types";

/**
 * GET /api/pages/[id]
 * Get page by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    await requireServerAuth();

    const { id } = await params;
    const page = await pageService.getPageById(id);

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ page }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Get page error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/pages/[id]
 * Update a page
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    await requireServerAuth();

    const { id } = await params;
    const body = await request.json();
    const { slug, title, description, content, status } = body;

    const input: UpdatePageInput = {
      slug,
      title,
      description,
      content,
      status,
    };

    const page = await pageService.updatePage(id, input);

    return NextResponse.json({ page }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message === "Page not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (
      error instanceof Error &&
      (error.message === "Slug already exists" ||
        error.message.includes("Slug must contain"))
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Update page error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/pages/[id]
 * Delete a page
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    await requireServerAuth();

    const { id } = await params;
    await pageService.deletePage(id);

    return NextResponse.json(
      { message: "Page deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message === "Page not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error("Delete page error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

