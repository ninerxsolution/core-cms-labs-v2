import { NextRequest, NextResponse } from "next/server";
import { requireServerAuth } from "@/lib/auth/session";
import { authAdminService } from "@/features/auth/services/auth-admin.service";

/**
 * GET /api/admin/users/[userId]/sessions
 * Get all sessions for a specific user (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Require authentication
    await requireServerAuth();

    const { userId } = await params;

    const sessions = await authAdminService.getUserSessions(userId);

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

    console.error("Get user sessions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[userId]/sessions
 * Revoke all sessions for a specific user (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Require authentication
    await requireServerAuth();

    const { userId } = await params;

    // Revoke all sessions for the user
    await authAdminService.revokeAllUserSessions(userId);

    return NextResponse.json(
      { message: "All user sessions revoked successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Revoke all user sessions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

