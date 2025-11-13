import { authRepository } from "../repositories/auth.repository";

/**
 * Auth Admin Service
 * Handles admin operations for session management
 */

export const authAdminService = {
  /**
   * Revoke a specific session
   */
  async revokeSession(sessionId: string): Promise<void> {
    await authRepository.deleteSession(sessionId);
  },

  /**
   * Revoke all sessions for a user
   */
  async revokeAllUserSessions(userId: string): Promise<void> {
    await authRepository.deleteAllUserSessions(userId);
  },

  /**
   * Get all sessions for a user
   */
  async getUserSessions(userId: string) {
    return authRepository.getUserSessions(userId);
  },

  /**
   * Get all sessions (admin only)
   */
  async getAllSessions() {
    return authRepository.getAllSessions();
  },

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    return authRepository.cleanupExpiredSessions();
  },
};

