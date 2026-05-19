import uz from "./locales/uz.json";
import ru from "./locales/ru.json";
import en from "./locales/en.json";
import { type SeoLang } from "./seo";

const locales: Record<SeoLang, any> = { uz, ru, en };

export const TYPE_KEY: Record<string, string> = {
  internal: "tours",
  world: "worldtour",
  medical: "medicaltour",
};

interface StaticTour {
  id: string;
  price: number;
  image: string;
}

export const STATIC_TOURS: Record<string, StaticTour[]> = {
  internal: [
    { id: "xiva", price: 1200000, image: "/xorazm.jpg" },
    { id: "samarkand", price: 350000, image: "/registan.jpg" },
    { id: "bukhara", price: 905000, image: "/buhoro.jpg" },
  ],
  world: [
    {
      id: "vietnam",
      price: 7050000,
      image:
        "https://pohcdn.com/guide/sites/default/files/styles/paragraph__live_banner__lb_image__1880bp/public/live_banner/fukuok_0.jpg",
    },
    {
      id: "sharm",
      price: 4200000,
      image:
        "https://img.poehalisnami.uz/static/hotels/egipet/sharm-el-shejjkh/h74746/orig/booking74746_174746_638693856915620978.jpg",
    },
    {
      id: "doha",
      price: 4250000,
      image:
        "https://m.ahstatic.com/is/image/accorhotels/aja_p_6406-55?qlt=82&wid=575&ts=1703085866299&dpr=on,2.625",
    },
    {
      id: "dubai",
      price: 5670000,
      image:
        "https://res.cloudinary.com/dtljonz0f/image/upload/c_auto,ar_4:3,w_3840,g_auto/f_auto/q_auto/shutterstock_2414539851_ss_non-editorial_dcx0bm?_a=BAVARSAP0",
    },
    {
      id: "abudhabi",
      price: 4450000,
      image:
        "https://economymiddleeast.com/wp-content/uploads/2024/02/places-to-visit-in-abu-dhabi-2.jpg",
    },
  ],
  medical: [
    {
      id: "naftalan",
      price: 8950000,
      image:
        "https://travelsystem.uz/wp-content/uploads/2022/03/Frame-16-720x606.jpg",
    },
    {
      id: "medical",
      price: 12495000,
      image:
        "https://www.borjomilikaniresort.com/static/assets/local/about/hotel/5b12b43ca46a7a20dc689ea4.jpeg",
    },
  ],
};

export interface TourFull {
  id: string;
  type: string;
  price: number;
  image: string;
  title: string;
  description: string;
  services: string;
  separately: string;
  information: string;
  day: string;
  visa?: string;
  hotel?: string;
  hotelStar: number;
}

export interface TourLabels {
  price: string;
  day: string;
  visa: string;
  separately: string;
  description: string;
  tour_services: string;
  information: string;
  hotel: string;
  back: string;
  buy: string;
  uzs: string;
  travel: string;
  tourNotFound: string;
}

export function getLabels(lang: SeoLang): TourLabels {
  const l = locales[lang] || locales.uz;
  return {
    price: l.price,
    day: l.day,
    visa: l.visa,
    separately: l.separately,
    description: l.description,
    tour_services: l.tour_services,
    information: l.information,
    hotel: l.hotel,
    back: l.back,
    buy: l.buy,
    uzs: l.uzs,
    travel: l.travel,
    tourNotFound: l.tourNotFound,
  };
}

export function getTourFull(
  lang: SeoLang,
  type: string,
  id: string
): TourFull | null {
  const key = TYPE_KEY[type];
  const stat = STATIC_TOURS[type]?.find((s) => s.id === id);
  const txt = key ? locales[lang]?.[key]?.[id] : undefined;
  if (!stat || !txt) return null;

  const hotelStar = txt.hotelstar ? parseInt(txt.hotelstar, 10) || 0 : 0;

  return {
    id,
    type,
    price: stat.price,
    image: stat.image,
    title: txt.title || "",
    description: txt.description || "",
    services: txt.services || "",
    separately: txt.separately || "",
    information: txt.information || "",
    day: txt.day || "",
    visa: txt.visa,
    hotel: txt.hotel,
    hotelStar,
  };
}

export function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
