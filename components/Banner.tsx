"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useTranslation } from "next-i18next";
import "swiper/css";
import "swiper/css/pagination";

const bannerData = [
  {
    id: 1,
    imageUrl: "/registan.jpg",
  },
  {
    id: 2,
    imageUrl:
      "https://waterparktenerife.com/wp-content/uploads/2023/04/france.jpg.webp",
  },
  {
    id: 3,
    imageUrl:
      "https://neuro.uz/storage/uploads/post/large/18.04.2024/turizm.jpg.1713412044.jpeg",
  },
];

const Banner: React.FC = () => {
  const { t } = useTranslation();
  const bannerTexts = t("banner", { returnObjects: true }) as {
    title: string;
    description: string;
  }[];

  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="mySwiper"
      >
        {bannerData.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[60vh] md:h-[75vh] lg:h-screen flex items-center">
              <img
                src={item.imageUrl}
                alt={bannerTexts[index]?.title}
                className="w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#333b3f]/80 to-transparent"></div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white px-4 py-6 sm:px-6 sm:py-8 md:px-12 md:py-16 max-w-full">
                <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-5 drop-shadow-lg">
                  {bannerTexts[index]?.title}
                </h2>
                <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-green-200 font-medium w-full sm:w-3/4 md:w-1/2 drop-shadow-md">
                  {bannerTexts[index]?.description}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;