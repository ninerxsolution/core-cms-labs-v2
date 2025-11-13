import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "sessionId";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Cookie utilities for session management
 */

export const cookieUtils = {
  /**
   * Get session ID from cookie
   */
  async getSessionCookie(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  },

  /**
   * Set session cookie
   */
  async setSessionCookie(sessionId: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
  },

  /**
   * Delete session cookie
   */
  async deleteSessionCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  },
};

