"use client";

import AboutSection from "@/components/AboutSection";
import Banner from "@/components/Banner";
import Maps from "@/components/Maps";
import Partners from "@/components/Partners";
import ServicesSection from "@/components/ServicesSection";
import Tour from "@/components/Tour";
import React, { useEffect } from "react";
import Testimonials from "@/components/Testimonials";
import Visa from "@/components/Visa";

const Page = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); 

  return (
    <main
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: "url('/bg.jpg')",
      }}
    >
      <div className="relative min-h-screen w-full bg-black/40">
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