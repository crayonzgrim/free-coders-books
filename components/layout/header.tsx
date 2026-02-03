"use client";

// import { UserMenu } from "@/components/auth/user-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, Mail, Menu, Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

const CONTACT_EMAIL = "crayonzgrim@gmail.com";

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = CONTACT_EMAIL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/books", label: t("books") },
    { href: "/categories", label: t("categories") },
    { href: "/guides", label: t("guides") },
    { href: "/mind-books", label: t("mindBooks") },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-orange-400 to-amber-400 rounded-lg blur opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative bg-linear-to-r from-orange-500 to-amber-500 p-2 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-bold text-lg leading-tight bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Free Coders Books
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5" />
              10,000+ Free Resources
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                isActive(item.href)
                  ? "bg-gray-100 dark:bg-gray-800 text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-800/50"
              )}
            // style={{ border: '2px dashed red' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LanguageSwitcher />
          {/* Feedback Email Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyEmail}
                  className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  <span className="hidden lg:inline">
                    {copied ? t("feedback.copied") : t("feedback.label")}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[200px] text-center">
                <p>{t("feedback.tooltip")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* <div className="hidden sm:block">
            <UserMenu />
          </div> */}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-background">
          <nav className="container mx-auto flex flex-col py-4 px-4 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive(item.href)
                    ? "bg-gray-100 dark:bg-gray-800 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-800/50"
                )}
              >
                {item.label}
              </Link>
            ))}
            {/* Feedback Email - Mobile */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-800 mt-2">
              <Button
                variant="ghost"
                onClick={copyEmail}
                className="w-full justify-start gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                {copied ? t("feedback.copied") : t("feedback.mobile")}
              </Button>
            </div>
            {/* <div className="pt-2 border-t border-gray-200 dark:border-gray-800 mt-2">
              <UserMenu />
            </div> */}
          </nav>
        </div>
      )}
    </header>
  );
}
