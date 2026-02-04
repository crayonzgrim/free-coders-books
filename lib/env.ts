import { z } from "zod";

/**
 * Environment variable validation schema
 * This ensures required env vars are present and valid at startup
 */
const envSchema = z.object({
  // Public (exposed to client)
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),

  // Auth (optional - auth features disabled if not set)
  AUTH_SECRET: z.string().min(1).optional(),
  AUTH_GITHUB_ID: z.string().min(1).optional(),
  AUTH_GITHUB_SECRET: z.string().min(1).optional(),

  // Database (optional - DB features disabled if not set)
  TURSO_DATABASE_URL: z.string().url().optional(),
  TURSO_AUTH_TOKEN: z.string().min(1).optional(),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables at runtime
 * Call this early in your application startup
 */
export function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.entries(errors)
      .map(([key, messages]) => `  ${key}: ${messages?.join(", ")}`)
      .join("\n");

    throw new Error(`Invalid environment variables:\n${errorMessages}`);
  }

  return parsed.data;
}

/**
 * Type-safe access to validated environment variables
 * Use this instead of process.env for validated vars
 */
export function getEnv(): Env {
  return envSchema.parse(process.env);
}

/**
 * Check if authentication is properly configured
 */
export function isAuthConfigured(): boolean {
  const env = getEnv();
  return !!(env.AUTH_SECRET && env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET);
}

/**
 * Check if database is properly configured
 */
export function isDatabaseConfigured(): boolean {
  const env = getEnv();
  return !!(env.TURSO_DATABASE_URL && env.TURSO_AUTH_TOKEN);
}
