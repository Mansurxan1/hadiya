"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image"; 
import "swiper/css";
import "swiper/css/autoplay";

const partners: string[] = [
  "https://static.tildacdn.com/tild3061-3839-4035-b135-313262643832/turkish-airlines-1.svg",
  "https://static.tildacdn.com/tild3735-6330-4662-b366-643563633232/aeroflot-russian-air.svg",
  "https://static.tildacdn.com/tild3064-3262-4766-b462-313264386332/qanot-sharq.svg",
  "https://static.tildacdn.com/tild3362-6230-4262-a265-346536633036/saudia.svg",
  "https://static.tildacdn.com/tild6433-3665-4561-b736-613739636462/airarabia.svg",
  "https://static.tildacdn.com/tild3737-6432-4161-b936-663634643737/flynas.svg",
  "https://static.tildacdn.com/tild6265-3430-4231-b166-636635353362/jazeera.svg",
  "https://static.tildacdn.com/tild3333-3435-4037-a565-346531643732/apex.svg",
  "https://static.tildacdn.com/tild3330-3935-4265-b238-393931653134/ahm-insurance-1.svg",
];

export default function Partners() {
  const { t } = useTranslation(); 

  return (
    <section className="pb-7 text-white">
      <div className="max-w-[1700px] mx-auto px-5">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-2xl md:text-3xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-500 pb-5"
        >
          {t("partners.title")} 
        </motion.h2>

        <Swiper
          spaceBetween={20} 
          slidesPerView={5} 
          loop={true} 
          autoplay={{
            delay: 2000, 
            disableOnInteraction: false, 
          }}
          breakpoints={{
            1024: { slidesPerView: 5 }, 
            768: { slidesPerView: 4 }, 
            480: { slidesPerView: 4 }, 
            320: { slidesPerView: 3 },
          }}
          modules={[Autoplay]} 
        >
          {partners.map((logo, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className=" flex justify-center"
              >
                <Image
                  src={logo}
                  alt={`Hamkor ${index + 1}`} 
                  width={128} 
                  height={96} 
                  className="object-cover h-22 md:h-32 w-full rounded-lg sm:rounded-2xl" 
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}