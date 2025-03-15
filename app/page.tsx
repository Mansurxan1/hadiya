"use client";

import { useEffect } from "react";
import AboutSection from "@/components/AboutSection";
import Banner from "@/components/Banner";
import Maps from "@/components/Maps";
import Partners from "@/components/Partners";
import ServicesSection from "@/components/ServicesSection";
import Tour from "@/components/Tour";
import Testimonials from "@/components/Testimonials";
import Visa from "@/components/Visa";

const Page = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <main
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: "url('/bg.jpeg')",
      }}
    >
      <div className="relative min-h-screen w-full bg-black/50">
        <Banner />
        <AboutSection />
        <Tour />
        <ServicesSection />
        <Visa />
        <Partners />
        <Testimonials />
        <Maps />
      </div>
    </main>
  );
};

export default Page;
