/**
 * Admin Configuration
 * Reads ADMIN_BASE_PATH from environment variables
 */

export const ADMIN_CONFIG = {
  BASE_PATH: process.env.ADMIN_BASE_PATH || "admin",
} as const;

/**
 * Get admin base path with validation
 * @returns Admin base path (default: "admin")
 */
export function getAdminBasePath(): string {
  const path = ADMIN_CONFIG.BASE_PATH;

  // Security: Only allow alphanumeric and hyphens
  if (!/^[a-z0-9-]+$/.test(path)) {
    throw new Error(
      "ADMIN_BASE_PATH must contain only lowercase letters, numbers, and hyphens"
    );
  }

  return path;
}

/**
 * Get admin route path
 * @param path - Additional path segments
 * @returns Full admin route path
 */
export function getAdminPath(...path: string[]): string {
  const basePath = getAdminBasePath();
  const segments = [basePath, ...path].filter(Boolean);
  return `/${segments.join("/")}`;
}

