"use client"

import { useEffect, Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslation } from "react-i18next"

const LoadingModal = () => {
  const { t } = useTranslation()
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="max-w-[600px] w-full bg-white rounded-3xl shadow-2xl p-10 text-center transform transition-all duration-500 hover:scale-105">
        <div className="w-20 h-20 bg-gradient-to-br from-green-300 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">{t("loading")}</h2>
      </div>
    </div>
  )
}

const SuccessModalContent = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'pending' | 'failed' | 'unknown'>('unknown')
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    const transactionId = searchParams.get("transaction_id")
    const orderId = searchParams.get("merchant_trans_id") || localStorage.getItem('lastOrderId')
    const errorCode = searchParams.get("error")

    const checkPaymentStatus = async () => {
      try {
        if (errorCode) {
          setPaymentStatus('failed')
          const details = {
            orderId: orderId || t("unknown"),
            errorCode,
            date: new Date().toLocaleString()
          }
          setOrderDetails(details)
        } else if (transactionId && orderId) {
          setPaymentStatus('success')
          const details = {
            orderId,
            transactionId,
            date: new Date().toLocaleString()
          }
          setOrderDetails(details)
          localStorage.setItem('lastOrderDetails', JSON.stringify(details))
        } else if (orderId) {
          setPaymentStatus('pending')
          const details = {
            orderId,
            date: new Date().toLocaleString()
          }
          setOrderDetails(details)
        } else {
          setPaymentStatus('unknown')
        }
      } catch (error) {
        console.error("To'lov holatini tekshirishda xatolik:", error)
        setPaymentStatus('unknown')
      }
    }

    const sendNotification = async () => {
      try {
        let message = ''
        if (paymentStatus === 'success') {
          message = `${t("payment_successful")}\n🆔 ${t("order_id")}: ${orderId}\n🆔 ${t("transaction_id")}: ${transactionId}`
        } else if (paymentStatus === 'failed') {
          message = `${t("payment_failed")}\n🆔 ${t("order_id")}: ${orderId}\n${t("error_code")}: ${errorCode}`
        }

        await fetch("/api/telegram/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        })
      } catch (error) {
        console.error("Xabar yuborishda xatolik:", error)
      }
    }

    checkPaymentStatus()
    if (paymentStatus !== 'unknown') {
      sendNotification()
    }
    
    localStorage.removeItem('lastOrderId')
  }, [searchParams, paymentStatus, t])

  const handleGoHome = () => {
    router.push("/")
    onClose()
  }

  const handleRetryPayment = () => {
    router.push("/payment")
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 bg-opacity-90 z-50 p-6">
      <div className="max-w-[600px] w-full bg-white rounded-3xl shadow-2xl p-8 text-center transform transition-all duration-700 hover:scale-105 relative overflow-hidden border border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-transparent to-green-50 opacity-30 pointer-events-none"></div>

        <h2 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-600 drop-shadow-lg">
          📢 {t("payment_process")}
        </h2>

        <p className="text-gray-700 mb-6 text-lg font-light tracking-wide leading-relaxed">
          {t("payment_message")}
        </p>

        <a
          href="tel:+998970383833"
          className="inline-flex items-center justify-center mb-8 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold text-lg rounded-full shadow-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          +998 97 038 38 33
        </a>

        {orderDetails && (
          <div className="bg-gray-50 p-4 rounded-xl mb-6 text-left shadow-inner border border-gray-100">
            <p className="text-sm text-gray-600"><strong>{t("order_id")}:</strong> {orderDetails.orderId}</p>
            {orderDetails.transactionId && <p className="text-sm text-gray-600"><strong>{t("transaction_id")}:</strong> {orderDetails.transactionId}</p>}
            {orderDetails.errorCode && <p className="text-sm text-gray-600"><strong>{t("error_code")}:</strong> {orderDetails.errorCode}</p>}
            <p className="text-sm text-gray-600"><strong>{t("date")}:</strong> {orderDetails.date}</p>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          {paymentStatus === 'failed' && (
            <button
              onClick={handleRetryPayment}
              className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-3 rounded-full hover:from-red-600 hover:to-red-800 transition-all duration-300 font-semibold text-lg shadow-lg transform hover:-translate-y-1 hover:shadow-xl"
            >
              {t("retry_payment")}
            </button>
          )}
          <button
            onClick={handleGoHome}
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-full hover:from-green-600 hover:to-teal-700 transition-all duration-300 font-semibold text-lg shadow-lg transform hover:-translate-y-1 hover:shadow-xl"
          >
            {t("back_to_home")}
          </button>
        </div>
      </div>
    </div>
  )
}

const PaymentSuccessModal = () => {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Suspense fallback={<LoadingModal />}>
      {isOpen && <SuccessModalContent onClose={handleClose} />}
    </Suspense>
  )
}

export default PaymentSuccessModal

const customStyles = `
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }
`