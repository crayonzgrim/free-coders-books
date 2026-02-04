import { describe, it, expect } from "vitest";
import {
  createBookmarkSchema,
  toggleLikeSchema,
  getBooksQuerySchema,
} from "../validations/api";

describe("createBookmarkSchema", () => {
  it("should validate correct bookmark data", () => {
    const result = createBookmarkSchema.safeParse({
      bookUrl: "https://example.com/book",
      bookTitle: "Test Book",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid URL", () => {
    const result = createBookmarkSchema.safeParse({
      bookUrl: "not-a-url",
      bookTitle: "Test Book",
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty title", () => {
    const result = createBookmarkSchema.safeParse({
      bookUrl: "https://example.com/book",
      bookTitle: "",
    });
    expect(result.success).toBe(false);
  });

  it("should reject title too long", () => {
    const result = createBookmarkSchema.safeParse({
      bookUrl: "https://example.com/book",
      bookTitle: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing fields", () => {
    const result = createBookmarkSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("toggleLikeSchema", () => {
  it("should validate correct like data", () => {
    const result = toggleLikeSchema.safeParse({
      bookUrl: "https://example.com/book",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid URL", () => {
    const result = toggleLikeSchema.safeParse({
      bookUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing bookUrl", () => {
    const result = toggleLikeSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("getBooksQuerySchema", () => {
  it("should use defaults when no params provided", () => {
    const result = getBooksQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.perPage).toBe(24);
      expect(result.data.search).toBe("");
    }
  });

  it("should parse valid query params", () => {
    const result = getBooksQuerySchema.safeParse({
      search: "javascript",
      category: "web",
      language: "en",
      page: "2",
      perPage: "50",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.perPage).toBe(50);
      expect(result.data.search).toBe("javascript");
    }
  });

  it("should reject page less than 1", () => {
    const result = getBooksQuerySchema.safeParse({
      page: "0",
    });
    expect(result.success).toBe(false);
  });

  it("should reject perPage over 100", () => {
    const result = getBooksQuerySchema.safeParse({
      perPage: "101",
    });
    expect(result.success).toBe(false);
  });

  it("should reject search over 200 chars", () => {
    const result = getBooksQuerySchema.safeParse({
      search: "a".repeat(201),
    });
    expect(result.success).toBe(false);
  });
});
