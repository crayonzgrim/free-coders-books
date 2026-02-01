import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/lib/i18n/config";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

export const config = {
  matcher: [
    // Match all pathnames except:
    // - API routes (/api/...)
    // - Static files (/_next/..., /favicon.ico, etc.)
    // - Public files (/images/..., etc.)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
