// fpb.json structure types (actual structure)
export interface FpbEntry {
  url: string;
  title: string;
  author?: string;
  notes?: string[];
}

export interface FpbSubsection {
  section: string;
  entries: FpbEntry[];
  subsections?: FpbSubsection[];
}

export interface FpbSection {
  section: string;
  entries: FpbEntry[];
  subsections?: FpbSubsection[];
}

export interface FpbLanguageData {
  language: {
    code: string;
    name: string;
  };
  index: Record<string, unknown>;
  sections: FpbSection[];
}

export interface FpbBooksNode {
  type: "books";
  index: Record<string, unknown>;
  children: FpbLanguageData[];
}

export interface FpbData {
  type: "root";
  children: FpbBooksNode[];
}

// Normalized book type for our application
export interface Book {
  url: string; // Unique identifier
  title: string;
  author?: string;
  notes?: string[];
  category: string; // Section name
  subcategory?: string; // Subsection name
  languageCode: string;
  languageName: string;
}

// Category for listing
export interface Category {
  slug: string;
  name: string;
  bookCount: number;
}

// Language for filtering
export interface Language {
  code: string;
  name: string;
  bookCount: number;
}
