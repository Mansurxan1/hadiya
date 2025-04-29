"use client"

import type React from "react"
import { useTourStore } from "@z/tourStore"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion, useAnimation, type Variants } from "framer-motion"
import { FaStar, FaSpinner } from "react-icons/fa"
import { useInView } from "react-intersection-observer"
import Maps from "@/components/Maps"

interface Tour {
  id: string
  title: string
  description: string
  services: string
  separately: string
  information: string
  day: string
  price: number
  image: string
  visa?: string
}

interface ScrollAnimatedCardProps {
  children: React.ReactNode
  variants: Variants
  className?: string
}

const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

const ScrollAnimatedCard = ({ children, variants, className = "" }: ScrollAnimatedCardProps) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={variants} className={className}>
      {children}
    </motion.div>
  )
}

const TourDetail = () => {
  const { tours, worldtour, medicaltour } = useTourStore()
  const { t } = useTranslation()
  const [isMounted, setIsMounted] = useState(false)
  const params = useParams()
  const { type, id } = params

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "+998",
  })
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [type, id])
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isModalOpen])

  if (!isMounted) return null

  let tour: Tour | undefined
  let translationKey = ""

  if (type === "internal") {
    tour = tours.find((t) => t.id === id)
    translationKey = "tours"
  } else if (type === "world") {
    tour = worldtour.find((t) => t.id === id)
    translationKey = "worldtour"
  } else if (type === "medical") {
    tour = medicaltour.find((t) => t.id === id)
    translationKey = "medicaltour"
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-black to-gray-900 flex items-center justify-center">
        <h2 className="text-5xl md:text-6xl font-serif text-white font-light drop-shadow-md">{t("tourNotFound")}</h2>
      </div>
    )
  }

  const hotelStar = t(`${translationKey}.${tour.id}.hotelstar`)
  const starCount = hotelStar ? Number.parseInt(hotelStar, 10) : 0

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
  }

  const formatPhoneNumber = (digits: string) => {
    if (!digits) return "+998"
    const formatted = digits.match(/(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/)
    if (formatted) {
      return `+998 ${formatted[1]}${formatted[2] ? " " + formatted[2] : ""}${
        formatted[3] ? " " + formatted[3] : ""
      }${formatted[4] ? " " + formatted[4] : ""}`.trim()
    }
    return `+998 ${digits}`
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^[a-zA-Z\s\u0400-\u04FF]*$/.test(value)) {
      setFormData((prev) => ({ ...prev, fullName: value }))
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    const digits = value.startsWith("998") ? value.slice(3) : value
    if (digits.length <= 9) {
      setFormData((prev) => ({ ...prev, phone: formatPhoneNumber(digits) }))
    }
  }

  const validateForm = () => {
    const newErrors: { fullName?: string; phone?: string } = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = t("errors.fullName") || "Iltimos, ismingizni kiriting"
    }

    const phoneDigits = formData.phone.replace("+998", "").replace(/\s/g, "")
    if (!phoneDigits) {
      newErrors.phone = t("errors.phoneRequired") || "Iltimos, telefon raqamingizni kiriting"
    } else if (phoneDigits.length !== 9) {
      newErrors.phone = t("errors.phoneInvalid") || "Telefon raqami to'liq emas"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      setErrorMessage("")
      try {
        const tourName = t(`${translationKey}.${tour.id}.title`)

        const response = await fetch("/api/click", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tourId: tour.id,
            tourName,
            price: tour.price,
            userName: formData.fullName,
            userPhone: formData.phone,
          }),
        })

        const data = await response.json()

        if (data.success && data.redirectUrl) {
          console.log(`Переход к оплате тура ${tour.id} на сумму ${tour.price}`)

          if (data.orderId) {
            localStorage.setItem("lastOrderId", data.orderId)
          }

          window.location.href = data.redirectUrl
        } else {
          console.error("Ошибка при создании платежа:", data)
          setErrorMessage(data.error || t("paymentError") || "Ошибка при создании платежа")
        }
      } catch (error) {
        console.error("Error creating payment:", error)
        setErrorMessage(t("technicalError") || "Техническая ошибка, попробуйте позже")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <section
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/bg.jpeg')" }}
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
            className="w-full h-full transition-transform duration-500 hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-green-400 text-center px-6 tracking-wide drop-shadow-sm">
              {t(`${translationKey}.${tour.id}.title`)}
            </h1>
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-[1700px] mx-auto px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mb-4"
        >
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-br bg-[#333b3f] border border-white/20 text-white px-6 py-3 rounded-lg font-medium text-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-700 hover:scale-105"
          >
            {t("back")}
          </button>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-6">
          <ScrollAnimatedCard variants={cardVariants}>
            <motion.div
              className="text-white bg-gray-800/70 p-6 rounded-xl shadow-md h-full flex flex-col justify-between"
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-green-500">{t("price")}</h2>
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
                <h2 className="text-xl md:text-2xl font-semibold text-green-500">{t("day")}</h2>
                <p className="mt-2 text-lg md:text-xl font-medium">{t(`${translationKey}.${tour.id}.day`)}</p>
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
                  <h2 className="text-xl md:text-2xl font-semibold text-green-500">{t("visa")}</h2>
                  <p className="mt-2 text-lg md:text-xl font-medium">{t(`${translationKey}.${tour.id}.visa`)}</p>
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
                <h2 className="text-xl md:text-2xl font-semibold text-green-500">{t("separately")}</h2>
                <p className="mt-2 text-lg md:text-xl font-medium">{t(`${translationKey}.${tour.id}.separately`)}</p>
              </div>
            </motion.div>
          </ScrollAnimatedCard>

          <ScrollAnimatedCard variants={cardVariants}>
            <motion.div
              className="text-white bg-gray-800/70 p-6 rounded-xl shadow-md h-full flex flex-col justify-between"
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-green-500">{t("description")}</h2>
                <p className="mt-2 text-lg md:text-xl font-medium">{t(`${translationKey}.${tour.id}.description`)}</p>
              </div>
            </motion.div>
          </ScrollAnimatedCard>

          <ScrollAnimatedCard variants={cardVariants}>
            <motion.div
              className="text-white bg-gray-800/70 p-6 rounded-xl shadow-md h-full flex flex-col justify-between"
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-green-500">{t("tour_services")}</h2>
                <p className="mt-2 text-lg md:text-xl font-medium">{t(`${translationKey}.${tour.id}.services`)}</p>
              </div>
            </motion.div>
          </ScrollAnimatedCard>

          <ScrollAnimatedCard variants={cardVariants}>
            <motion.div
              className="text-white bg-gray-800/70 p-6 rounded-xl shadow-md h-full flex flex-col justify-between"
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-green-500">{t("information")}</h2>
                <p className="mt-2 text-lg md:text-xl font-medium">{t(`${translationKey}.${tour.id}.information`)}</p>
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
                  <h2 className="text-xl md:text-2xl font-semibold text-green-500">{t("hotel")}</h2>
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
        <div className="fixed inset-0 flex px-5 items-center justify-center bg-black bg-opacity-50 z-50">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-gray-700 p-6 rounded-xl shadow-lg max-w-md w-full"
          >
            <h2 className="text-xl font-semibold text-center text-green-500 mb-4">{t("orderDetails")}</h2>
            <div className="mb-6">
              <h3 className="text-base font-semibold text-white">
                <span className="font-bold text-xl text-green-600">{t("travel")}</span>{" "}
                {t(`${translationKey}.${tour.id}.title`)}
              </h3>
              <p className="text-xl font-bold text-green-600">
                {t("price")}{" "}
                <span className="text-white text-base font-normal">
                  {formatPrice(tour.price)} {t("uzs")}
                </span>
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                  {t("fullName")}
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleNameChange}
                  className="mt-1 block w-full p-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-700/30 outline-none border border-gray-600 rounded-md text-white placeholder-gray-400 placeholder:text-sm"
                  placeholder={t("fullNamePlaceholder") || "Ism va familiya"}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                  {t("phone")}
                </label>
                <input
                  type="text"
                  id="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="mt-1 block w-full p-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-700/30 outline-none border border-gray-600 rounded-md text-white"
                  placeholder="+998 99 999 99 99"
                  maxLength={17}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              {errorMessage && <p className="text-red-500 text-sm mt-3 text-center">{errorMessage}</p>}
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-all"
                >
                  {t("back")}
                </button>
                <button
                  type="submit"
                  className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all relative ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <FaSpinner className="animate-spin h-5 w-5 mr-2 text-white" />
                      {t("processing")}
                    </div>
                  ) : (
                    t("payWithClick") || "Click orqali to'lash"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      <Maps />
    </section>
  )
}

export default TourDetail
