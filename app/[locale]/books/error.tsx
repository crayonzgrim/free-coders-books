"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw, BookOpen } from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BooksError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      // TODO: Send to error tracking service
    }
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-16 h-16 mb-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Failed to load books</h1>

        <p className="text-muted-foreground mb-6">
          We couldn&apos;t fetch the book data. This might be a temporary issue. Please try again.
        </p>

        {process.env.NODE_ENV === "development" && error.message && (
          <pre className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left text-sm overflow-auto max-h-32">
            {error.message}
          </pre>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default" className="gap-2">
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </Button>

          <Link href="/categories">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <BookOpen className="w-4 h-4" />
              Browse Categories
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
