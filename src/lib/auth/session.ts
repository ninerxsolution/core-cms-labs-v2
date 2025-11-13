import { cookieUtils } from "@/features/auth/utils/cookies";
import { authService } from "@/features/auth/services/auth.service";
import type { SafeUser } from "@/features/auth/types";

/**
 * Server-side session utilities
 * Use these in Server Components and API routes
 */

export interface ServerSession {
  user: SafeUser;
  sessionId: string;
}

/**
 * Get current session from cookie
 * Returns null if not authenticated
 */
export async function getServerSession(): Promise<ServerSession | null> {
  const sessionId = await cookieUtils.getSessionCookie();
  
  if (!sessionId) {
    return null;
  }

  const result = await authService.getSession(sessionId);
  
  if (!result) {
    return null;
  }

  return {
    user: result.user,
    sessionId: result.session.id,
  };
}

/**
 * Require authentication
 * Throws error if not authenticated
 * Use in Server Components and API routes
 */
export async function requireServerAuth(): Promise<ServerSession> {
  const session = await getServerSession();
  
  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

