import uz from "./locales/uz.json";
import ru from "./locales/ru.json";
import en from "./locales/en.json";

export const SITE_URL = "https://www.hadiya-travel.uz";
export const LANGS = ["uz", "ru", "en"] as const;
export type SeoLang = (typeof LANGS)[number];

const locales: Record<SeoLang, any> = { uz, ru, en };

export function normalizeLang(l: string | undefined): SeoLang {
  return (LANGS as readonly string[]).includes(l ?? "")
    ? (l as SeoLang)
    : "uz";
}

export const SITE_TITLE: Record<SeoLang, string> = {
  uz: "Hadiya Travel – O‘zbekistonga sayohat, dunyo bo‘ylab sayohat, tibbiy turizm va turizm xizmatlari",
  ru: "Hadiya Travel – Путешествие в Узбекистан, путешествия по странам мира, медицинский туризм и туристические услуги",
  en: "Hadiya Travel – Travel to Uzbekistan, travel to world countries, medical tourism, and tourism services",
};

export const SITE_DESCRIPTION: Record<SeoLang, string> = {
  uz: "Toshkent sayyohlik agentligi, turoperator, dunyo bo‘ylab arzon sayohatlar, tibbiy turizm, viza yordami va aviachiptalar.",
  ru: "Туристическое агентство в Ташкенте, доступные туры по миру, медицинский туризм, визовая поддержка и авиабилеты.",
  en: "Tashkent travel agency, affordable world tours, medical tourism services, visa assistance, and flight tickets.",
};

export const OG_LOCALE: Record<SeoLang, string> = {
  uz: "uz_UZ",
  ru: "ru_RU",
  en: "en_US",
};

const TYPE_KEY: Record<string, string> = {
  internal: "tours",
  world: "worldtour",
  medical: "medicaltour",
};

export interface TourSeo {
  title: string;
  description: string;
  exists: boolean;
}

function clip(text: string, max = 160): string {
  const t = (text || "").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + "…" : t;
}

export function getTourSeo(
  lang: SeoLang,
  type: string,
  id: string
): TourSeo {
  const key = TYPE_KEY[type];
  const data = key ? locales[lang]?.[key]?.[id] : undefined;
  if (!data) {
    return {
      title: SITE_TITLE[lang],
      description: SITE_DESCRIPTION[lang],
      exists: false,
    };
  }
  const name = data.title || "";
  const desc = clip(data.description || data.information || data.services || "");
  return {
    title: `${name} | Hadiya Travel`,
    description: desc || SITE_DESCRIPTION[lang],
    exists: true,
  };
}

export function travelAgencySchema(lang: SeoLang) {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Hadiya Travel",
    url: `${SITE_URL}/${lang}`,
    logo: `${SITE_URL}/logo.png`,
    description: SITE_DESCRIPTION[lang],
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Tashkent city, Shaykhantakhur district, Samarkand Darvoza 6",
      addressLocality: "Tashkent",
      postalCode: "100000",
      addressCountry: "UZ",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+998 97 038 38 33",
      contactType: "customer service",
    },
    availableLanguage: [
      { "@type": "Language", name: "Uzbek", alternateName: "uz" },
      { "@type": "Language", name: "Russian", alternateName: "ru" },
      { "@type": "Language", name: "English", alternateName: "en" },
    ],
  };
}

export function tourTripSchema(
  lang: SeoLang,
  type: string,
  id: string,
  seo: TourSeo
) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: seo.title.replace(" | Hadiya Travel", ""),
    description: seo.description,
    url: `${SITE_URL}/${lang}/tour/${type}/${id}`,
    image: `${SITE_URL}/logo.png`,
    provider: {
      "@type": "TravelAgency",
      name: "Hadiya Travel",
      url: `${SITE_URL}/${lang}`,
    },
  };
}
