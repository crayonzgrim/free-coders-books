"use client";

import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { User, LogOut, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export function UserMenu() {
  const { data: session, status } = useSession();
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <Button variant="ghost" size="icon" disabled>
        <User className="h-5 w-5" />
      </Button>
    );
  }

  if (!session) {
    return (
      <Link href="/auth/signin">
        <Button variant="outline" size="sm">
          {t("signIn")}
        </Button>
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full"
      >
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <User className="h-5 w-5" />
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-md border bg-card shadow-lg z-50">
          <div className="px-4 py-3 border-b">
            <p className="font-medium truncate">{session.user?.name}</p>
            <p className="text-sm text-muted-foreground truncate">
              {session.user?.email}
            </p>
          </div>

          <div className="py-1">
            <Link
              href="/bookmarks"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
            >
              <Bookmark className="h-4 w-4" />
              {t("bookmarks")}
            </Link>

            <button
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors text-destructive"
            >
              <LogOut className="h-4 w-4" />
              {t("signOut")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
