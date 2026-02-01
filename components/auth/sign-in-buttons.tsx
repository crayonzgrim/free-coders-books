"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export function SignInButtons() {
  const t = useTranslations("auth");

  return (
    <div className="flex flex-col gap-3 w-full">
      <Button
        variant="outline"
        onClick={() => signIn("github", { callbackUrl: "/" })}
        className="w-full h-12"
      >
        <Github className="h-5 w-5" />
        {t("continueWithGitHub")}
      </Button>
    </div>
  );
}
