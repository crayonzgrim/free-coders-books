"use client";

import { Link } from "@/lib/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, ArrowRight } from "lucide-react";

// Language data with native names and codes
const LANGUAGES = [
  { code: "en", name: "English", native: "English", flag: "🇺🇸" },
  { code: "ar", name: "Arabic", native: "العربية", flag: "🇸🇦" },
  { code: "hy", name: "Armenian", native: "Հայերdelays", flag: "🇦🇲" },
  { code: "az", name: "Azerbaijani", native: "Azərbaycan", flag: "🇦🇿" },
  { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇧🇩" },
  { code: "bg", name: "Bulgarian", native: "Български", flag: "🇧🇬" },
  { code: "my", name: "Burmese", native: "မြန်မာဘာသာ", flag: "🇲🇲" },
  { code: "zh", name: "Chinese", native: "中文", flag: "🇨🇳" },
  { code: "cs", name: "Czech", native: "Čeština", flag: "🇨🇿" },
  { code: "ca", name: "Catalan", native: "Català", flag: "🏴" },
  { code: "da", name: "Danish", native: "Dansk", flag: "🇩🇰" },
  { code: "nl", name: "Dutch", native: "Nederlands", flag: "🇳🇱" },
  { code: "et", name: "Estonian", native: "Eesti", flag: "🇪🇪" },
  { code: "fi", name: "Finnish", native: "Suomi", flag: "🇫🇮" },
  { code: "fr", name: "French", native: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", native: "Deutsch", flag: "🇩🇪" },
  { code: "el", name: "Greek", native: "Ελληνικά", flag: "🇬🇷" },
  { code: "he", name: "Hebrew", native: "עברית", flag: "🇮🇱" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "hu", name: "Hungarian", native: "Magyar", flag: "🇭🇺" },
  { code: "id", name: "Indonesian", native: "Indonesia", flag: "🇮🇩" },
  { code: "it", name: "Italian", native: "Italiano", flag: "🇮🇹" },
  { code: "ja", name: "Japanese", native: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", native: "한국어", flag: "🇰🇷" },
  { code: "lv", name: "Latvian", native: "Latviešu", flag: "🇱🇻" },
  { code: "ml", name: "Malayalam", native: "മലയാളം", flag: "🇮🇳" },
  { code: "no", name: "Norwegian", native: "Norsk", flag: "🇳🇴" },
  { code: "fa_IR", name: "Persian", native: "فارسی", flag: "🇮🇷" },
  { code: "pl", name: "Polish", native: "Polski", flag: "🇵🇱" },
  { code: "pt_BR", name: "Portuguese (BR)", native: "Português", flag: "🇧🇷" },
  { code: "pt_PT", name: "Portuguese (PT)", native: "Português", flag: "🇵🇹" },
  { code: "ro", name: "Romanian", native: "Română", flag: "🇷🇴" },
  { code: "ru", name: "Russian", native: "Русский", flag: "🇷🇺" },
  { code: "sr", name: "Serbian", native: "Српски", flag: "🇷🇸" },
  { code: "sk", name: "Slovak", native: "Slovenčina", flag: "🇸🇰" },
  { code: "sl", name: "Slovenian", native: "Slovenščina", flag: "🇸🇮" },
  { code: "es", name: "Spanish", native: "Español", flag: "🇪🇸" },
  { code: "sv", name: "Swedish", native: "Svenska", flag: "🇸🇪" },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "th", name: "Thai", native: "ไทย", flag: "🇹🇭" },
  { code: "tr", name: "Turkish", native: "Türkçe", flag: "🇹🇷" },
  { code: "uk", name: "Ukrainian", native: "Українська", flag: "🇺🇦" },
  { code: "ur", name: "Urdu", native: "اردو", flag: "🇵🇰" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt", flag: "🇻🇳" },
];

interface LanguageSelectorProps {
  title: string;
  subtitle: string;
}

export function LanguageSelector({ title, subtitle }: LanguageSelectorProps) {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-orange-50/50 to-transparent dark:from-orange-950/20 dark:to-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 mb-4">
            <Globe className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {LANGUAGES.map((lang) => (
            <Link
              key={lang.code}
              href={`/books?lang=${lang.code}`}
              className="group"
            >
              <Card className="h-full border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition-all duration-200">
                <CardContent className="p-4 flex items-center gap-3">
                  <span className="text-2xl" role="img" aria-label={lang.name}>
                    {lang.flag}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {lang.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {lang.native}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-orange-500 transition-all" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
