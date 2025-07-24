import { http, HttpResponse } from "msw";
import { ApiResponse } from "../types";

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

export const authHandlers = [refreshToken, logout];
