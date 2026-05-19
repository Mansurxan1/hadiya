"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSpinner } from "react-icons/fa";

const formatPrice = (price: number) =>
  price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export default function BookingWidget({
  tourId,
  tourName,
  price,
  lang,
}: {
  tourId: string;
  tourName: string;
  price: number;
  lang: string;
}) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", phone: "+998" });
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const formatPhoneNumber = (digits: string) => {
    if (!digits) return "+998";
    const f = digits.match(/(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);
    if (f) {
      return `+998 ${f[1]}${f[2] ? " " + f[2] : ""}${
        f[3] ? " " + f[3] : ""
      }${f[4] ? " " + f[4] : ""}`.trim();
    }
    return `+998 ${digits}`;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z\sЀ-ӿ]*$/.test(value)) {
      setFormData((p) => ({ ...p, fullName: value }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const digits = value.startsWith("998") ? value.slice(3) : value;
    if (digits.length <= 9) {
      setFormData((p) => ({ ...p, phone: formatPhoneNumber(digits) }));
    }
  };

  const validateForm = () => {
    const newErrors: { fullName?: string; phone?: string } = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName =
        t("errors.fullName") || "Iltimos, ismingizni kiriting";
    }
    const phoneDigits = formData.phone.replace("+998", "").replace(/\s/g, "");
    if (!phoneDigits) {
      newErrors.phone =
        t("errors.phoneRequired") || "Iltimos, telefon raqamingizni kiriting";
    } else if (phoneDigits.length !== 9) {
      newErrors.phone = t("errors.phoneInvalid") || "Telefon raqami to'liq emas";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId,
          tourName,
          price,
          userName: formData.fullName,
          userPhone: formData.phone,
          lang,
        }),
      });
      const data = await response.json();
      if (data.success && data.redirectUrl) {
        if (data.orderId) localStorage.setItem("lastOrderId", data.orderId);
        window.location.href = data.redirectUrl;
      } else {
        setErrorMessage(
          data.error || t("paymentError") || "Ошибка при создании платежа"
        );
      }
    } catch {
      setErrorMessage(
        t("technicalError") || "Техническая ошибка, попробуйте позже"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center gap-5 items-center mt-12">
        <button
          onClick={() => window.history.back()}
          className="bg-gradient-to-br bg-sky-800/70 text-white px-6 py-3 rounded-lg font-medium text-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-sky-600 hover:to-sky-700 hover:scale-105"
        >
          {t("back")}
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-br text-white px-6 py-3 rounded-lg font-medium text-lg shadow-md hover:shadow-lg transition-all duration-300 bg-teal-600 hover:scale-105"
        >
          {t("buy")}
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex px-5 items-center justify-center bg-black bg-opacity-50 z-[120]">
          <div className="bg-sky-700 p-6 rounded-xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold text-center text-white mb-4">
              {t("orderDetails")}
            </h2>
            <div className="mb-6">
              <h3 className="text-base font-semibold text-white">
                <span className="font-bold text-xl">{t("travel")}</span>{" "}
                {tourName}
              </h3>
              <p className="text-xl font-bold text-white">
                {t("price")}{" "}
                <span className="text-white text-base font-normal">
                  {formatPrice(price)} {t("uzs")}
                </span>
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-white"
                >
                  {t("fullName")}
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleNameChange}
                  className="mt-1 block w-full p-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-700/30 outline-none border border-gray-600 rounded-md text-white placeholder-gray-400 placeholder:text-sm"
                  placeholder={t("fullNamePlaceholder")}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-white"
                >
                  {t("phone")}
                </label>
                <input
                  type="text"
                  id="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="mt-1 block w-full p-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-sky-700/30 outline-none border border-sky-600 rounded-md text-white"
                  placeholder="+998 99 999 99 99"
                  maxLength={17}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-3 text-center">
                  {errorMessage}
                </p>
              )}
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-all"
                >
                  {t("back")}
                </button>
                <button
                  type="submit"
                  className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all relative ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <FaSpinner className="animate-spin h-5 w-5 mr-2 text-white" />
                      {t("processing")}
                    </div>
                  ) : (
                    t("payWithClick")
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
