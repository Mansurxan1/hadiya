"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ChevronDown, Phone, Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const [isScrolled, setIsScrolled] = useState(false); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 
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

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [mobileMenuOpen]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setDropdownOpen(false);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: "about", label: t("about"), path: "/about" },
    { id: "tours", label: t("tour"), path: "/tours" },
    { id: "services", label: t("service"), path: "/services" },
    { id: "contact", label: t("contact"), path: "/contact" },
  ];

  const modalVariants = {
    hidden: { y: "-100%", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: "easeInOut" } },
    exit: { y: "100%", opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (index: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: index * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <nav
      className={`${
        isScrolled ? "bg-[#333b3f] shadow-lg" : "bg-transparent"
      } px-2 py-4 sm:p-5 text-white fixed w-full z-50 transition-all duration-300`}
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
                priority
                className="h-10 phone-max:h-[70px] w-auto transition-transform duration-300 group-hover:scale-105 rounded-full shadow-lg shadow-green-500/20"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-[#333b3f] rounded-full blur opacity-20 group-hover:opacity-40 transition-all duration-300"></div>
            </div>
          </Link>
        </div>

        <div
          className={`${
            isScrolled ? "" : "bg-[#333b3f]/90"
          } items-center hidden lg:flex gap-8 px-4 py-2 rounded-full backdrop-blur-md`}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-4 py-2 font-bold rounded-full transition-all duration-300 ${
                pathname === item.path
                  ? "bg-green-500 text-white shadow-md"
                  : "hover:bg-green-500/20 hover:text-green-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 phone-min:gap-2">
          <a
            href="tel:+998970383833"
            className="group flex items-center font-medium p-2 sm:px-4 text-xs phone-min:text-sm sm:text-lg bg-[#333b3f] text-white hover:text-gray-800 rounded-full border border-green-500 shadow-2xl hover:bg-green-500 transition-all"
          >
            <Phone size={18} className="mr-2 text-green-400 animate-pulse group-hover:text-red-500" />
            +998 97 038-38-33
          </a>


          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-[#333b3f] cursor-pointer text-xs phone-min:text-sm sm:text-lg text-white px-4 py-2 rounded-full flex items-center border border-green-500 shadow-2xl hover:bg-green-500 transition-all duration-300"
            >
              {i18n.language.toUpperCase()}
              <ChevronDown size={16} className="ml-1" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-24 bg-[#333b3f] text-white rounded-md shadow-lg overflow-hidden">
                <button
                  onClick={() => changeLanguage("uz")}
                  className="block w-full cursor-pointer p-2 text-left hover:bg-green-500/20"
                >
                  O&#39;zbek
                </button>
                <button
                  onClick={() => changeLanguage("ru")}
                  className="block w-full cursor-pointer p-2 text-left hover:bg-green-500/20"
                >
                  Русский
                </button>
                <button
                  onClick={() => changeLanguage("en")}
                  className="block w-full cursor-pointer p-2 text-left hover:bg-green-500/20"
                >
                  English
                </button>
              </div>
            )}
          </div>

          <button
            className="lg:hidden text-white relative w-10 h-10 flex items-center justify-center rounded-full bg-[#333b3f] border border-green-500 shadow-lg hover:bg-green-500/20 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="menu open"
          >
            <div className="absolute transition-all duration-500">
              <Menu
                size={28}
                className={`${
                  mobileMenuOpen
                    ? "opacity-0 rotate-180 scale-0"
                    : "opacity-100 rotate-0 scale-100"
                } transition-all duration-500`}
              />
              <X
                size={28}
                className={`absolute top-0 left-0 ${
                  mobileMenuOpen
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 rotate-180 scale-0"
                } transition-all duration-500`}
              />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-40 flex items-center justify-center"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={backdropVariants}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              variants={backdropVariants}
            />

            <motion.div
              className="relative w-11/12 max-w-md bg-[#333b3f]/95 rounded-2xl shadow-2xl shadow-green-500/30 border border-green-500/40"
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()} 
            >
              <div className="p-6 space-y-6">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-6 py-4 text-xl font-semibold rounded-xl transition-all duration-300 ${
                      pathname === item.path
                        ? "bg-green-500 text-white shadow-lg"
                        : "text-white hover:bg-green-500/30 hover:text-green-300 hover:shadow-md"
                    } bg-gradient-to-r from-[#333b3f] to-[#444b4f] border border-green-500/20 transform hover:scale-105`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>

              <button
                className="absolute top-4 right-4 text-white w-10 h-10 flex items-center justify-center rounded-full bg-[#333b3f] border border-green-500 shadow-lg hover:bg-green-500/30 transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={28} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}