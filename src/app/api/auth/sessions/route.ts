import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { authService } from "@/features/auth/services/auth.service";
import { authAdminService } from "@/features/auth/services/auth-admin.service";

/**
 * GET /api/auth/sessions
 * Get all sessions for current user
 */
export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const sessions = await authAdminService.getUserSessions(session.user.id);

    return NextResponse.json(
      { sessions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get sessions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/sessions
 * Revoke a session (current user only)
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Get the session to verify it belongs to the user
    const sessionData = await authService.getSession(sessionId);
    
    if (!sessionData || sessionData.user.id !== session.user.id) {
      return NextResponse.json(
        { error: "Session not found or unauthorized" },
        { status: 403 }
      );
    }

    // Revoke the session
    await authAdminService.revokeSession(sessionId);

    return NextResponse.json(
      { message: "Session revoked successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Revoke session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

