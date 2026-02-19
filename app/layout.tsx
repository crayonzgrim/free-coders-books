import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import {
  WebsiteJsonLd,
  WebApplicationJsonLd,
  OrganizationJsonLd,
} from "@/components/seo/json-ld";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://free-coders-books.vercel.app";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | Free Coders Books",
    default: "Free Coders Books - 무료 프로그래밍 도서 | Free Programming Resources",
  },
  description:
    "Discover thousands of free programming books, courses, and resources in 50+ languages. 수천 권의 무료 프로그래밍 도서를 찾아보세요. Built for developers, by the community.",
  keywords: [
    "programming books",
    "free books",
    "coding resources",
    "learn programming",
    "developer resources",
    "free ebooks",
    "coding tutorials",
    "software development",
    "무료 프로그래밍 책",
    "프로그래밍 도서",
    "코딩 자료",
    "개발자 리소스",
    "libros de programación gratis",
    "recursos de desarrollo",
  ],
  authors: [
    { name: "Free Coders Books Community" },
    { name: "EbookFoundation", url: "https://github.com/EbookFoundation" },
  ],
  creator: "Free Coders Books",
  publisher: "Free Coders Books",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ko_KR", "es_ES"],
    url: siteUrl,
    siteName: "Free Coders Books",
    title: "Free Coders Books - Free Programming Resources",
    description:
      "Discover thousands of free programming books, courses, and resources in 50+ languages. Built for developers, by the community.",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Coders Books - Free Programming Resources",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Coders Books - Free Programming Resources",
    description:
      "Discover thousands of free programming books in 50+ languages. Built for developers, by the community.",
    images: [`${siteUrl}/opengraph-image`],
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      en: `${siteUrl}/en`,
      ko: `${siteUrl}/ko`,
      es: `${siteUrl}/es`,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  verification: {
    // Add your verification codes here after deployment
    // google: "your-google-verification-code",
    // other: {
    //   "naver-site-verification": "your-naver-verification-code",
    // },
  },
  category: "Education",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <WebsiteJsonLd />
        <WebApplicationJsonLd />
        <OrganizationJsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="fcb-theme"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
