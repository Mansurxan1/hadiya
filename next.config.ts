/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static-maps.yandex.ru",
        port: "",
        pathname: "/1.x/**",
      },
      {
        protocol: "https",
        hostname: "waterparktenerife.com",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "neuro.uz",
        port: "",
        pathname: "/storage/uploads/post/large/**",
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;

  // eslint: {
  //   ignoreDuringBuilds: true,
  // },