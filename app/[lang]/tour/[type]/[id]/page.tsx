import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Maps from "@/components/Maps";
import BookingWidget from "./BookingWidget";
import {
  SITE_URL,
  normalizeLang,
  getTourSeo,
  tourTripSchema,
} from "@/I18n/seo";
import { getTourFull, getLabels, formatPrice } from "@/I18n/tours";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; type: string; id: string }>;
}): Promise<Metadata> {
  const { lang: raw, type, id } = await params;
  const lang = normalizeLang(raw);
  const seo = getTourSeo(lang, type, id);
  const path = `/${lang}/tour/${type}/${id}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: path,
      languages: {
        uz: `/uz/tour/${type}/${id}`,
        ru: `/ru/tour/${type}/${id}`,
        en: `/en/tour/${type}/${id}`,
        "x-default": `/uz/tour/${type}/${id}`,
      },
    },
    robots: seo.exists ? undefined : { index: false },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${SITE_URL}${path}`,
      siteName: "Hadiya Travel",
      type: "website",
      images: [{ url: "/logo.png", alt: "Hadiya Travel" }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/logo.png"],
    },
  };
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ lang: string; type: string; id: string }>;
}) {
  const { lang: raw, type, id } = await params;
  const lang = normalizeLang(raw);
  const labels = getLabels(lang);
  const tour = getTourFull(lang, type, id);

  if (!tour) {
    redirect(`/${lang}`);
  }

  const seo = getTourSeo(lang, type, id);

  const Card = ({
    heading,
    children,
  }: {
    heading: string;
    children: React.ReactNode;
  }) => (
    <div className="text-white bg-sky-800/70 p-6 rounded-xl shadow-md h-full flex flex-col justify-between">
      <div>
        <h2 className="text-xl md:text-2xl font-semibold">{heading}</h2>
        <p className="mt-2 text-lg md:text-xl font-medium">{children}</p>
      </div>
    </div>
  );

  return (
    <section
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/bg.jpeg')" }}
    >
      {seo.exists && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(tourTripSchema(lang, type, id, seo)),
          }}
        />
      )}

      <div className="relative w-full h-[50vh] md:h-[70vh] lg:h-screen overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-sky-500 text-center px-6 tracking-wide drop-shadow-sm">
            {tour.title}
          </h1>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto px-5 py-10">
        <div className="mb-4">
          <Link
            href={`/${lang}`}
            className="inline-block bg-sky-500/70 text-white px-6 py-3 rounded-lg font-medium text-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            {labels.back}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card heading={labels.price}>
            {formatPrice(tour.price)} {labels.uzs}
          </Card>
          <Card heading={labels.day}>{tour.day}</Card>
          {type !== "internal" && tour.visa && (
            <Card heading={labels.visa}>{tour.visa}</Card>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {tour.separately && (
            <Card heading={labels.separately}>{tour.separately}</Card>
          )}
          {tour.description && (
            <Card heading={labels.description}>{tour.description}</Card>
          )}
          {tour.services && (
            <Card heading={labels.tour_services}>{tour.services}</Card>
          )}
          {tour.information && (
            <Card heading={labels.information}>{tour.information}</Card>
          )}
          {type !== "internal" && tour.hotel && (
            <div className="text-white bg-sky-800/70 p-3 rounded-xl shadow-md">
              <h2 className="text-xl md:text-2xl font-semibold">
                {labels.hotel}
              </h2>
              <p className="mt-2 text-lg md:text-xl font-medium flex items-center gap-2">
                {tour.hotel}
                {tour.hotelStar > 0 && (
                  <span className="text-yellow-400">
                    {"★".repeat(tour.hotelStar)}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        <BookingWidget
          tourId={tour.id}
          tourName={tour.title}
          price={tour.price}
          lang={lang}
        />
      </div>

      <Maps />
    </section>
  );
}
