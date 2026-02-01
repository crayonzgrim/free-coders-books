// Re-export book types
export type {
  Book,
  Category,
  Language,
  FpbData,
  FpbLanguageData,
  FpbBooksNode,
  FpbSection,
  FpbSubsection,
  FpbEntry,
} from "@/lib/books/types";

// Re-export database types
export type {
  User,
  NewUser,
  Bookmark,
  NewBookmark,
  Like,
  NewLike,
  LikeCount,
  Visit,
} from "@/lib/db/schema";
