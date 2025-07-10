import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// 개발 환경에서 fetch 직접 모킹
if (import.meta.env.DEV) {
  console.log("🔧 개발 환경 감지 - Fetch 모킹 시작...");
  
  // 원본 fetch 저장
  const originalFetch = window.fetch;
  
  // fetch 오버라이드
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = input instanceof Request ? input.url : input.toString();
    const method = init?.method || (input instanceof Request ? input.method : 'GET');
    
    console.log(`🌐 Fetch 요청: ${method} ${url}`);
    
    // 카카오 로그인 API 모킹
    if (url.includes('/api/v1/auth/oauth2/login') && method === 'POST') {
      console.log("🎯 카카오 로그인 API 요청 인터셉트!");
      
      try {
        const body = init?.body ? JSON.parse(init.body as string) : {};
        console.log("📦 요청 데이터:", body);
        
        // 모킹된 응답 생성
        const mockResponse = {
          success: true,
          data: {
            user: {
              id: `mock_user_${Date.now()}`,
              email: "mock_kakao_user@example.com",
              nickname: "카카오테스트",
              profileImage: "https://example.com/mock-profile.jpg"
            },
            accessToken: `mock_access_token_${Date.now()}`,
            refreshToken: `mock_refresh_token_${Date.now()}`,
            isNewUser: true
          },
          message: "🧪 Fetch 모킹된 카카오 로그인이 성공적으로 완료되었습니다."
        };
        
        console.log("✅ 모킹된 응답 반환:", mockResponse);
        
        // Response 객체 생성
        return new Response(JSON.stringify(mockResponse), {
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error("❌ 모킹 처리 중 오류:", error);
        return new Response(JSON.stringify({
          success: false,
          message: "모킹 처리 중 오류가 발생했습니다."
        }), {
          status: 500,
          statusText: 'Internal Server Error',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }
    
    // 기타 요청은 원본 fetch로 처리
    return originalFetch(input, init);
  };
  
  console.log("✅ Fetch 모킹이 활성화되었습니다!");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
