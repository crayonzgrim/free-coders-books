interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteJsonLd() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://free-coders-books.vercel.app";

  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Free Coders Books",
    alternateName: ["무료 프로그래밍 도서", "Libros de Programación Gratis"],
    url: siteUrl,
    description:
      "Discover thousands of free programming books, courses, and resources in multiple languages. Built for developers, by the community.",
    inLanguage: ["en", "ko", "es"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/en/books?query={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={data} />;
}

export function WebApplicationJsonLd() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://free-coders-books.vercel.app";

  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Free Coders Books",
    url: siteUrl,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free programming books discovery platform with thousands of resources in 50+ languages.",
    inLanguage: ["en", "ko", "es"],
    author: {
      "@type": "Organization",
      name: "Free Coders Books Community",
      url: siteUrl,
    },
  };

  return <JsonLd data={data} />;
}

export function OrganizationJsonLd() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://free-coders-books.vercel.app";

  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Free Coders Books",
    url: siteUrl,
    logo: `${siteUrl}/favicon.png`,
    sameAs: [
      "https://github.com/EbookFoundation/free-programming-books",
      "https://github.com/hackerkid/Mind-Expanding-Books",
    ],
    description:
      "Community-driven platform for discovering free programming books and mind-expanding literature.",
  };

  return <JsonLd data={data} />;
}

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

interface BookListJsonLdProps {
  name: string;
  description: string;
  numberOfItems: number;
  url: string;
}

export function BookListJsonLd({
  name,
  description,
  numberOfItems,
  url,
}: BookListJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    numberOfItems,
    url,
    itemListOrder: "https://schema.org/ItemListUnordered",
  };

  return <JsonLd data={data} />;
}
