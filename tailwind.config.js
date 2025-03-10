/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: {
          1: "#F5751E", // 주황색
          2: "#9A7A50", // 갈색
          3: "#898989", // 회색
        },
        gray: {
          1: "#000000",
          2: "#1F1F1F",
          3: "#434343",
          4: "#656565",
          5: "#D6D6D6",
          6: "#F8F8F8",
          7: "#FFFFFF",
        },
        bg: {
          1: "#E5E1D7",
          2: "#DDD5BF",
          3: "#C0BDB5",
        },
      },
    },
  },
  safelist: [
    "text-main-1",
    "text-main-2",
    "text-main-3",
    "bg-main-1",
    "bg-main-2",
    "bg-main-3",
    "text-gray-1",
    "text-gray-2",
    "text-gray-3",
    "text-gray-4",
    "text-gray-5",
    "text-gray-6",
    "text-gray-7",
    "bg-gray-1",
    "bg-gray-2",
    "bg-gray-3",
    "bg-gray-4",
    "bg-gray-5",
    "bg-gray-6",
    "bg-gray-7",
    "bg-bg-1",
    "bg-bg-2",
    "bg-bg-3",
  ],
  plugins: [],
};
