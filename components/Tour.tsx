"use client"

import { useTourStore } from "@z/tourStore"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import Link from "next/link"

interface Tour {
  id: string
  title: string
  description: string
  day: string
  price: number
  image: string
}

const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

const Tour = () => {
  const { tours, worldtour, medicaltour } = useTourStore()
  const { t } = useTranslation()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const renderTourSection = (tourList: Tour[], sectionTitle: string, translationKey: string, type: string) => (
    <section className="">
      <h2 className="text-2xl md:text-3xl mt-5 font-extrabold text-center pb-7 bg-gradient-to-r from-green-300 to-green-500 bg-clip-text text-transparent">
        {t(sectionTitle)}
      </h2>
      <Swiper
        spaceBetween={10}
        slidesPerView={1.4}
        breakpoints={{
          640: { slidesPerView: 2.5, spaceBetween: 15 },
          1024: { slidesPerView: 3.5, spaceBetween: 20 },
        }}
        className=""
      >
        {tourList.map((tour) => (
          <SwiperSlide key={tour.id} className="w-full max-w-[300px] sm:max-w-[400px] mr-2.5 sm:mr-5">
            <Link href={`/tour/${type}/${tour.id}`} className="block">
              <div className="relative bg-gray-800/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-100 cursor-pointer">
                <div className="relative group">
                  <Image
                    src={tour.image || "/placeholder.svg"}
                    alt={t(`${translationKey}.${tour.id}.title`)}
                    width={300}
                    height={150}
                    priority
                    className="w-full h-[150px] phone-max:h-[200px] sm:h-[250px] object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 duration-300" />
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-gray-200 bg-green-500 text-xs sm:text-sm font-semibold py-1 px-1 sm:px-2 rounded-full transition-all duration-300 group-hover:bg-teal-600">
                    {formatPrice(tour.price)} {t("uzs")}
                  </div>
                </div>
                <div className="p-2 sm:p-3 text-center transition-colors duration-300 group-hover:text-white">
                  <h3 className="text-lg sm:text-xl text-left font-bold min-h-[40px] sm:min-h-[56px] bg-gradient-to-r from-green-300 to-green-500 bg-clip-text text-transparent mb-1 sm:mb-2 line-clamp-2 transition-all duration-300 group-hover:text-white">
                    {t(`${translationKey}.${tour.id}.title`)}
                  </h3>
                  <p className="text-sm sm:text-base text-left text-gray-300 pt-1 sm:pt-2 mb-2 sm:mb-4 line-clamp-2 transition-colors duration-300 group-hover:text-gray-100">
                    <span className="text-white font-bold mr-0.5 sm:mr-1 transition-colors duration-300 group-hover:text-gray-200">
                      {t(`${translationKey}.${tour.id}.day`)}
                    </span>
                    {t(`${translationKey}.${tour.id}.description`)}
                  </p>
                  <div className="w-[90%] text-gray-100 px-2 sm:px-4 py-2 sm:py-3 rounded-lg text-base sm:text-base font-medium transition-all duration-300 bg-green-600 hover:bg-gradient-to-r hover:from-teal-600 hover:to-blue-700 hover:scale-105">
                    {t("inDetail")}
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )

  return (
    <section id="tours" className="py-5">
      <div className="p-2 sm:p-3">
        {renderTourSection(tours, "ourTours", "tours", "internal")}
        {renderTourSection(worldtour, "worldTours", "worldtour", "world")}
        {renderTourSection(medicaltour, "medicalTours", "medicaltour", "medical")}
      </div>
    </section>
  )
}

export default Tour
