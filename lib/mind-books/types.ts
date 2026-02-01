// Mind-Expanding Books types

export interface MindBook {
  title: string;
  author: string;
  goodreadsRating: number;
  goodreadsUrl: string;
  yearPublished: number;
  category: string;
  categorySlug: string;
}

export interface MindBookCategory {
  name: string;
  slug: string;
  books: MindBook[];
}

export interface MindBooksData {
  categories: MindBookCategory[];
  totalBooks: number;
}
