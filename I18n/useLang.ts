"use client";

import { usePathname } from "next/navigation";
import { SUPPORTED_LANGS, DEFAULT_LANG, type Lang } from "./I18nProvider";

export function useLang(): Lang {
  const pathname = usePathname();
  const seg = pathname?.split("/")[1];
  return (SUPPORTED_LANGS as readonly string[]).includes(seg ?? "")
    ? (seg as Lang)
    : DEFAULT_LANG;
}
