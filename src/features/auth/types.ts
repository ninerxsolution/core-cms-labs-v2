import type { User, Session } from "@prisma/client";

/**
 * User type (without passwordHash)
 */
export interface SafeUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Session with user
 */
export interface SessionWithUser extends Session {
  user: User;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Login response
 */
export interface LoginResponse {
  user: SafeUser;
  session: Session;
}

