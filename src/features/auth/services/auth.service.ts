import bcrypt from "bcryptjs";
import { authRepository } from "../repositories/auth.repository";
import type { LoginCredentials, LoginResponse, SafeUser } from "../types";

/**
 * Auth Service
 * Handles authentication business logic
 */

export const authService = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { email, password } = credentials;

    // Find user by email
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check if user has password (some users might not have password set)
    if (!user.passwordHash) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Create session (7 days expiration)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = await authRepository.createSession(user.id, expiresAt);

    // Return safe user (without passwordHash)
    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      user: safeUser,
      session,
    };
  },

  /**
   * Logout user (delete session)
   */
  async logout(sessionId: string): Promise<void> {
    await authRepository.deleteSession(sessionId);
  },

  /**
   * Get current session
   */
  async getSession(sessionId: string) {
    const session = await authRepository.getSession(sessionId);
    
    if (!session) {
      return null;
    }

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      // Clean up expired session
      await authRepository.deleteSession(sessionId);
      return null;
    }

    // Return safe user
    const safeUser: SafeUser = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      createdAt: session.user.createdAt,
      updatedAt: session.user.updatedAt,
    };

    return {
      session,
      user: safeUser,
    };
  },
};

