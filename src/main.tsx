import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// MSW 초기화 (개발 환경에서만, VITE_DISABLE_MSW가 false일 때)
if (import.meta.env.DEV && import.meta.env.VITE_DISABLE_MSW !== "true") {
  import("./mocks/browser").then(({ worker }) => {
    worker
      .start({
        onUnhandledRequest: "bypass", // 처리되지 않은 요청은 그대로 통과
      })
      .then(() => {
        console.log("🚀 MSW가 시작되었습니다!");
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
