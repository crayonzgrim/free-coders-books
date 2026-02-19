"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { BookOpen, Github, Heart, ExternalLink, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface VisitStats {
  today: number;
  total: number;
}

export function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();
  const [stats, setStats] = useState<VisitStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Increment visit count
        await fetch("/api/visits", { method: "POST" });

        // Fetch stats
        const res = await fetch("/api/visits");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        // Silent fail - stats are optional
      }
    };

    fetchStats();
  }, []);

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-linear-to-r from-orange-500 to-amber-500 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Free Coders Books
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t("description")}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t("dataSource")}</span>
              <a
                href="https://github.com/EbookFoundation/free-programming-books"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-orange-600 dark:text-orange-400 hover:underline font-medium"
              >
                {t("freeBooks")}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Visitor Stats */}
            {stats && (
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-orange-500" />
                  <span className="text-muted-foreground">
                    Today: <span className="font-medium text-foreground">{stats.today}</span>
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Total: <span className="font-medium text-foreground">{stats.total}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-orange-700 dark:text-orange-400">
              {t("links")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/books"
                  className="text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  Books
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* GitHub */}
          <div>
            <h3 className="font-semibold mb-4 text-orange-700 dark:text-orange-400">
              Open Source
            </h3>
            <a
              href="https://github.com/EbookFoundation/free-programming-books"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-gray-800 text-white text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>Star on GitHub</span>
            </a>
            <p className="mt-3 text-xs text-muted-foreground">
              300k+ stars on GitHub
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {t("copyright", { year: currentYear })}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with{" "}
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />{" "}
            for developers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
