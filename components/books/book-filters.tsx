"use client";

import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
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

  const hasFilters = search || category || language;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={tCommon("searchPlaceholder")}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
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
