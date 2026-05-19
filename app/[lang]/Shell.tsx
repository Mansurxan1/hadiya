"use client";

import { I18nProvider } from "../../I18n/I18nProvider";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Shell({
  lang,
  children,
}: {
  lang: string;
  children: React.ReactNode;
}) {
  return (
    <I18nProvider lang={lang}>
      <Navbar />
      {children}
      <Footer />
    </I18nProvider>
  );
}
