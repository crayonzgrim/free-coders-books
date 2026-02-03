import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/lib/i18n/config";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { KakaoAdFit } from "@/components/ui/kakao-adfit";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <div className="flex min-h-screen flex-col">
          <Header />
          {/* Desktop Ad (728x90) */}
          <div className="hidden justify-center py-2 md:flex">
            <KakaoAdFit unit="DAN-dUc48ftR9jSgaIoa" width={728} height={90} />
          </div>
          {/* Mobile Ad (320x50) */}
          <div className="flex justify-center py-2 md:hidden">
            <KakaoAdFit unit="DAN-AV7388BjD8F7UVCc" width={320} height={50} />
          </div>
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}
