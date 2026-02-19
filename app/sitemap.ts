import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getAllCategories, getAllLanguages } from "@/lib/books/fetch-books";
import { getAllGuides } from "@/lib/guides";
import { getAllArticles } from "@/lib/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://free-coders-books.vercel.app";

  const lastModified = new Date();

  // Static pages for each locale
  const staticPages = locales.flatMap((locale) => [
    {
      url: `${siteUrl}/${locale}`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/${locale}/books`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/${locale}/categories`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/${locale}/mind-books`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ]);

  // Dynamic category pages
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const categories = await getAllCategories();
    categoryPages = locales.flatMap((locale) =>
      categories.slice(0, 100).map((category) => ({
        url: `${siteUrl}/${locale}/categories/${category.slug}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    );
  } catch {
    // Silent fail - sitemap will work without categories
  }

  // Dynamic language filter pages
  let languagePages: MetadataRoute.Sitemap = [];
  try {
    const languages = await getAllLanguages();
    languagePages = locales.flatMap((locale) =>
      languages.slice(0, 50).map((lang) => ({
        url: `${siteUrl}/${locale}/books?language=${lang.code}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
    );
  } catch {
    // Silent fail - sitemap will work without languages
  }

  // Guide pages
  let guidePages: MetadataRoute.Sitemap = [];
  try {
    const guides = await getAllGuides();
    guidePages = locales.flatMap((locale) =>
      guides.map((guide) => ({
        url: `${siteUrl}/${locale}/guides/${guide.slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }))
    );
  } catch {
    // Silent fail
  }

  // Article pages
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const articles = await getAllArticles();
    articlePages = locales.flatMap((locale) =>
      articles.map((article) => ({
        url: `${siteUrl}/${locale}/articles/${article.slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }))
    );
  } catch {
    // Silent fail
  }

  // Guides and articles listing pages
  const contentListingPages = locales.flatMap((locale) => [
    {
      url: `${siteUrl}/${locale}/guides`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/${locale}/articles`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ]);

  return [
    ...staticPages,
    ...contentListingPages,
    ...categoryPages,
    ...guidePages,
    ...articlePages,
    ...languagePages,
  ];
}
