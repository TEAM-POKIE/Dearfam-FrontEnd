import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// MSW 초기화 (개발 환경에서만)
async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }

  console.log("🔧 개발 환경 감지 - MSW 초기화 시작...");

  try {
    // 기존 서비스 워커 정리
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log("🔍 기존 서비스 워커들:", registrations.length, "개");
    
    for (const registration of registrations) {
      if (registration.scope.includes('localhost:5173')) {
        console.log("🗑️ 기존 서비스 워커 제거:", registration.scope);
        await registration.unregister();
      }
    }

    // MSW 워커 동적 import
    const { worker } = await import("./mocks/browser");
    console.log("📦 MSW 워커 로드됨");

    // MSW 시작
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    });

    console.log("🚀 MSW가 성공적으로 시작되었습니다!");
    
    // 서비스 워커 등록 확인
    const newRegistrations = await navigator.serviceWorker.getRegistrations();
    console.log("✅ MSW 등록 후 서비스 워커들:", newRegistrations.length, "개");
    newRegistrations.forEach((reg, index) => {
      console.log(`📋 서비스 워커 ${index + 1}:`, reg.scope, reg.active?.scriptURL);
    });

  } catch (error) {
    console.error("❌ MSW 초기화 실패:", error);
  }
}

// MSW 초기화 후 React 앱 시작
enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
