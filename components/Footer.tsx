"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaMapMarkerAlt, FaTelegram, FaTiktok } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FiPhoneCall } from "react-icons/fi";

const Footer = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 20);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (index: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: index * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  const quickLinks = [
    { id: "about", label: t("about"), path: "/about" },
    { id: "tours", label: t("tour"), path: "/tours" },
    { id: "services", label: t("service"), path: "/services" },
    { id: "contact", label: t("contact"), path: "/contact" },
  ];

  const otherPages = [
    { id: "refund-policy", label: t("contract"), href: "" },
    { id: "faq", label: t("faq"), href: "/" },
  ];

  const socialLinks = [
    { href: "https://t.me/hadiyatravel", icon: <FaTelegram />, label: "Telegram" },
    { href: "https://instagram.com/hadiyatravel", icon: <RiInstagramFill />, label: "Instagram" },
    { href: "https://www.tiktok.com/@hadiyatravel", icon: <FaTiktok />, label: "TikTok" },
  ];

  return (
    <footer
      className={`relative bg-gradient-to-br from-[#1E2A44] via-[#2a3236] to-[#1E2A44] text-white overflow-hidden transition-all duration-500 ${
        isScrolled ? "shadow-xl border-t border-green-600/30" : "shadow-lg"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-green-900/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500/50 via-gold-500/50 to-green-500/50" />
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col gap-5"
        >
          <motion.div
            variants={fadeInUp}
            className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6"
          >
            <Link href="/" className="flex items-center justify-center gap-3 group">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="HADIYA TRAVEL Logo"
                  width={isMobile ? 40 : 50}
                  height={isMobile ? 40 : 50}
                  className="object-cover rounded-full transform group-hover:scale-110 transition-transform duration-400 ease-in-out shadow-lg shadow-green-500/30"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-gold-500/20 to-[#333b3f] rounded-full blur-md opacity-30 group-hover:opacity-50 transition-all duration-400"></div>
              </div>
              <span className="text-[clamp(1.25rem,4vw,2rem)] font-extrabold text-green-400 group-hover:from-green-400 group-hover:to-gold-600 transition-all duration-400">
                HADIYA TRAVEL
              </span>
            </Link>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  custom={index}
                  variants={itemVariants}
                  href={social.href}
                  aria-label={`${social.label} Hadiya Travel`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-green-500 to-green-700 rounded-full hover:from-green-600 hover:to-gold-500 hover:scale-110 transition-all duration-400 shadow-lg shadow-green-500/20 group"
                >
                  <span className="text-white text-2xl group-hover:scale-125 transition-transform duration-300">
                    {social.icon}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="w-full text-center md:text-left md:max-w-[70%]">
            <p className="text-base font-light text-gray-200 leading-relaxed tracking-wide">
              {t("footerInfo")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            <motion.div variants={fadeInUp} className="text-center md:text-left">
              <h3 className="text-[clamp(1.1rem,2vw,1.25rem)] font-semibold mb-4 sm:mb-6 text-green-500">
                {t("info")}
              </h3>
              <ul className="space-y-[clamp(0.5rem,2vh,0.8rem)] mx-auto md:text-left">
                {quickLinks.map((link, index) => (
                  <motion.li key={link.id} custom={index} variants={itemVariants} className="group">
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-[clamp(1rem,1.5vw,1.2rem)] mx-auto md:mx-0 font-medium text-gray-200 hover:text-green-400 transition-all duration-300 flex items-center justify-center md:justify-start gap-2 cursor-pointer"
                    >
                      <span className="w-0 h-0.5 bg-gradient-to-r from-green-400 to-gold-500 rounded-full transition-all duration-300 group-hover:w-[clamp(0.75rem,2vw,1.5rem)]" />
                      <span className="transform group-hover:translate-x-2 transition-transform duration-300">
                        {link.label}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center md:text-left">
              <h3 className="text-[clamp(1.1rem,2vw,1.3rem)] font-semibold mb-4 sm:mb-6 text-green-400">
                {t("privacy")}
              </h3>
              <ul className="space-y-[clamp(0.5rem,2vh,1.25rem)]">
                {otherPages.map((page, index) => (
                  <motion.li key={page.id} custom={index} variants={itemVariants} className="group">
                    <Link
                      href={page.href}
                      className="text-[clamp(1rem,1.5vw,1.2rem)] font-medium text-gray-200 hover:text-green-400 transition-all duration-300 flex items-center justify-center md:justify-start gap-2"
                    >
                      <span className="w-0 h-0.5 bg-gradient-to-r from-green-400 to-gold-500 rounded-full transition-all duration-300 group-hover:w-[clamp(0.75rem,2vw,1.5rem)]" />
                      <span className="transform group-hover:translate-x-2 transition-transform duration-300">
                        {page.label}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="sm:col-span-2 lg:col-span-2 text-center md:text-left">
              <h3 className="text-[clamp(1.1rem,2vw,1.3rem)] font-semibold mb-4 sm:mb-6 text-green-500">
                {t("contact")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <div className="w-[clamp(2rem,5vw,2.5rem)] h-[clamp(2rem,5vw,2.5rem)] flex items-center justify-center bg-gradient-to-r from-green-500 to-green-700 rounded-full shadow-lg">
                      <FiPhoneCall className="text-white text-[clamp(0.80rem,1.5vw,1.2rem)]" />
                    </div>
                    <a
                      href="tel:+998970383833"
                      className="text-[clamp(1rem,1.5vw,1.2rem)] text-gray-200 hover:text-green-400 transition-colors duration-300"
                    >
                      +998 97 038-38-33
                    </a>
                  </div>

                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <div className="w-[clamp(2rem,5vw,2.5rem)] h-[clamp(2rem,5vw,2.5rem)] flex items-center justify-center bg-gradient-to-r from-green-500 to-green-700 rounded-full shadow-lg">
                      <FaEnvelope className="text-white text-[clamp(1rem,1.5vw,1.2rem)]" />
                    </div>
                    <a
                      href="mailto:idealjamoa1@gmail.com"
                      className="text-[clamp(1rem,1.5vw,1.2rem)] text-gray-200 hover:text-green-400 transition-colors duration-300"
                    >
                      idealjamoa1@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start justify-center md:justify-start gap-3">
                  <div className="flex items-center justify-center mt-1">
                    <FaMapMarkerAlt className="text-white w-[30px] h-[30px] text-[clamp(0.75rem,1.5vw,1rem)]" />
                  </div>
                  <span className="text-[clamp(1rem,1.5vw,1.2rem)] max-w-[260px] text-gray-300">{t("address")}</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp} className=" pt-4 border-t border-gray-700/30 text-center">
            <p className="text-[clamp(0.8rem,1.2vw,1rem)] text-gray-400">
              © {new Date().getFullYear()} HADIYA TRAVEL. {t("allRightsReserved")}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;