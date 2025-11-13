import { NextRequest, NextResponse } from "next/server";
import { requireServerAuth } from "@/lib/auth/session";
import { pageService } from "@/features/pages/services/page.service";

/**
 * POST /api/pages/[id]/publish
 * Publish or unpublish a page
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    await requireServerAuth();

    const { id } = await params;
    const body = await request.json();
    const { action } = body; // "publish" or "unpublish"

    if (action === "publish") {
      const page = await pageService.publishPage(id);
      return NextResponse.json(
        { page, message: "Page published successfully" },
        { status: 200 }
      );
    } else if (action === "unpublish") {
      const page = await pageService.unpublishPage(id);
      return NextResponse.json(
        { page, message: "Page unpublished successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'publish' or 'unpublish'" },
        { status: 400 }
      );
    }
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

    console.error("Publish/unpublish page error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

