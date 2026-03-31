"use client";

import type { NextPage } from "next";
import { CheckCircle, PhoneCall } from "lucide-react";
import { useTranslation } from "react-i18next";

const Visa: NextPage = () => {
  const { t } = useTranslation();

  return (
    <section className="flex items-center justify-center p-5">
      <div className="max-w-[1200px] w-full space-y-14">
        <h2 className="text-center text-4xl text-white font-bold">
          {t("visa_services")}
        </h2>

        <div className="relative bg-sky-800/50 border border-white/40 rounded-2xl shadow-lg px-6 py-9 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-500 to-sky-600" />

          <h3 className="text-3xl font-bold text-center mb-8 text-white">
            {t("saudi_visa_service")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl p-7 bg-sky-500/70 border border-white/20">
              <h4 className="text-2xl font-semibold mb-6 text-white">
                {t("tourist_visa")}
              </h4>
              <ul className="space-y-5 text-white text-lg">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white w-7 h-7 mt-0.5 flex-shrink-0" />
                  {t("valid_for_1_year")}
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white w-7 h-7 mt-0.5 flex-shrink-0" />
                  {t("stay_up_to_90_days")}
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white w-7 h-7 mt-0.5 flex-shrink-0" />
                  {t("multiple_entries")}
                </li>
                <li className="text-white text-3xl font-bold mt-6">
                  {t("visaPrice")}: 1 350 000 {t("currency")}
                </li>
              </ul>
            </div>

            <div className="rounded-2xl p-7 bg-sky-500/70 border border-white/20">
              <h4 className="text-2xl font-semibold mb-6 text-white">
                {t("umrah_visa")}
              </h4>
              <ul className="space-y-5 text-white text-lg">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white w-7 h-7 mt-0.5 flex-shrink-0" />
                  {t("valid_for_1_year")}
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white w-7 h-7 mt-0.5 flex-shrink-0" />
                  {t("single_entry")}
                </li>
                <li className="text-white text-3xl font-bold mt-6">
                  {t("visaPrice")}: 1 350 000 {t("currency")}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="relative bg-sky-800/50 border border-white/40 rounded-2xl shadow-lg px-6 py-9 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-500 to-sky-600" />

          <h3 className="text-3xl font-bold text-center mb-10 text-white">
            {t("travel_education_visas")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-7 bg-sky-800/70 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <h4 className="text-2xl font-semibold text-white">
                  {t("schengen_visa")}
                </h4>
              </div>
              <ul className="space-y-4 text-white text-lg">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white w-6 h-6 mt-1 flex-shrink-0" />
                  {t("valid_for_1_year")}
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white w-6 h-6 mt-1 flex-shrink-0" />
                  {t("multiple_countries")}
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white w-6 h-6 mt-1 flex-shrink-0" />
                  {t("tourism_purpose")}
                </li>
                <li className="text-white text-2xl font-bold mt-6">
                  {t("prices")}: 2,500,000 {t("currency")}
                </li>
              </ul>
            </div>

            <div className="rounded-2xl p-7 bg-sky-800/70 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <h4 className="text-2xl font-semibold text-white">
                  {t("japan_visa")}
                </h4>
              </div>
              <ul className="space-y-4 text-white text-lg">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white w-6 h-6 mt-1 flex-shrink-0" />
                  {t("tourist_purpose")}
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-white w-6 h-6 mt-1 flex-shrink-0" />
                  {t("short_term_travel")}
                </li>
                <li className="text-white text-2xl font-bold mt-6">
                  {t("prices")}: 1,200,000 {t("currency")}
                </li>
              </ul>
            </div>

            <div className="rounded-2xl p-7 bg-sky-800/70 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <h4 className="text-2xl font-semibold text-white">
                  {t("uk_visa")}
                </h4>
              </div>
              <ul className="space-y-4 text-white text-lg">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0" />
                  {t("tourist_business_visa")}
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className=" w-6 h-6 mt-1 flex-shrink-0" />
                  {t("education_business_visa")}
                </li>
                <li className="text-2xl font-bold mt-6">
                  {t("prices")}: 3,500,000 {t("currency")}
                </li>
              </ul>
            </div>

            <div className="rounded-2xl p-7 bg-sky-800/70 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <h4 className="text-2xl font-semibold text-white">
                  {t("umrah_tourist_visa")}
                </h4>
              </div>
              <ul className="space-y-4 text-white text-lg">
                <li className="text-2xl font-bold mt-6">
                  {t("prices")}: 1,350,000 {t("currency")}
                </li>
              </ul>
            </div>

            <div className="rounded-2xl p-7 bg-sky-800/70 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <h4 className="text-2xl font-semibold text-white">
                  {t("india_visa")}
                </h4>
              </div>
              <ul className="space-y-4 text-white text-lg">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0" />
                  {t("tourism_visa")}
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0" />
                  {t("education_visa")}
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0" />
                  {t("medical_visa")}
                </li>
                <li className="text-2xl font-bold mt-6">
                  {t("prices")}: 699,000 {t("currency")}
                </li>
              </ul>
            </div>

            <div className="rounded-2xl p-7 bg-sky-800/70 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <h4 className="text-2xl font-semibold text-white">
                  {t("pakistan_visa")}
                </h4>
              </div>
              <ul className="space-y-4 text-white text-lg">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0" />
                  {t("tourist_family_visa")}
                </li>
                <li className="text-2xl font-bold mt-6">
                  {t("prices")}: 699,000 {t("currency")}
                </li>
              </ul>
            </div>

            <div className="rounded-2xl p-7 bg-sky-800/70 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <h4 className="text-2xl font-semibold text-white">
                  {t("hongkong_visa")}
                </h4>
              </div>
              <ul className="space-y-4 text-white text-lg">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0" />
                  {t("tourism_visa")}
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0" />
                  {t("education_visa")}
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0" />
                  {t("business_work_visa")}
                </li>
                <li className="text-2xl font-bold mt-6">
                  {t("prices")}: 1,800,000 {t("currency")}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-2xl font-medium text-white mb-5">
            {t("contact_us")}:
          </p>
          <a
            href="tel:+998880383838"
            className="inline-flex items-center gap-4 bg-sky-700 hover:bg-sky-600 transition-all text-white text-2xl font-semibold px-12 py-6 rounded-2xl"
          >
            <PhoneCall className="w-8 h-8" />
            {t("phone_number")}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Visa;
