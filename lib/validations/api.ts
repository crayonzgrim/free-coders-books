import { z } from "zod";

/**
 * Bookmark API validation schemas
 */
export const createBookmarkSchema = z.object({
  bookUrl: z.string().url("Invalid book URL"),
  bookTitle: z.string().min(1, "Book title is required").max(500, "Book title too long"),
});

export const deleteBookmarkSchema = z.object({
  bookUrl: z.string().url("Invalid book URL"),
});

/**
 * Like API validation schemas
 */
export const toggleLikeSchema = z.object({
  bookUrl: z.string().url("Invalid book URL"),
});

export const getLikeCountsSchema = z.object({
  bookUrls: z.string().min(1, "At least one book URL is required"),
});

/**
 * Books API validation schemas
 */
export const getBooksQuerySchema = z.object({
  search: z.string().max(200).optional().default(""),
  category: z.string().max(100).optional().default(""),
  language: z.string().max(50).optional().default(""),
  page: z.coerce.number().int().min(1).optional().default(1),
  perPage: z.coerce.number().int().min(1).max(100).optional().default(24),
});

/**
 * Helper to validate request body
 */
export async function validateBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const errorMessage = Object.entries(errors)
        .map(([key, messages]) => `${key}: ${(messages as string[] | undefined)?.join(", ")}`)
        .join("; ");
      return { success: false, error: errorMessage };
    }

    return { success: true, data: result.data };
  } catch {
    return { success: false, error: "Invalid JSON body" };
  }
}

/**
 * Helper to validate query parameters
 */
export function validateQuery<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } {
  const params = Object.fromEntries(searchParams.entries());
  const result = schema.safeParse(params);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const errorMessage = Object.entries(errors)
      .map(([key, messages]) => `${key}: ${(messages as string[] | undefined)?.join(", ")}`)
      .join("; ");
    return { success: false, error: errorMessage };
  }

  return { success: true, data: result.data };
}
