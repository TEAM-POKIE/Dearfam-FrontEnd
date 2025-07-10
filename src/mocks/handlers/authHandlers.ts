import { http, HttpResponse } from "msw";
import { currentUser, generateMockUser } from "../data/mockData";
import { ApiResponse, User } from "../types";

// 카카오(소셜) 로그인 - POST /auth/oauth2/login (여러 패턴으로 등록)
const kakaoLogin1 = http.post(
  "/api/v1/auth/oauth2/login",
  async ({ request }) => {
    console.log("🔥🔥🔥 MSW HANDLER 1 CALLED! (상대경로) 🔥🔥🔥");
    return handleKakaoLogin(request);
  }
);

const kakaoLogin2 = http.post(
  "http://localhost:5173/api/v1/auth/oauth2/login",
  async ({ request }) => {
    console.log("🔥🔥🔥 MSW HANDLER 2 CALLED! (절대경로) 🔥🔥🔥");
    return handleKakaoLogin(request);
  }
);

const kakaoLogin3 = http.post(
  "*/api/v1/auth/oauth2/login",
  async ({ request }) => {
    console.log("🔥🔥🔥 MSW HANDLER 3 CALLED! (와일드카드) 🔥🔥🔥");
    return handleKakaoLogin(request);
  }
);

// 실제 핸들러 로직
async function handleKakaoLogin(request: Request) {
  console.log("🎯 MSW: /api/v1/auth/oauth2/login 요청 인터셉트됨!");
  console.log("🔗 요청 URL:", request.url);
  console.log("🔑 요청 헤더들:", Object.fromEntries(request.headers.entries()));

  const body = (await request.json()) as {
    provider: string;
    code: string;
    redirectUri?: string;
  };

  console.log('🎭 MSW: 카카오 로그인 요청 받음:', body);

  // 카카오 로그인 시뮬레이션
  if (body.provider !== "kakao") {
    console.log("❌ MSW: 지원하지 않는 제공자:", body.provider);
    const errorResponse: ApiResponse = {
      success: false,
      message: "지원하지 않는 소셜 로그인 제공자입니다.",
      code: "UNSUPPORTED_PROVIDER",
    };
    return HttpResponse.json(errorResponse, { status: 400 });
  }

  // 인증 코드 검증 시뮬레이션
  if (!body.code) {
    console.log("❌ MSW: 인증 코드 누락");
    const errorResponse: ApiResponse = {
      success: false,
      message: "인증 코드가 필요합니다.",
      code: "MISSING_AUTH_CODE",
    };
    return HttpResponse.json(errorResponse, { status: 400 });
  }

  // 모킹된 인가 코드 처리
  const isMockCode = body.code.startsWith("mock_auth_code_");
  console.log("🧪 MSW: 모킹 코드 여부:", isMockCode, "코드:", body.code);
  
  // 성공적인 로그인 시뮬레이션
  let user: User;
  let isNewUser = false;

  if (isMockCode) {
    // 모킹 모드: 새로운 모킹 사용자 생성
    user = generateMockUser({
      email: "mock_kakao_user@example.com",
      nickname: "카카오테스트",
    });
    isNewUser = true;
    console.log('✅ MSW: 모킹된 카카오 사용자 생성:', user);
  } else if (body.code === "existing_user") {
    // 기존 사용자
    user = currentUser;
    isNewUser = false;
  } else {
    // 일반적인 새로운 사용자
    user = generateMockUser({
      email: "kakao_user@example.com",
      nickname: "카카오사용자",
    });
    isNewUser = true;
  }

  const accessToken = `mock_access_token_${Date.now()}`;
  const refreshToken = `mock_refresh_token_${Date.now()}`;

  const response: ApiResponse<{
    user: User;
    accessToken: string;
    refreshToken: string;
    isNewUser: boolean;
  }> = {
    success: true,
    data: {
      user,
      accessToken,
      refreshToken,
      isNewUser,
    },
    message: isMockCode 
      ? "🧪 모킹된 카카오 로그인이 성공적으로 완료되었습니다." 
      : "카카오 로그인이 성공적으로 완료되었습니다.",
  };

  console.log('🎉 MSW: 카카오 로그인 성공 응답 반환:', response);
  return HttpResponse.json(response);
}

// 토큰 새로고침 - POST /auth/refresh
const refreshToken = http.post("/api/v1/auth/refresh", async ({ request }) => {
  const body = (await request.json()) as { refreshToken: string };

  if (
    !body.refreshToken ||
    !body.refreshToken.startsWith("mock_refresh_token_")
  ) {
    const errorResponse: ApiResponse = {
      success: false,
      message: "유효하지 않은 refresh token입니다.",
      code: "INVALID_REFRESH_TOKEN",
    };
    return HttpResponse.json(errorResponse, { status: 401 });
  }

  const newAccessToken = `mock_access_token_${Date.now()}`;
  const newRefreshToken = `mock_refresh_token_${Date.now()}`;

  const response: ApiResponse<{
    accessToken: string;
    refreshToken: string;
  }> = {
    success: true,
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
    message: "토큰이 성공적으로 갱신되었습니다.",
  };

  return HttpResponse.json(response);
});

// 로그아웃 - POST /auth/logout
const logout = http.post("/api/v1/auth/logout", () => {
  const response: ApiResponse<{ message: string }> = {
    success: true,
    data: { message: "로그아웃이 완료되었습니다." },
    message: "성공적으로 로그아웃되었습니다.",
  };

  return HttpResponse.json(response);
});

export const authHandlers = [kakaoLogin1, kakaoLogin2, kakaoLogin3, refreshToken, logout];
