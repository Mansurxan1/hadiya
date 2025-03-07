import { create } from "zustand";

interface Tour {
  id: string;
  title: string;
  description: string;
  day: string;
  price: number;
  image: string;
}

interface TourState {
  tours: Tour[];
}

export const useTourStore = create<TourState>(() => ({
  tours: [
    {
      id: "xiva",
      title: "",
      description: "",
      day: "",
      price: 1200000,
      image: "/xorazm.jpg",
    },
    {
      id: "samarkand",
      title: "",
      description: "",
      day: "",
      price: 350000,
      image: "/registan.jpg",
    },
    {
      id: "bukhara",
      title: "",
      description: "",
      day: "",
      price: 905000,
      image: "/buhoro.jpg",
    },
  ],
}));
