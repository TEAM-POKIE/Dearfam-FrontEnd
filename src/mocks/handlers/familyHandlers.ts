import { http, HttpResponse } from "msw";
import {
  mockFamilyMembers,
  currentFamily,
  generateMockFamily,
  generateMockFamilyMember,
  mockUsers,
} from "../data/mockData";
import { ApiResponse, Family, FamilyMember } from "../types";

// 가족 생성 - POST /family
const createFamily = http.post("/api/v1/family", async ({ request }) => {
  const body = (await request.json()) as { name: string };

  const newFamily = generateMockFamily({
    name: body.name,
  });

  const response: ApiResponse<Family> = {
    success: true,
    data: newFamily,
    message: "가족이 성공적으로 생성되었습니다.",
  };

  return HttpResponse.json(response, { status: 201 });
});

// 가족 내 역할 정하기 - POST /family/role
const setFamilyRole = http.post("/api/v1/family/role", async ({ request }) => {
  const body = (await request.json()) as { userId: string; role: string };

  const response: ApiResponse<{ userId: string; role: string }> = {
    success: true,
    data: {
      userId: body.userId,
      role: body.role,
    },
    message: "가족 역할이 성공적으로 설정되었습니다.",
  };

  return HttpResponse.json(response);
});

// 가족 ID를 통한 가족 구성원 리스트 조회 - GET /family/members/{familyId}
const getFamilyMembersByFamilyId = http.get(
  "/api/v1/family/members/:familyId",
  ({ params }) => {
    const { familyId } = params;

    // familyId에 따른 가족 구성원 반환
    const familyMembers = mockFamilyMembers.map((member) => ({
      ...member,
      id: `${familyId}-${member.id}`,
    }));

    const response: ApiResponse<FamilyMember[]> = {
      success: true,
      data: familyMembers,
      message: "가족 구성원 조회가 완료되었습니다.",
    };

    return HttpResponse.json(response);
  }
);

// 사용자의 가족 구성원 리스트 조회 - GET /family/members
const getFamilyMembers = http.get("/api/v1/family/members", ({ request }) => {
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return HttpResponse.json({ success: false, message: "인증 토큰이 필요합니다.", code: "UNAUTHORIZED" }, { status: 401 });
  }
  
  const token = authHeader.replace("Bearer ", "");
  
  // 특정 토큰에 따라 404 에러 반환 (가족이 없는 경우 시뮬레이션)
  if (token === "test-no-family-token") {
    return HttpResponse.json({ success: false, message: "가족을 찾을 수 없습니다.", code: "FAMILY_NOT_FOUND" }, { status: 404 });
  }
  
  // 정상적인 경우 가족 구성원 반환
  const response: ApiResponse<FamilyMember[]> = {
    success: true,
    data: mockFamilyMembers,
    message: "사용자의 가족 구성원 조회가 완료되었습니다.",
  };

  return HttpResponse.json(response);
});

// 가족 초대 링크 생성하기 - GET /family/generate-link
const generateFamilyInviteLink = http.get(
  "/api/v1/family/generate-link",
  () => {
    const inviteLink = `https://dearfam.com/invite/${currentFamily.familyCode}`;

    const response: ApiResponse<{ inviteLink: string; familyCode: string }> = {
      success: true,
      data: {
        inviteLink,
        familyCode: currentFamily.familyCode,
      },
      message: "가족 초대 링크가 생성되었습니다.",
    };

    return HttpResponse.json(response);
  }
);

// 가족 참여하기 - POST /family/join
const joinFamily = http.post("/api/v1/family/join", async ({ request }) => {
  const body = (await request.json()) as {
    familyCode: string;
    nickname?: string;
  };

  const newMember = generateMockFamilyMember({
    user: {
      ...mockUsers[0],
      nickname: body.nickname || mockUsers[0].nickname,
    },
  });

  const response: ApiResponse<FamilyMember> = {
    success: true,
    data: newMember,
    message: "가족에 성공적으로 참여했습니다.",
  };

  return HttpResponse.json(response);
});

export const familyHandlers = [
  createFamily,
  setFamilyRole,
  getFamilyMembersByFamilyId,
  getFamilyMembers,
  generateFamilyInviteLink,
  joinFamily,
];
