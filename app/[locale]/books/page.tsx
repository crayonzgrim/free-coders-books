import { Suspense } from "react";
import { Metadata } from "next";
import { BooksContent } from "./books-content";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Browse Free Programming Books",
  description:
    "Search and filter thousands of free programming books, tutorials, and resources across 50+ languages and 330+ categories.",
  openGraph: {
    title: "Browse Free Programming Books | Free Coders Books",
    description:
      "Search and filter thousands of free programming books, tutorials, and resources across 50+ languages and 330+ categories.",
  },
};

function BooksLoading() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-linear-to-r from-orange-500 to-amber-500">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="h-6 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<BooksLoading />}>
      <BooksContent />
    </Suspense>
  );
}
