import { NextRequest, NextResponse } from "next/server";
import { requireServerAuth } from "@/lib/auth/session";
import { authAdminService } from "@/features/auth/services/auth-admin.service";

/**
 * GET /api/admin/sessions
 * Get all sessions (admin only)
 */
export async function GET() {
  try {
    // Require authentication
    await requireServerAuth();

    const sessions = await authAdminService.getAllSessions();

    return NextResponse.json(
      { sessions },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Get all sessions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/sessions
 * Revoke a session (admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Require authentication
    await requireServerAuth();

    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Revoke the session
    await authAdminService.revokeSession(sessionId);

    return NextResponse.json(
      { message: "Session revoked successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Revoke session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

