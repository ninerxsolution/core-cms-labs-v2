import { prisma } from "@/lib/prisma";
import type { User, Session } from "@prisma/client";

/**
 * Auth Repository
 * Handles all database operations for authentication
 */

export const authRepository = {
  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  /**
   * Create a new session
   */
  async createSession(
    userId: string,
    expiresAt: Date
  ): Promise<Session> {
    return prisma.session.create({
      data: {
        userId,
        expiresAt,
      },
    });
  },

  /**
   * Get session by ID (with user relation)
   */
  async getSession(sessionId: string): Promise<(Session & { user: User }) | null> {
    return prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: true,
      },
    });
  },

  /**
   * Delete session by ID
   */
  async deleteSession(sessionId: string): Promise<void> {
    await prisma.session.delete({
      where: { id: sessionId },
    });
  },

  /**
   * Delete all sessions for a user
   */
  async deleteAllUserSessions(userId: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { userId },
    });
  },

  /**
   * Get all sessions for a user
   */
  async getUserSessions(userId: string): Promise<Session[]> {
    return prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Get all sessions (admin only)
   */
  async getAllSessions(): Promise<(Session & { user: User })[]> {
    return prisma.session.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    return result.count;
  },
};

