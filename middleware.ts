import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_LANGS = ["uz", "ru", "en"];
const DEFAULT_LANG = "uz";

function detectLang(req: NextRequest): string {
  const cookieLang = req.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLang && SUPPORTED_LANGS.includes(cookieLang)) return cookieLang;

  const accept = req.headers.get("accept-language") ?? "";
  const preferred = accept.split(",")[0]?.split("-")[0]?.toLowerCase();
  if (preferred && SUPPORTED_LANGS.includes(preferred)) return preferred;

  return DEFAULT_LANG;
}

// Til prefiksidan keyin ruxsat etilgan yo'l shakllari
function isKnownPath(rest: string): boolean {
  if (rest === "") return true; // bosh sahifa
  if (rest.startsWith("/tour/")) return true; // tur sahifalari
  if (rest.startsWith("/payment/")) return true; // to'lov sahifalari
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const langPrefix = SUPPORTED_LANGS.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );

  if (langPrefix) {
    const rest = pathname.slice(langPrefix.length + 1); // "/uz/x" -> "/x"
    if (isKnownPath(rest)) return NextResponse.next();

    // Noma'lum sahifa -> shu tildagi bosh sahifaga (haqiqiy 307)
    const url = req.nextUrl.clone();
    url.pathname = `/${langPrefix}`;
    url.search = "";
    return NextResponse.redirect(url);
  }

  const lang = detectLang(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|logo.png|robots.txt|sitemap.xml|payment/status|.*\\.(?:jpg|jpeg|png|gif|svg|webp|ico|txt|xml|docx)$).*)",
  ],
};
