import type { Metadata } from "next";
import "../globals.css";
import Shell from "./Shell";
import {
  SITE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
  OG_LOCALE,
  LANGS,
  normalizeLang,
  travelAgencySchema,
} from "../../I18n/seo";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = normalizeLang(raw);

  return {
    metadataBase: new URL(SITE_URL),
    title: SITE_TITLE[lang],
    description: SITE_DESCRIPTION[lang],
    icons: { icon: "/logo.png", shortcut: "/logo.png" },
    alternates: {
      canonical: `/${lang}`,
      languages: {
        uz: "/uz",
        ru: "/ru",
        en: "/en",
        "x-default": "/uz",
      },
    },
    openGraph: {
      title: SITE_TITLE[lang],
      description: SITE_DESCRIPTION[lang],
      url: `${SITE_URL}/${lang}`,
      siteName: "Hadiya Travel",
      type: "website",
      locale: OG_LOCALE[lang],
      images: [{ url: "/logo.png", alt: "Hadiya Travel Logo" }],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE[lang],
      description: SITE_DESCRIPTION[lang],
      images: ["/logo.png"],
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = normalizeLang(raw);

  return (
    <html lang={lang}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(travelAgencySchema(lang)),
          }}
        />
        <Shell lang={lang}>{children}</Shell>
      </body>
    </html>
  );
}
