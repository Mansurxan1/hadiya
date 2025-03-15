"use client"

import type { NextPage } from "next";
import { CheckCircle, PhoneCall } from "lucide-react";
import { useTranslation } from "react-i18next";

const Visa: NextPage = () => {
  const { t } = useTranslation();

  return (
    <section className="flex items-center justify-center p-5">
      <div className="max-w-[900px] w-full space-y-12">
        <h2 className="text-center text-3xl text-green-500 font-bold">{t("visa_services")}</h2>
        <div className="relative bg-gray-800/50 border border-white/40 rounded-xl shadow-lg px-5 py-3 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2" />
          <h3 className="text-2xl font-bold text-center mb-5 text-green-500">{t("saudi_visa_service")}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg p-3 bg-gray-800/50 transition-colors duration-300">
              <h4 className="text-xl font-semibold mb-4 text-green-500">{t("tourist_visa")}</h4>
              <ul className="space-y-3 text-white">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-400 w-5 h-5" /> {t("valid_for_1_year")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-400 w-5 h-5" /> {t("stay_up_to_90_days")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-400 w-5 h-5" /> {t("multiple_entries")}
                </li>
                <li className="text-green-400 text-lg font-bold">{t("visaPrice")}: 135$</li>
              </ul>
            </div>

            <div className="rounded-lg p-3 bg-gray-800/50 transition-colors duration-300">
              <h4 className="text-xl font-semibold mb-4 text-green-500">{t("umrah_visa")}</h4>
              <ul className="space-y-3 text-white">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-400 w-5 h-5" /> {t("valid_for_1_year")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-400 w-5 h-5" /> {t("single_entry")}
                </li>
                <li className="text-green-400 text-lg font-bold">{t("visaPrice")}: 155$</li>
              </ul>
            </div>
          </div>

          <div className="mt-5 text-center">
            <p className="text-lg font-medium text-green-400">{t("contact_us")}:</p>
            <a
              href="tel:+998970383833"
              className="inline-flex items-center gap-2 text-gray-100 mt-1 bg-green-700 p-2 rounded-lg text-xl font-semibold hover:text-white/80 transition-colors duration-200"
            >
              <PhoneCall className="w-6 h-6" /> {t("phone_number")}
            </a>
          </div>
        </div>

        <div className="relative bg-gray-800/50 border border-white/40 rounded-xl shadow-lg p-5 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2" />
          <h3 className="text-2xl font-bold text-center mb-5 text-green-400">{t("india_visa_services")}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg p-4 bg-gray-800/50 transition-colors duration-300">
              <h4 className="text-xl font-semibold mb-4 text-green-500">{t("travel_visa")}</h4>
              <ul className="space-y-3 text-white">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-400 w-5 h-5" /> {t("30_day_travel_visa")}
                  <span className="ml-2 text-green-400 font-bold">$50</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-400 w-5 h-5" /> {t("1_year_travel_e_visa")}
                  <span className="ml-2 text-green-400 font-bold">$70</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg p-4 bg-gray-800/50 transition-colors duration-300">
              <h4 className="text-xl font-semibold mb-4 text-green-500">{t("medical_visa")}</h4>
              <ul className="space-y-3 text-white">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-400 w-5 h-5" /> {t("60_day_medical_e_visa")}
                  <span className="ml-2 text-green-400 font-bold">$120</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg font-medium text-green-400">{t("contact_us")}:</p>
            <a
              href="tel:+998970383833"
              className="inline-flex items-center gap-2 text-gray-100 mt-1 bg-green-700 p-2 rounded-lg text-xl font-semibold hover:text-white/80 transition-colors duration-200"
            >
              <PhoneCall className="w-6 h-6" /> {t("phone_number")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Visa;