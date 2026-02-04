"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-gray-950">
          <div className="text-center max-w-md">
            <div className="mx-auto w-20 h-20 mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>

            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              Critical Error
            </h1>

            <p className="text-gray-600 mb-6">
              A critical error occurred. Please refresh the page or try again later.
            </p>

            {process.env.NODE_ENV === "development" && error.message && (
              <pre className="mb-6 p-4 bg-gray-100 rounded-lg text-left text-sm overflow-auto max-h-40 text-gray-800">
                {error.message}
              </pre>
            )}

            <Button
              onClick={reset}
              className="gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
