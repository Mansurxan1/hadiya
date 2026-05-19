import type { NextConfig } from "next";

const remoteHosts = [
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
  "img.poehalisnami.uz",
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: remoteHosts.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};

export default nextConfig;
