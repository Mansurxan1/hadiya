"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function ServicesSection() {
  const { t } = useTranslation();

  const services = [
    { title: "services.flightTickets", desc: "services.flightTicketsDesc", extra: "services.flightTicketsExtra" },
    { title: "services.hotels", desc: "services.hotelsDesc", extra: "services.hotelsExtra" },
    { title: "services.dining", desc: "services.diningDesc", extra: "services.diningExtra" },
    { title: "services.transfers", desc: "services.transfersDesc", extra: "services.transfersExtra" },
    { title: "services.guidesAndTours", desc: "services.guidesAndToursDesc", extra: "services.guidesAndToursExtra" },
    { title: "services.visaServices", desc: "services.visaServicesDesc", extra: "services.visaServicesExtra" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.5 },
    },
  };

  return (
    <section id="services" className="pb-7 bg-gradient-to-b text-white">
      <div className="max-w-[1700px] mx-auto px-5">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-2xl md:text-3xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-500 pb-5"
        >
          {t("services.title")}
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }} 
              className="relative group bg-gray-800/50 p-3 rounded-xl shadow-lg hover:shadow-green-500/50 transition-shadow duration-300 transform hover:-translate-y-2"
            >
              <h3 className="text-lg md:text-xl text-center font-semibold text-green-300 mb-2 relative z-10">
                {t(service.title)}
              </h3>
              <p className="text-gray-300 text-lg mb-1 relative z-10">{t(service.desc)}</p>
              <p className="text-gray-400 text-base relative z-10">{t(service.extra)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}