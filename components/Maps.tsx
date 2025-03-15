"use client";

import type { NextPage } from "next";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { FaSpinner } from "react-icons/fa";
import Image from "next/image";

const Maps: NextPage = () => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+998");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string; message?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const mapUrl = `https://static-maps.yandex.ru/1.x/?ll=69.211950,41.301972&z=17&l=map&size=600,400&pt=69.211950,41.301972,pm2rdm`;
  const yandexMapLink = "https://yandex.com/maps/?ll=69.211950,41.301972&z=17&pt=69.211950,41.301972,pm2rdm";

  const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

  const formatPhoneNumber = (digits: string) => {
    if (!digits) return "+998";
    const formatted = digits.match(/(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);
    if (formatted) {
      return `+998 ${formatted[1]}${formatted[2] ? " " + formatted[2] : ""}${
        formatted[3] ? " " + formatted[3] : ""
      }${formatted[4] ? " " + formatted[4] : ""}`.trim();
    }
    return `+998 ${digits}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const digits = value.startsWith("998") ? value.slice(3) : value;
    if (digits.length <= 9) {
      setPhone(formatPhoneNumber(digits));
    }
  };

  const sendToTelegram = async (fullName: string, phone: string, message: string) => {
    const text = `📝 *Yangi xabar*\n👤 *Ism familiya:* ${fullName}\n📞 *Telefon:* ${phone}\n💬 *Xabar:* ${message}`;
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
      await axios.post(url, {
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: "Markdown",
      });
      setErrorMessage("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Telegramga yuborishda xato (Axios):", error);
        setErrorMessage(t("technicalError"));
        throw error;
      } else {
        console.error("Telegramga yuborishda noma’lum xato:", error);
        setErrorMessage(t("technicalError"));
        throw error;
      }
    }
  };

  const validateForm = () => {
    const newErrors: { fullName?: string; phone?: string; message?: string } = {};

    if (!fullName.trim()) newErrors.fullName = t("errors.fullName");

    const phoneDigits = phone.replace("+998", "").replace(/\s/g, "");
    if (!phoneDigits) {
      newErrors.phone = t("errors.phoneRequired");
    } else if (phoneDigits.length !== 9) {
      newErrors.phone = t("errors.phoneInvalid");
    }

    if (!message.trim()) newErrors.message = t("errors.message");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setErrorMessage("");

      try {
        await sendToTelegram(fullName, phone, message);
        setFullName("");
        setPhone("+998");
        setMessage("");
        setErrors({});
        setIsModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    };
  }, [isModalOpen]);

  return (
    <section id="contact" className="flex items-center justify-center p-5">
      <div className="max-w-[1700px] w-full flex flex-col md-lg:flex-row gap-8 text-white">
        <div className="w-full md-lg:w-1/2 p-3 rounded-xl shadow-xl flex flex-col justify-between bg-gray-800/70">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-green-400">
              {t("contactInfo")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <label htmlFor="fullName" className="block text-base font-medium text-gray-300">
                  {t("fullName")}
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 block w-full p-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-700/30 outline-none border border-gray-600 rounded-md text-white placeholder-gray-400 placeholder:text-sm"
                  placeholder={t("fullNamePlaceholder")}
                />
                {errors.fullName && <p className="text-red-500 text-base mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-base font-medium text-gray-300">
                  {t("phone")}
                </label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="mt-1 block w-full p-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-700/30 outline-none border border-gray-600 rounded-md text-white"
                />
                {errors.phone && <p className="text-red-500 text-base mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="message" className="block text-base font-medium text-gray-300">
                  {t("message")}
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 w-full p-1 px-2 bg-gray-700/30 outline-none border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500 transition-all h-20 phone-max:h-32 resize-none"
                  placeholder={t("messagePlaceholder")}
                  rows={4}
                />
                {errors.message && <p className="text-red-500 text-base mt-1">{errors.message}</p>}
              </div>
            </form>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mt-3 text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            onClick={handleSubmit}
            className={`w-full text-gray-100 p-2 md:py-3 rounded-xl bg-green-600 mt-5 font-semibold relative ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin h-5 w-5 mr-2 text-white" />
                {t("loading")}
              </div>
            ) : (
              t("submit")
            )}
          </button>
        </div>

        <div className="w-full md-lg:w-1/2 h-[200px] phone-max:h-[300px] md-lg:h-auto flex items-center">
          <a href={yandexMapLink} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            <Image
              src={mapUrl}
              alt={t("mapAlt")}
              width={600}
              height={400}
              className="w-full h-full object-cover rounded-xl shadow-xl cursor-pointer"
              style={{ pointerEvents: "auto" }}
            />
          </a>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex px-5 items-center justify-center bg-black bg-opacity-50 z-50 overflow-hidden"
          onClick={closeModal}
        >
          <div
            className="bg-gray-700 p-6 rounded-xl shadow-lg text-center max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-green-300 mb-4">{t("modalTitle")}</h2>
            <p className="text-gray-300 mb-6">{t("modalMessage")}</p>
            <button
              onClick={closeModal}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all"
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Maps;