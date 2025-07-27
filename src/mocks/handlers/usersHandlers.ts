import { http, HttpResponse } from "msw";
import { currentUser, findUserById } from "../data/mockData";
import { ApiResponse, User } from "../types";

// 현재 사용자 정보 조회 - GET /users/user
const getCurrentUser = http.get("/api/v1/users/user", ({ request }) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return HttpResponse.json({ success: false, message: "인증 토큰이 필요합니다.", code: "UNAUTHORIZED" }, { status: 401 });
  }
  const token = authHeader.replace("Bearer ", "");
  if (!token || token === "invalid-token") {
    return HttpResponse.json({ success: false, message: "유효하지 않은 토큰입니다.", code: "INVALID_TOKEN" }, { status: 401 });
  }
  if (token === "test-404-token") {
    return HttpResponse.json({ success: false, message: "사용자를 찾을 수 없습니다.", code: "USER_NOT_FOUND" }, { status: 404 });
  }
  
  // 정상 응답 (백엔드 형식)
  const response: ApiResponse<User> = {
    code: 1073741824,
    message: "사용자 정보 조회 성공",
    data: {
      id: 9007199254740991,
      familyId: 9007199254740991,
      userNickname: "테스트 사용자",
      userRole: "USER",
      userFamilyRole: "FATHER",
      isFamilyRoomManager: true,
      profileImage: "https://via.placeholder.com/150",
    },
  };
  return HttpResponse.json(response);
});

// id로 사용자 정보 조회 - GET /users/{userId}
const getUserById = http.get("/api/v1/users/:userId", ({ params }) => {
  const { userId } = params;
  const user = findUserById(userId as string);

  if (!user) {
    const errorResponse: ApiResponse = {
      success: false,
      message: "사용자를 찾을 수 없습니다.",
      code: "USER_NOT_FOUND",
    };
    return HttpResponse.json(errorResponse, { status: 404 });
  }

  const response: ApiResponse<User> = {
    success: true,
    data: user,
    message: "사용자 정보 조회가 완료되었습니다.",
  };

  return HttpResponse.json(response);
});

// 사용자 이름 변경(닉네임 변경) - PUT /users/nickname
const updateUserNickname = http.put(
  "/api/v1/users/nickname",
  async ({ request }) => {
    const body = (await request.json()) as { nickname: string };

    const updatedUser: User = {
      ...currentUser,
      nickname: body.nickname,
      updatedAt: new Date().toISOString(),
    };

    const response: ApiResponse<User> = {
      success: true,
      data: updatedUser,
      message: "닉네임이 성공적으로 변경되었습니다.",
    };

    return HttpResponse.json(response);
  }
);

export const usersHandlers = [getCurrentUser, getUserById, updateUserNickname];
