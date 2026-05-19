/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "aniq.uz",
      "pohcdn.com",
      "m.ahstatic.com",
      "toping.uz",
      "travelsystem.uz",
      "www.borjomilikaniresort.com",
      "cdn.worldota.net",
      "res.cloudinary.com",
      "economymiddleeast.com",
      "static-maps.yandex.ru",
      "neuro.uz",
      "img.poehalisnami.uz"
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

