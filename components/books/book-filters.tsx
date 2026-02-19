"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Search, X, Layers, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

interface BookFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  language: string;
  onLanguageChange: (value: string) => void;
  categories: { value: string; label: string }[];
  languages: { value: string; label: string }[];
  onClearFilters: () => void;
}

export function BookFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  language,
  onLanguageChange,
  categories,
  languages,
  onClearFilters,
}: BookFiltersProps) {
  const t = useTranslations("books");
  const tCommon = useTranslations("common");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const hasFilters = search || category || language;

  // Filter suggestions based on search input
  const suggestions = useMemo(() => {
    if (!search || search.length < 2) return { categories: [], languages: [] };
    const query = search.toLowerCase();
    return {
      categories: categories.filter((c) => c.value.includes(query) || c.label.toLowerCase().includes(query)).slice(0, 5),
      languages: languages.filter((l) => l.label.toLowerCase().includes(query)).slice(0, 3),
    };
  }, [search, categories, languages]);

  const hasSuggestions = suggestions.categories.length > 0 || suggestions.languages.length > 0;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-4">
      {/* Search with autocomplete */}
      <div className="relative" ref={wrapperRef}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={tCommon("searchPlaceholder")}
          value={search}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className="pl-10"
        />

        {/* Suggestions dropdown */}
        {showSuggestions && hasSuggestions && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-popover shadow-lg overflow-hidden">
            {suggestions.categories.length > 0 && (
              <div className="p-2">
                <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {tCommon("allCategories").replace("All ", "")}
                </p>
                {suggestions.categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent text-left transition-colors"
                    onClick={() => {
                      onCategoryChange(cat.value);
                      onSearchChange("");
                      setShowSuggestions(false);
                    }}
                  >
                    <Layers className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            )}
            {suggestions.languages.length > 0 && (
              <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {tCommon("allLanguages").replace("All ", "")}
                </p>
                {suggestions.languages.map((lang) => (
                  <button
                    key={lang.value}
                    type="button"
                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent text-left transition-colors"
                    onClick={() => {
                      onLanguageChange(lang.value);
                      onSearchChange("");
                      setShowSuggestions(false);
                    }}
                  >
                    <Globe className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="w-full sm:w-auto sm:min-w-[180px]">
          <Select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            options={[{ value: "", label: tCommon("allCategories") }, ...categories]}
          />
        </div>

        <div className="w-full sm:w-auto sm:min-w-[140px]">
          <Select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            options={[{ value: "", label: tCommon("allLanguages") }, ...languages]}
          />
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-1" />
            {t("clearFilters")}
          </Button>
        )}
      </div>
    </div>
  );
}
