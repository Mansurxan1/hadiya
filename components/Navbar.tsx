"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ChevronDown, Phone } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "uz";
    if (i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [i18n]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setDropdownOpen(false);
  };

  const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 90;
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: "smooth",
    });
  }
};


  return (
    <nav
      className={`${
        isScrolled ? "bg-[#333b3f] shadow-lg" : "bg-transparent"
      } p-5 text-white fixed w-full z-50 transition-all duration-300`}
    >
      <div className="max-w-[1700px] mx-auto flex justify-between items-center">
        <div className="text-3xl flex items-center">
          <Link href="/" className="flex items-center">
            <div className="relative group">
              <Image
                src="/logo.png"
                alt="Hadiya Travel Logotip"
                width={60}
                height={60}
                className="h-16 w-auto transition-transform duration-300 group-hover:scale-105 rounded-full shadow-lg shadow-green-500/20"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-[#333b3f] rounded-full blur opacity-20 group-hover:opacity-40 transition-all duration-300"></div>
            </div>
          </Link>
        </div>

        <div
          className={`${
            isScrolled ? "" : "bg-[#333b3f]/90"
          } flex items-center gap-8 px-4 py-2 rounded-full backdrop-blur-md`}
        >
          <button
            onClick={() => scrollToSection("about")}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              pathname === "/about"
                ? "bg-green-500 text-white shadow-md"
                : "hover:bg-green-500/20 hover:text-green-300"
            }`}
          >
            {t("about")}
          </button>
          <button
            onClick={() => scrollToSection("tours")}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              pathname === "/tours"
                ? "bg-green-500 text-white shadow-md"
                : "hover:bg-green-500/20 hover:text-green-300"
            }`}
          >
            {t("tour")}
          </button>
          <button
            onClick={() => scrollToSection("services")}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              pathname === "/services"
                ? "bg-green-500 text-white shadow-md"
                : "hover:bg-green-500/20 hover:text-green-300"
            }`}
          >
            {t("service")}
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              pathname === "/contact"
                ? "bg-green-500 text-white shadow-md"
                : "hover:bg-green-500/20 hover:text-green-300"
            }`}
          >
            {t("contact")}
          </button>
        </div>

        <div className="flex items-center space-x-6">
          <a
            href="tel:+998970383833"
            className="flex items-center px-4 py-2 bg-[#333b3f] text-white rounded-full border border-green-500 shadow-2xl hover:bg-green-500 hover:text-white transition-all duration-300"
          >
            <Phone size={18} className="mr-2 text-green-400 animate-pulse" />
            +998 97 038-38-33
          </a>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-[#333b3f] cursor-pointer text-white px-4 py-2 rounded-full flex items-center border border-green-500 shadow-2xl hover:bg-green-500 transition-all duration-300"
            >
              {i18n.language.toUpperCase()}
              <ChevronDown size={18} className="ml-2" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-[#333b3f] text-white rounded-md shadow-lg overflow-hidden animate-fadeIn">
                <button
                  onClick={() => changeLanguage("uz")}
                  className="block w-full cursor-pointer px-4 py-2 text-left hover:bg-green-500/20 transition-all duration-200"
                >
                  O'zbek
                </button>
                <button
                  onClick={() => changeLanguage("ru")}
                  className="block w-full px-4 cursor-pointer py-2 text-left hover:bg-green-500/20 transition-all duration-200"
                >
                  Русский
                </button>
                <button
                  onClick={() => changeLanguage("en")}
                  className="block w-full px-4 cursor-pointer py-2 text-left hover:bg-green-500/20 transition-all duration-200"
                >
                  English
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}