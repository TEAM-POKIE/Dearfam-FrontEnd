/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
    "border-gray-5",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // 메인 색상
        main: {
          1: "#F5751E", // 주황색
          2: "#9A7A50", // 갈색
          3: "#898989", // 회색
        },
        // 그레이 스케일
        gray: {
          1: "#000000", // 검정
          2: "#1F1F1F", // 진한 회색
          3: "#434343", // 중간 회색
          4: "#656565", // 밝은 회색
          5: "#D6D6D6", // 매우 밝은 회색
          6: "#F8F8F8", // 거의 흰색
          7: "#FFFFFF", // 흰색
        },
        // 배경 색상
        bg: {
          1: "#E5E1D7", // 밝은 베이지
          2: "#DDD5BF", // 중간 베이지
          3: "#C0BDB5", // 어두운 베이지
        },
        // 기존 shadcn UI 색상 (필요한 경우)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#F5751E",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#9A7A50",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#E5E1D7",
          foreground: "#434343",
        },
        accent: {
          DEFAULT: "#DDD5BF",
          foreground: "#000000",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
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
