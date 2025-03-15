import { create } from "zustand";

interface Tour {
  id: string;
  title: string;
  description: string;
  services: string,
  separately: string,
  information: string,
  day: string;
  price: number;
  image: string;
}

interface TourState {
  tours: Tour[];
  worldtour: Tour[];
  medicaltour: Tour[];
}

export const useTourStore = create<TourState>((set) => ({
  tours: [
    {
      id: "xiva",
      title: "",
      description: "",
      day: "",
      services: "",
      separately: "",
      information: "",
      price: 1200000,
      image: "/xorazm.jpg",
    },
    {
      id: "samarkand",
      title: "",
      description: "",
      day: "",
      services: "",
      separately: "",
      information: "",
      price: 350000,
      image: "/registan.jpg",
    },
    {
      id: "bukhara",
      title: "",
      description: "",
      day: "",
      services: "",
      separately: "",
      information: "",
      price: 905000,
      image: "/buhoro.jpg",
    },  
  ],
  worldtour: [
    {
      id: "saudiya",
      title: "",
      description: "",
      services: "",
      separately: "",
      information: "",
      day: "",
      price: 12500000,
      image: "https://aniq.uz/photos/news/hIODMrZ9LP36eyJ.jpeg",
    },
    {
      id: "vietnam",
      title: "",
      description: "",
      services: "",
      separately: "",
      information: "",
      day: "",
      price: 7050000,
      image: "https://pohcdn.com/guide/sites/default/files/styles/paragraph__live_banner__lb_image__1880bp/public/live_banner/fukuok_0.jpg",
    },
    {
      id: "sharm",
      title: "",
      description: "",
      services: "",
      separately: "",
      information: "",
      day: "",
      price: 4200000,
      image: "https://toping.uz/storage/articles/8194/loL1QhNT2smSXk2eJjfQqHDp81q5Dnxs.webp",
    },
    {
      id: "doha",
      title: "",
      description: "",
      services: "",
      separately: "",
      information: "",
      day: "",
      price: 4250000,
      image: "https://m.ahstatic.com/is/image/accorhotels/aja_p_6406-55?qlt=82&wid=575&ts=1703085866299&dpr=on,2.625",
    },
    {
      id: "dubai",
      title: "",
      description: "",
      services: "",
      separately: "",
      information: "",
      day: "",
      price: 5670000,
      image: "https://res.cloudinary.com/dtljonz0f/image/upload/c_auto,ar_4:3,w_3840,g_auto/f_auto/q_auto/shutterstock_2414539851_ss_non-editorial_dcx0bm?_a=BAVARSAP0",
    },
    {
      id: "abudhabi",
      title: "",
      description: "",
      services: "",
      separately: "",
      information: "",
      day: "",
      price: 4450000,
      image: "https://economymiddleeast.com/wp-content/uploads/2024/02/places-to-visit-in-abu-dhabi-2.jpg",
    },
  ],
  medicaltour: [
    {
      id: "naftalan",
      title: "",
      description: "",
      services: "",
      separately: "",
      information: "",
      day: "",
      price: 8950000,
      image: "https://travelsystem.uz/wp-content/uploads/2022/03/Frame-16-720x606.jpg",
    },
    {
      id: "medical",
      title: "",
      description: "",
      services: "",
      separately: "",
      information: "",
      day: "",
      price: 12495000,
      image: "https://www.borjomilikaniresort.com/static/assets/local/about/hotel/5b12b43ca46a7a20dc689ea4.jpeg",
    },
  ],
}));