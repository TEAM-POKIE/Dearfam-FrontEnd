import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

console.log("🔧 MSW 브라우저 워커 설정 중...");
console.log("📊 총 핸들러 개수:", handlers.length);

// 각 핸들러 확인
handlers.forEach((handler, index) => {
  // handler 정보 출력
  console.log(`📋 핸들러 ${index + 1}:`, handler);
});

export const worker = setupWorker(...handlers);

console.log("⚙️ MSW 워커 생성 완료:", worker);
