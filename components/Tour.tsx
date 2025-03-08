"use client";

import { useTourStore } from "../zustand/tourStore";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

const TourList = () => {
  const { tours } = useTourStore();
  const { t } = useTranslation();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <section id="tours" className="py-16">
      <div className="max-w-[1700px] mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-green-300 to-green-500 bg-clip-text text-transparent">
          {t("ourTours")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour, index) => (
            <div
              key={index}
              className="relative bg-[#2a3236] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <div className="relative group">
                <Image
                  src={tour.image}
                  alt={t(`tours.${tour.id}.title`)}
                  width={400}
                  height={250}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4 text-white bg-green-500 text-sm font-semibold py-1 px-2 rounded-full">
                    {tour.price.toLocaleString()} {t("uzs")}
                    </div>
                </div>
              <div className="p-3">
                <h3 className="text-lg font-bold min-h-[56px] bg-gradient-to-r from-green-300 to-green-500 bg-clip-text text-transparent mb-2 line-clamp-2">
                {t(`tours.${tour.id}.title`)}
                </h3>
                <p className="text-gray-300 text-sm pt-2 mb-4 line-clamp-2">
                  <span className="text-white font-bold mr-1">{t(`tours.${tour.id}.day`)}</span> 
                  {t(`tours.${tour.id}.description`)}
                </p>
                <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:from-teal-600 hover:to-blue-700 hover:scale-105">
                  {t("inDetail")}
                </button>
              </div>
              {hoverIndex === index && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-blue-500 animate-slide" />
              )}
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-slide {
          animation: slide 1.5s infinite;
        }
      `}</style>
    </section>
  );
};

export default TourList;