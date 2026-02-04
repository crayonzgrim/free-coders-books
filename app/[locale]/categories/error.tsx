"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CategoriesError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      // TODO: Send to error tracking service
    }
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-16 h-16 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Failed to load categories</h1>

        <p className="text-muted-foreground mb-6">
          We couldn&apos;t load the category data. Please try again or return to the home page.
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

          <Link href="/">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
