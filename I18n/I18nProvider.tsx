"use client";

import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

export const SUPPORTED_LANGS = ["uz", "ru", "en"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: Lang = "uz";

export function I18nProvider({
  lang,
  children,
}: {
  lang: string;
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(i18n.language === lang);

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang).then(() => setReady(true));
    } else {
      setReady(true);
    }
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;
  }, [lang]);

  if (!ready) return null;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
