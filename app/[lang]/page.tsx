import HomeClient from "./HomeClient";
import { normalizeLang, type SeoLang } from "../../I18n/seo";

const H1: Record<SeoLang, string> = {
  uz: "Hadiya Travel — O‘zbekiston va dunyo bo‘ylab sayohatlar, tibbiy turizm va viza xizmatlari",
  ru: "Hadiya Travel — туры по Узбекистану и миру, медицинский туризм и визовая поддержка",
  en: "Hadiya Travel — tours across Uzbekistan and the world, medical tourism and visa services",
};

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = normalizeLang(raw);

  return (
    <>
      <h1 className="sr-only">{H1[lang]}</h1>
      <HomeClient />
    </>
  );
}
