import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { validateEnvironmentVariables } from "./utils/validation";
import { performanceMonitor, analyzeBundleSize } from "./utils/performance";

// 환경 변수 검증
try {
  validateEnvironmentVariables();
} catch (error) {
  console.error('❌ Environment validation failed:', error);
  // 개발 환경에서는 경고만 표시하고 계속 진행
  if (import.meta.env.PROD) {
    document.body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: system-ui;">
        <div style="text-align: center; color: #dc2626;">
          <h1>Configuration Error</h1>
          <p>Please check your environment variables.</p>
        </div>
      </div>
    `;
    throw error;
  }
}

// MSW 초기화 (개발 환경에서만, VITE_DISABLE_MSW가 false일 때)
if (import.meta.env.DEV && import.meta.env.VITE_DISABLE_MSW !== "true") {
  try {
    import("./mocks/browser").then(({ worker }) => {
      worker
        .start({
          onUnhandledRequest: "bypass", // 처리되지 않은 요청은 그대로 통과
        })
        .then(() => {
          console.log("🚀 MSW가 시작되었습니다!");
        })
        .catch((error) => {
          console.warn("MSW 시작 실패:", error);
        });
    }).catch((error) => {
      console.warn("MSW 모듈 로드 실패:", error);
    });
  } catch (error) {
    console.warn("MSW 초기화 실패:", error);
  }
}

// 성능 모니터링 시작
if (import.meta.env.PROD) {
  analyzeBundleSize();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// 앱 언마운트 시 정리 작업
window.addEventListener('beforeunload', () => {
  performanceMonitor.cleanup();
});