// Swap this out for real data from your backend API later.
export const providers = [
  {
    id: 1,
    name: "Service Provider 1",
    category: "Electrician",
    rating: 4.8,
    reviews: 132,
    phone: "+91 98765 43210",
    lat: 21.211,
    lng: 79.0682,
    description:
      "Certified electrician with 8+ years of experience in home wiring, repairs, and installations.",
    price: "₹300/hr",
    availability: [
      { date: "2026-09-13", slots: ["9:00 AM", "11:00 AM", "4:00 PM"] },
      { date: "2026-09-14", slots: ["10:00 AM", "2:00 PM"] },
      { date: "2026-09-16", slots: ["9:00 AM", "1:00 PM", "5:00 PM"] },
    ],
  },
  {
    id: 2,
    name: "Service Provider 2",
    category: "Plumber",
    rating: 4.6,
    reviews: 89,
    phone: "+91 98765 11122",
    lat: 21.1985,
    lng: 79.0689,
    description:
      "Experienced plumber specializing in leak repairs, pipe installation, and bathroom fittings.",
    price: "₹250/hr",
    availability: [
      { date: "2026-09-13", slots: ["8:00 AM", "12:00 PM"] },
      { date: "2026-09-15", slots: ["9:00 AM", "3:00 PM", "6:00 PM"] },
    ],
  },
  {
    id: 3,
    name: "Service Provider 3",
    category: "Carpenter",
    rating: 4.9,
    reviews: 204,
    phone: "+91 98765 99871",
    lat: 21.22,
    lng: 79.054,
    description:
      "Skilled carpenter offering custom furniture, repairs, and woodwork installations.",
    price: "₹400/hr",
    availability: [
      { date: "2026-09-14", slots: ["9:00 AM", "11:00 AM"] },
      { date: "2026-09-15", slots: ["10:00 AM", "1:00 PM", "4:00 PM"] },
      { date: "2026-09-17", slots: ["9:00 AM", "2:00 PM"] },
    ],
  },
];
