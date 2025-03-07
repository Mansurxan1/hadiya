"use client";

import { useTranslation } from "react-i18next";

interface Testimonial {
  name: string;
  role: string;
  review: string;
}

const testimonials: Testimonial[] = [
  {
    name: "aziza",
    role: "traveler",
    review: "review_1",
  },
  {
    name: "umid",
    role: "world_traveler",
    review: "review_2",
  },
  {
    name: "dilshod",
    role: "medical_tourist",
    review: "review_3",
  },
  {
    name: "marina",
    role: "photographer",
    review: "review_4",
  },
  {
    name: "ahmadjon",
    role: "businessman",
    review: "review_5",
  },
  {
    name: "abdulaziz",
    role: "traveler",
    review: "review_6",
  },
  {
    name: "nargiza",
    role: "student",
    review: "review_7",
  },
  {
    name: "ravshan",
    role: "pensioner",
    review: "review_8",
  },
  {
    name: "abbos",
    role: "blogger",
    review: "review_9",
  },
];

const Testimonials: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-6 text-white">
      <div className="max-w-[1700px] mx-auto px-5">
        <h2 className="text-4xl font-bold text-center mb-12">
          {t("customer_reviews")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{t(testimonial.name)}</h3>
                  <p className="text-sm text-gray-400">{t(testimonial.role)}</p>
                </div>
              </div>
              <p className="text-gray-200 italic">"{t(testimonial.review)}"</p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Testimonials;