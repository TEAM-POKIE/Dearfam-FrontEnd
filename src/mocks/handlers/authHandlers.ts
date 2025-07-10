import { http, HttpResponse } from "msw";
import { currentUser, generateMockUser } from "../data/mockData";
import { ApiResponse, User } from "../types";

// 카카오(소셜) 로그인 - POST /auth/oauth2/login
const kakaoLogin = http.post(
  "/api/v1/auth/oauth2/login",
  async ({ request }) => {
    console.log("🔥🔥🔥 MSW 핸들러 호출됨! 🔥🔥🔥");
    console.log("🎯 요청 URL:", request.url);
    console.log("🔑 요청 메서드:", request.method);

    try {
      const body = (await request.json()) as {
        provider: string;
        code: string;
        redirectUri?: string;
      };

      console.log('📦 요청 데이터:', body);

      // 카카오 제공자 확인
      if (body.provider !== "kakao") {
        console.log("❌ 지원하지 않는 제공자:", body.provider);
        return HttpResponse.json({
          success: false,
          message: "지원하지 않는 소셜 로그인 제공자입니다.",
          code: "UNSUPPORTED_PROVIDER",
        }, { status: 400 });
      }

      // 인증 코드 확인
      if (!body.code) {
        console.log("❌ 인증 코드 누락");
        return HttpResponse.json({
          success: false,
          message: "인증 코드가 필요합니다.",
          code: "MISSING_AUTH_CODE",
        }, { status: 400 });
      }

      // 모킹된 사용자 생성
      const user = generateMockUser({
        email: "mock_kakao_user@example.com",
        nickname: "카카오테스트",
      });

      console.log('✅ 모킹된 사용자 생성:', user);

      const accessToken = `mock_access_token_${Date.now()}`;
      const refreshToken = `mock_refresh_token_${Date.now()}`;

      const response = {
        success: true,
        data: {
          user,
          accessToken,
          refreshToken,
          isNewUser: true,
        },
        message: "🧪 MSW 모킹된 카카오 로그인이 성공적으로 완료되었습니다.",
      };

      console.log('🎉 MSW 응답 반환:', response);
      return HttpResponse.json(response);

    } catch (error) {
      console.error("❌ MSW 핸들러 오류:", error);
      return HttpResponse.json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      }, { status: 500 });
    }
  }
);

// 토큰 새로고침
const refreshToken = http.post("/api/v1/auth/refresh", async ({ request }) => {
  console.log("🔄 MSW: 토큰 새로고침 요청");
  
  const body = (await request.json()) as { refreshToken: string };

  if (!body.refreshToken || !body.refreshToken.startsWith("mock_refresh_token_")) {
    return HttpResponse.json({
      success: false,
      message: "유효하지 않은 refresh token입니다.",
      code: "INVALID_REFRESH_TOKEN",
    }, { status: 401 });
  }

  const newAccessToken = `mock_access_token_${Date.now()}`;
  const newRefreshToken = `mock_refresh_token_${Date.now()}`;

  return HttpResponse.json({
    success: true,
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
    message: "토큰이 성공적으로 갱신되었습니다.",
  });
});

// 로그아웃
const logout = http.post("/api/v1/auth/logout", () => {
  console.log("👋 MSW: 로그아웃 요청");
  
  return HttpResponse.json({
    success: true,
    data: { message: "로그아웃이 완료되었습니다." },
    message: "성공적으로 로그아웃되었습니다.",
  });
});

export const authHandlers = [kakaoLogin, refreshToken, logout];
