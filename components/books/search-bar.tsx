"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  size?: "default" | "lg";
  className?: string;
}

export function SearchBar({ size = "default", className }: SearchBarProps) {
  const t = useTranslations("common");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/books?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const isLarge = size === "lg";

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div
        className={cn(
          "relative flex gap-2 p-1.5 rounded-2xl transition-all",
          isFocused
            ? "bg-white dark:bg-card shadow-warm-lg ring-2 ring-orange-200 dark:ring-orange-800"
            : "bg-white/80 dark:bg-card/80 shadow-warm",
          isLarge && "p-2"
        )}
      >
        <div className="relative flex-1">
          <Search
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 text-orange-400",
              isLarge ? "h-5 w-5 left-4" : "h-4 w-4"
            )}
          />
          <input
            type="search"
            placeholder={t("searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground",
              isLarge ? "h-12 pl-12 pr-4 text-lg" : "h-9 pl-10 pr-4 text-sm"
            )}
          />
        </div>
        <Button
          type="submit"
          size={isLarge ? "lg" : "default"}
          className={cn(
            "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-none",
            isLarge ? "h-12 px-6 rounded-xl" : "h-9 px-4 rounded-lg"
          )}
        >
          <Sparkles className={cn("mr-1.5", isLarge ? "h-4 w-4" : "h-3.5 w-3.5")} />
          {t("search")}
        </Button>
      </div>
    </form>
  );
}
