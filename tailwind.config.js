/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
        heading: ["Pretendard", "sans-serif"],
        body: ["Pretendard", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        h1: ["32pt", { fontWeight: "700" }],
        h2: ["28pt", { fontWeight: "700" }],
        h3: ["24pt", { fontWeight: "700" }],
        h4: ["20pt", { fontWeight: "700" }],
        h5: ["16pt", { fontWeight: "700" }],
        body1: ["20pt", { fontWeight: "400" }],
        body2: ["16pt", { fontWeight: "400" }],
        body3: ["14pt", { fontWeight: "400" }],
        caption2: ["12pt", { fontWeight: "400" }],
        caption3: ["8pt", { fontWeight: "400" }],
      },
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
    "font-pretendard",
    "font-heading",
    "font-body",
    "font-mono",
    "text-h1",
    "text-h2",
    "text-h3",
    "text-h4",
    "text-h5",
    "text-body1",
    "text-body2",
    "text-body3",
    "text-caption2",
    "text-caption3",
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
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".text-main-1": { color: "#F5751E" },
        ".text-main-2": { color: "#9A7A50" },
        ".text-main-3": { color: "#898989" },
        ".bg-main-1": { backgroundColor: "#F5751E" },
        ".bg-main-2": { backgroundColor: "#9A7A50" },
        ".bg-main-3": { backgroundColor: "#898989" },
      };
      addUtilities(newUtilities);
    },
  ],
};
