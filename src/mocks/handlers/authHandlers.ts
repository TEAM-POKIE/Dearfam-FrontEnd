import { http, HttpResponse } from "msw";
import { currentUser, generateMockUser } from "../data/mockData";
import { ApiResponse, User } from "../types";

// 카카오(소셜) 로그인 - POST /auth/oauth2/login
const kakaoLogin = http.post(
  "/api/v1/auth/oauth2/login",
  async ({ request }) => {
    const body = (await request.json()) as {
      provider: string;
      code: string;
      redirectUri?: string;
    };

    // 카카오 로그인 시뮬레이션
    if (body.provider !== "kakao") {
      const errorResponse: ApiResponse = {
        success: false,
        message: "지원하지 않는 소셜 로그인 제공자입니다.",
        code: "UNSUPPORTED_PROVIDER",
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    // 인증 코드 검증 시뮬레이션
    if (!body.code) {
      const errorResponse: ApiResponse = {
        success: false,
        message: "인증 코드가 필요합니다.",
        code: "MISSING_AUTH_CODE",
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    // 성공적인 로그인 시뮬레이션
    const user =
      body.code === "existing_user"
        ? currentUser
        : generateMockUser({
            email: "kakao_user@example.com",
            nickname: "카카오 사용자",
          });

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
        isNewUser: body.code !== "existing_user",
      },
      message: "카카오 로그인이 성공적으로 완료되었습니다.",
    };

    return HttpResponse.json(response);
  }
);

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

export const authHandlers = [kakaoLogin, refreshToken, logout];
