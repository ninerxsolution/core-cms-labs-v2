import { NextResponse } from "next/server";
import { cookieUtils } from "@/features/auth/utils/cookies";
import { getServerSession } from "@/lib/auth/session";
import { authService } from "@/features/auth/services/auth.service";

/**
 * POST /api/auth/logout
 * Logout user (delete session)
 */
export async function POST() {
  try {
    const session = await getServerSession();

    if (session) {
      // Delete session from database
      await authService.logout(session.sessionId);
    }

    // Delete session cookie
    await cookieUtils.deleteSessionCookie();

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

