import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/features/auth/services/auth.service";
import { cookieUtils } from "@/features/auth/utils/cookies";

/**
 * POST /api/auth/login
 * Login user with email and password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Login user
    const result = await authService.login({ email, password });

    // Set session cookie
    await cookieUtils.setSessionCookie(result.session.id);

    // Return user data (without password)
    return NextResponse.json(
      {
        user: result.user,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle authentication errors
    if (error instanceof Error && error.message === "Invalid email or password") {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Handle other errors
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

