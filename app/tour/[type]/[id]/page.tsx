"use client";

import { useTourStore } from "@z/tourStore";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, useAnimation, Variants } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import Maps from "@/components/Maps";

interface Tour {
  id: string;
  title: string;
  description: string;
  services: string;
  separately: string;
  information: string;
  day: string;
  price: number;
  image: string;
  visa?: string;
}

interface ScrollAnimatedCardProps {
  children: React.ReactNode;
  variants: Variants;
  className?: string;
}

const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const ScrollAnimatedCard = ({ children, variants, className = "" }: ScrollAnimatedCardProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const TourDetail = () => {
  const { tours, worldtour, medicaltour } = useTourStore();
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const params = useParams();
  const { type, id } = params;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  if (!isMounted) return null;

  let tour: Tour | undefined;
  let translationKey: string = "";

  if (type === "internal") {
    tour = tours.find((t) => t.id === id);
    translationKey = "tours";
  } else if (type === "world") {
    tour = worldtour.find((t) => t.id === id);
    translationKey = "worldtour";
  } else if (type === "medical") {
    tour = medicaltour.find((t) => t.id === id);
    translationKey = "medicaltour";
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-black to-gray-900 flex items-center justify-center">
        <h2 className="text-5xl md:text-6xl font-serif text-white font-light drop-shadow-md">
          {t("tourNotFound")}
        </h2>
      </div>
    );
  }

  const hotelStar = t(`${translationKey}.${tour.id}.hotelstar`);
  const starCount = hotelStar ? parseInt(hotelStar, 10) : 0;

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsModalOpen(false);
  };

  return (
    <section
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="relative w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative w-full h-[50vh] md:h-[70vh] lg:h-screen overflow-hidden"
          style={{ backgroundAttachment: "fixed" }}
        >
          <Image
            src={tour.image || "/placeholder.svg"}
            alt={t(`${translationKey}.${tour.id}.title`)}
            layout="fill"
            objectFit="cover"
            priority
            className="w-full h-full transition-transform duration-500 hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-green-500 text-center px-6 tracking-wide drop-shadow-sm">
              {t(`${translationKey}.${tour.id}.title`) || "No Title"}
            </h1>
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-[1700px] mx-auto px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <ScrollAnimatedCard variants={cardVariants}>
            <motion.div
              className="text-white bg-gray-800/70 p-6 rounded-xl shadow-md h-full flex flex-col justify-between"
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-green-500">{t("price")}</h3>
                <p className="mt-2 text-lg md:text-xl font-medium">
                  {formatPrice(tour.price)} {t("uzs")}
                </p>
              </div>
            </motion.div>
          </ScrollAnimatedCard>

          <ScrollAnimatedCard variants={cardVariants}>
            <motion.div
              className="text-white bg-gray-800/70 p-6 rounded-xl shadow-md h-full flex flex-col justify-between"
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-green-500">{t("day")}</h3>
                <p className="mt-2 text-lg md:text-xl font-medium">
                  {t(`${translationKey}.${tour.id}.day`) || "No days specified"}
                </p>
              </div>
            </motion.div>
          </ScrollAnimatedCard>

          {type !== "internal" && (
            <ScrollAnimatedCard variants={cardVariants} className="lg:col-span-1 col-span-full">
              <motion.div
                className="text-white bg-gray-800/70 p-6 rounded-xl shadow-md h-full flex flex-col justify-between"
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-green-500">{t("visa")}</h3>
                  <p className="mt-2 text-lg md:text-xl font-medium">
                    {t(`${translationKey}.${tour.id}.visa`)}
                  </p>
                </div>
              </motion.div>
            </ScrollAnimatedCard>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          <ScrollAnimatedCard variants={cardVariants}>
            <motion.div
              className="text-white bg-gray-800/70 p-6 rounded-xl shadow-md h-full flex flex-col justify-between"
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-green-500">{t("separately")}</h3>
                <p className="mt-2 text-lg md:text-xl font-medium">
                  {t(`${translationKey}.${tour.id}.separately`)}
                </p>
              </div>
            </motion.div>
          </ScrollAnimatedCard>

          <ScrollAnimatedCard variants={cardVariants}>
            <motion.div
              className="text-white bg-gray-800/70 p-6 rounded-xl shadow-md h-full flex flex-col justify-between"
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-green-500">{t("description")}</h3>
                <p className="mt-2 text-lg md:text-xl font-medium">
                  {t(`${translationKey}.${tour.id}.description`)}
                </p>
              </div>
            </motion.div>
          </ScrollAnimatedCard>

          <ScrollAnimatedCard variants={cardVariants}>
            <motion.div
              className="text-white bg-gray-800/70 p-6 rounded-xl shadow-md h-full flex flex-col justify-between"
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-green-500">{t("tour_services")}</h3>
                <p className="mt-2 text-lg md:text-xl font-medium">
                  {t(`${translationKey}.${tour.id}.services`)}
                </p>
              </div>
            </motion.div>
          </ScrollAnimatedCard>

          <ScrollAnimatedCard variants={cardVariants}>
            <motion.div
              className="text-white bg-gray-800/70 p-6 rounded-xl shadow-md h-full flex flex-col justify-between"
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-green-500">{t("information")}</h3>
                <p className="mt-2 text-lg md:text-xl font-medium">
                  {t(`${translationKey}.${tour.id}.information`)}
                </p>
              </div>
            </motion.div>
          </ScrollAnimatedCard>

          {type !== "internal" && t(`${translationKey}.${tour.id}.hotel`) && (
            <ScrollAnimatedCard variants={cardVariants}>
              <motion.div
                className="text-white bg-gray-800/70 p-3 rounded-xl shadow-md h-full flex flex-col justify-between"
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-green-500">{t("hotel")}</h3>
                  <p className="mt-2 text-lg md:text-xl font-medium flex items-center gap-2">
                    {t(`${translationKey}.${tour.id}.hotel`)}
                    {starCount > 0 && (
                      <span className="flex">
                        {Array.from({ length: starCount }).map((_, index) => (
                          <FaStar key={index} className="text-yellow-400" size={20} />
                        ))}
                      </span>
                    )}
                  </p>
                </div>
              </motion.div>
            </ScrollAnimatedCard>
          )}
        </div>

        <ScrollAnimatedCard variants={buttonVariants}>
          <motion.div
            className="flex justify-center gap-5 items-center mt-12"
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            <button
              onClick={() => window.history.back()}
              className="bg-gradient-to-br bg-[#333b3f] border border-white/20 text-white px-6 py-3 rounded-lg font-medium text-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-700 hover:scale-105"
            >
              {t("back")}
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-br text-white px-6 py-3 rounded-lg font-medium text-lg shadow-md hover:shadow-lg transition-all duration-300 bg-teal-600 hover:scale-105"
            >
              {t("buy")}
            </button>
          </motion.div>
        </ScrollAnimatedCard>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-gray-800/80 p-6 rounded-xl mx-5 shadow-lg w-full max-w-md"
          >
            <h2 className="text-2xl font-bold text-center text-green-600 mb-4">{t("orderDetails")}</h2>
            <div className="mb-6">
              <h3 className="text-base font-semibold text-white">
                <span className="font-bold text-xl text-green-600">{t("travel")}</span>{" "}
                {t(`${translationKey}.${tour.id}.title`) || "No Title"}
              </h3>
              <p className="text-xl font-bold text-green-600">
                {t("price")}{" "}
                <span className="text-white text-base font-normal">
                  {formatPrice(tour.price)} {t("uzs")} 
                </span>
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">{t("fullName")}</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={t("errors.fullName")}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">{t("phone")}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="+998 91 123 45 67"
                  required
                />
              </div>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  {t("back")}
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                >
                  {t("buyNow")}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      <Maps />
    </section>
  );
};

export default TourDetail;