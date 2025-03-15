"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

interface Testimonial {
  name: string;
  role: string;
  review: string;
}

const testimonials: Testimonial[] = [
  { name: "aziza", role: "traveler", review: "review_1" },
  { name: "umid", role: "world_traveler", review: "review_2" },
  { name: "dilshod", role: "medical_tourist", review: "review_3" },
  { name: "marina", role: "photographer", review: "review_4" },
  { name: "ahmadjon", role: "businessman", review: "review_5" },
  { name: "abdulaziz", role: "traveler", review: "review_6" },
  { name: "nargiza", role: "student", review: "review_7" },
  { name: "ravshan", role: "pensioner", review: "review_8" },
  { name: "abbos", role: "blogger", review: "review_9" },
];

const Testimonials: React.FC = () => {
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth >= 1000) {
        setVisibleCount(8);
      } else if (window.innerWidth >= 420) {
        setVisibleCount(4);
      } else {
        setVisibleCount(3);
      }
    };

    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  return (
    <section className="text-white">
      <div className="max-w-[1700px] mx-auto px-5">
        <h2 className="text-2xl md:text-[28px] text-green-400 md-lg:text-3xl font-bold text-center mb-5">
          {t("customer_reviews")}
        </h2>
        <div className="grid phone-min:grid-cols-1 phone-max:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {testimonials.slice(0, visibleCount).map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="mb-4">
                <h3 className="text-base md:text-xl font-semibold">{t(testimonial.name)}</h3>
                <p className="text-xs text-gray-400">{t(testimonial.role)}</p>
              </div>
              <p className="text-gray-200 text-sm md:text-base italic">
                {t(testimonial.review).replace(/"/g, "&quot;")} 
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;