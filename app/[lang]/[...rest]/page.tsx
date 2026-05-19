import { redirect } from "next/navigation";
import { normalizeLang } from "@/I18n/seo";

export const dynamic = "force-dynamic";

export default async function CatchAll({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  redirect(`/${normalizeLang(raw)}`);
}
