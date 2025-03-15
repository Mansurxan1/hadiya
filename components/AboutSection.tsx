"use client";

import { useTranslation } from "react-i18next";
import Image from "next/image";
import { FaTelegram, FaTiktok } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FiPhoneCall, FiMail, FiClock } from "react-icons/fi";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

export default function AboutSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const yLeft = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
  const yRight = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  const scrollToSection = (id: string) => {
    // Функция для выполнения скролла
    const performScroll = () => {
      const element = document.getElementById(id);
      if (element) {
        // Используем более надежный способ скролла с учетом смещения для заголовка
        const headerOffset = 100; // Примерная высота хедера
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        // Добавляем подсветку элемента, чтобы пользователь видел, куда произошел скролл
        element.classList.add('highlight-section');
        setTimeout(() => {
          element.classList.remove('highlight-section');
        }, 1500);
        
        console.log(`Успешно выполнен скролл к элементу с id "${id}"`);
      } else {
        console.warn(`Элемент с id "${id}" не найден при первой попытке. Пробуем еще раз...`);
        
        // Если элемент не найден, попробуем еще раз через секунду
        // Это может помочь, если компоненты загружаются асинхронно
        setTimeout(() => {
          const retryElement = document.getElementById(id);
          if (retryElement) {
            const headerOffset = 100;
            const elementPosition = retryElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
            
            retryElement.classList.add('highlight-section');
            setTimeout(() => {
              retryElement.classList.remove('highlight-section');
            }, 1500);
            
            console.log(`Успешно выполнен скролл к элементу с id "${id}" после повторной попытки`);
          } else {
            console.error(`Элемент с id "${id}" не найден после повторной попытки`);
          }
        }, 1000);
      }
    };
    
    // Запустим первую попытку скролла немедленно
    performScroll();
  };

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#contact') {
        scrollToSection('contact');
      }
    };

    if (window.location.hash === '#contact') {
      scrollToSection('contact');
    }

    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-5 relative overflow-hidden text-white">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-7 lg:gap-16">
          <motion.div
            style={{ opacity, y: yLeft }}
            className="w-full lg:w-1/2 text-center lg:text-left"
          >
            <div className="flex w-full justify-center lg:justify-start items-center gap-4 sm:gap-6 mb-1 sm:mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative group"
              >
                <Image
                  src="/favicon.ico"
                  alt="Hadiya Travel Logo"
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-green-500/60 shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-green-500/50 phone-min:w-[50px] sm:w-[100px] sm:h-[100px]"
                />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-2xl sm:text-3xl mt-4 lg:text-6xl pb-4 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-white to-green-200 leading-tight tracking-tight"
              >
                {t("aboutUs.title")}
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl font-semibold bg-gray-800/50 mb-4 sm:mb-6 px-4 py-2 rounded-lg inline-block shadow-md"
            >
              {t("aboutUs.manager")}: {t("aboutUs.managerName")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 mb-6 sm:mb-8"
            >
              <span className="text-sm sm:text-base bg-gray-800/50 px-3 py-1 rounded-full text-green-200 shadow-md">
                {t("aboutUs.founded")}
              </span>
              <span className="text-sm sm:text-base bg-gray-800/50 px-3 py-1 rounded-full text-green-200 shadow-md">
                {t("aboutUs.customers")}: 10 000+
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl leading-relaxed bg-gray-800/50 py-2 px-4 rounded-lg text-gray-200 lg:mx-0 mb-5"
            >
              {t("aboutUs.description")}
            </motion.p>

            <motion.div
              style={{ scale }}
              className="flex flex-col phone-max:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-4"
            >
              <a
                href="tel:+998970383833"
                className="inline-flex items-center bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-xl shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105"
                aria-label="Call Hadiya Travel"
              >
                <FiPhoneCall className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                <span>+998 97 038-38-33</span>
              </a>
              <p className="inline-flex items-center bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-xl shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105">
                <FiClock className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                9:00 - 21:00
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            style={{ opacity, y: yRight }}
            className="w-full lg:w-1/2 flex flex-col items-center lg:items-end space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
            >
              <button
                onClick={() => scrollToSection("contact")}
                className="relative border-2 border-green-500 overflow-hidden text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
              >
                <span className="absolute inset-0 bg-green-600 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-in-out"></span>
                <span className="relative z-10">{t("aboutUs.contact")}</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center lg:justify-end gap-4 sm:gap-6"
            >
              {[
                { href: "https://t.me/hadiyatravel", icon: FaTelegram, label: "Telegram" },
                { href: "https://instagram.com/hadiyatravel", icon: RiInstagramFill, label: "Instagram" },
                { href: "https://tiktok.com/@hadiyatravel", icon: FaTiktok, label: "TikTok" },
                { href: "mailto:idealjamoa1@gmail.com", icon: FiMail, label: "Email" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="p-3 sm:p-4 bg-gradient-to-br from-white/10 to-green-500/20 rounded-full text-green-400 hover:bg-green-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-green-500/50"
                  aria-label={`${social.label} Hadiya Travel`}
                >
                  <social.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}