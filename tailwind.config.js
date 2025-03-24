// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // Tailwind를 적용할 파일 경로
  theme: {
    extend: {
      colors: {
        logo: {
          orange: "#f28c46",
          green: "#689f72",
          purple: "#9894e6",
          red: "#c26a6a",
        },
        bg: {
          1: "#e5e1d7",
          2: "#ddd5bf",
          3: "#c0bdb5",
        },
        main: {
          1: "#f5751e",
          2: "#9a7a50",
          "2_80": "#a98f6b",
          3: "#9a9893",
        },
        "gray-1": "#000000",
        "gray-2": "#1f1f1f",
        "gray-3": "#828282",
        "gray-4": "#929292",
        "gray-5": "#d3d3d3",
        "gray-6": "#f8f8f8",
        "gray-7": "#ffffff",
        alert: "#D54D4D",
      },
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
      },
      fontSize: {
        // 화면 크기에 비례하여 조정되는 반응형 폰트 크기
        // clamp(최소값, 기본값, 최대값) 형식으로 설정
        h1: ["clamp(1.5rem, 5.13vw, 2rem)", { fontWeight: "700" }], // 32px, bold
        h2: ["clamp(1.25rem, 4.49vw, 1.75rem)", { fontWeight: "700" }], // 28px, bold
        h3: ["clamp(1.125rem, 3.85vw, 1.5rem)", { fontWeight: "700" }], // 24px, semibold
        h4: ["clamp(1rem, 3.21vw, 1.25rem)", { fontWeight: "700" }], // 20px, semibold
        h5: ["clamp(0.875rem, 2.56vw, 1rem)", { fontWeight: "700" }], // 16px, medium
        body1: ["clamp(1rem, 3.21vw, 1.25rem)", { fontWeight: "400" }], // 20px, regular
        body2: ["clamp(0.938rem, 2.88vw, 1.125rem)", { fontWeight: "400" }], // 18px, regular
        body3: ["clamp(0.875rem, 2.56vw, 1rem)", { fontWeight: "400" }], // 16px, regular
        caption1: ["clamp(0.625rem, 1.92vw, 0.75rem)", { fontWeight: "400" }], // 12px, regular
        caption2: ["clamp(0.438rem, 1.28vw, 0.5rem)", { fontWeight: "400" }], // 8px, regular
      },
      width: {
        app: "390px", // 웹뷰에서는 항상 100% 너비 사용
      },

      boxShadow: {
        soft: "0 0 20px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  darkMode: "class", // 다크 모드 설정
  plugins: [],
};
