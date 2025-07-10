import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

console.log("🔧 MSW 핸들러들 로드됨:", handlers);
console.log("📊 총 핸들러 개수:", handlers.length);

// 각 핸들러 정보 출력
handlers.forEach((handler, index) => {
  console.log(`📋 핸들러 ${index + 1}:`, handler);
});

export const worker = setupWorker(...handlers);

console.log("⚙️ MSW 워커 생성됨:", worker);
