import type { NextPage } from 'next';
import { CheckCircle, PhoneCall } from 'lucide-react';

const Visa: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-7">
      <div className="max-w-[1400px] w-full space-y-12">
        {/* Saudiya Viza Xizmati */}
        <div className="relative bg-gray-800/50 border border-white/40 rounded-xl shadow-lg p-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2" />
          <h2 className="text-3xl font-bold text-center mb-8 text-green-500">Saudiya Viza Xizmati</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg p-4 bg-gray-800/50 transition-colors duration-300">
              <h3 className="text-xl font-semibold mb-4 text-green-500">Turistlik Viza</h3>
              <ul className="space-y-3 text-white">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-400 w-5 h-5" /> 1 yil amal qiladi
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-400 w-5 h-5" /> 90 kungacha qolish
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-400 w-5 h-5" /> Ko‘p marta kirish
                </li>
                <li className="text-green-400 text-lg font-bold">Narxi: 135$</li>
              </ul>
            </div>

            <div className="rounded-lg p-4 bg-gray-800/50 transition-colors duration-300">
              <h3 className="text-xl font-semibold mb-4 text-green-500">Umra Viza</h3>
              <ul className="space-y-3 text-white">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-400 w-5 h-5" /> 1 yil amal qiladi
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-400 w-5 h-5" /> Bir marta kirish
                </li>
                <li className="text-green-400 text-lg font-bold">Narxi: 155$</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg font-medium text-green-400">Biz bilan bog‘laning:</p>
            <a
              href="tel:+998970383833"
              className="inline-flex items-center gap-2 text-white mt-1 bg-green-500 p-2 rounded-lg text-xl font-semibold hover:text-white/80 transition-colors duration-200"
            >
              <PhoneCall className="w-6 h-6" /> +998 97 038-38-33
            </a>
          </div>
        </div>

        {/* Hindiston Viza Xizmatlari */}
        <div className="relative bg-gray-800/50 border border-white/40 rounded-xl shadow-lg p-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2" />
          <h2 className="text-3xl font-bold text-center mb-8 text-green-500">Hindiston Viza Xizmatlari</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg p-4 bg-gray-800/50 transition-colors duration-300">
              <h3 className="text-xl font-semibold mb-4 text-green-500">Sayohat Vizasi</h3>
              <ul className="space-y-3 text-white">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-400 w-5 h-5" /> 30 kunlik sayohat viza
                  <span className="ml-2 text-green-400 font-bold">$50</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-400 w-5 h-5" /> 1 yillik sayohat e-viza
                  <span className="ml-2 text-green-400 font-bold">$70</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg p-4 bg-gray-800/50 transition-colors duration-300">
              <h3 className="text-xl font-semibold mb-4 text-green-500">Tibbiy Viza</h3>
              <ul className="space-y-3 text-white">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-400 w-5 h-5" /> 60 kunlik tibbiy e-viza
                  <span className="ml-2 text-green-400 font-bold">$120</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg font-medium text-green-400">Biz bilan bog‘laning:</p>
            <a
              href="tel:+998970383833"
              className="inline-flex items-center gap-2 text-white mt-1 bg-green-500 p-2 rounded-lg text-xl font-semibold hover:text-white/80 transition-colors duration-200"
            >
              <PhoneCall className="w-6 h-6" /> +998 97 038-38-33
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visa;