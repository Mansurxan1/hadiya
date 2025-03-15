"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import "./globals.css";
import "../I18n/i18n";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState("uz");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("lang") || "uz";
      i18n.changeLanguage(storedLang);
      setLang(storedLang);
    }
  }, [i18n]);

  const titles: Record<string, string> = {
    uz: "Hadiya Travel – O‘zbekistonga sayohat, dunyo mamlakatlariga sayohat, tibbiy turizm va turizm xizmatlari",
    ru: "Hadiya Travel – Путешествие в Узбекистан, путешествия по странам мира, медицинский туризм и туристические услуги",
    en: "Hadiya Travel – Travel to Uzbekistan, travel to world countries, medical tourism, and tourism services",
  };

  const descriptions: Record<string, string> = {
    uz: "Toshkent sayyohlik agentligi, turoperator, dunyo bo‘ylab arzon sayohatlar, tibbiy turizm, viza yordami va aviachiptalar.",
    ru: "Туристическое агентство в Ташкенте, доступные туры по миру, медицинский туризм, визовая поддержка и авиабилеты.",
    en: "Tashkent travel agency, affordable world tours, medical tourism services, visa assistance, and flight tickets.",
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Hadiya Travel",
    "url": "https://hadiya-travel.uz",
    "logo": "https://hadiya-travel.uz/favicon.ico",
    "description": descriptions[lang],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Tashkent city, Shaykhantakhur district, Samarkand Darvoza 6",
      "addressLocality": "Tashkent",
      "postalCode": "100000",
      "addressCountry": "UZ",
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+998 97 038 38 33",
      "contactType": "customer service",
    },
    "availableLanguage": [
      { "@type": "Language", "name": "Uzbek", "alternateName": "uz" },
      { "@type": "Language", "name": "Russian", "alternateName": "ru" },
      { "@type": "Language", "name": "English", "alternateName": "en" },
    ],
  };

  return (
    <html lang={lang}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />

        <title>{titles[lang]}</title>
        <meta name="description" content={descriptions[lang]} />
        
        <meta property="og:title" content={titles[lang]} />
        <meta property="og:description" content={descriptions[lang]} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hadiya-travel.uz" />
        <meta property="og:image" content="https://hadiya-travel.uz/logo.png" />
        <meta property="og:image:alt" content="Hadiya Travel Logo" />
        <meta property="og:site_name" content="Hadiya Travel" />
        <meta property="og:locale" content={lang === "ru" ? "ru_RU" : lang === "en" ? "en_US" : "uz_UZ"} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={titles[lang]} />
        <meta name="twitter:description" content={descriptions[lang]} />
        <meta name="twitter:image" content="https://hadiya-travel.uz/logo.png" />
        <meta name="twitter:image:alt" content="Hadiya Travel Logo" />

        <link rel="canonical" href="https://hadiya-travel.uz" />
        <link rel="alternate" hrefLang="uz" href="https://hadiya-travel.uz" />
        <link rel="alternate" hrefLang="ru" href="https://hadiya-travel.uz" />
        <link rel="alternate" hrefLang="en" href="https://hadiya-travel.uz" />
        <link rel="alternate" hrefLang="x-default" href="https://hadiya-travel.uz" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}