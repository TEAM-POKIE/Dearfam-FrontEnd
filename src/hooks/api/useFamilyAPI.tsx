import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, FamilyMember, FamilyMembersResponse, FamilyCreateResponse } from "../../mocks/types";
import axiosInstance from "../../data/api/axiosInstance";

// API 기본 URL - 환경변수 사용
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Query Keys
export const familyQueryKeys = {
  all: ["family"] as const,
  members: () => [...familyQueryKeys.all, "members"] as const,
  membersByFamilyId: (familyId: string) => [...familyQueryKeys.all, "members", familyId] as const,
  inviteLink: () => [...familyQueryKeys.all, "invite-link"] as const,
} as const;

// API 함수들
export const familyAPI = {
  // 가족 생성
  createFamily: async (data: {
    familyName: string;
  }): Promise<ApiResponse<FamilyCreateResponse>> => {
    const response = await axiosInstance.post(`${API_BASE_URL}/family`, data);
    return response.data;
  },

  // 가족 역할 설정
  setFamilyRole: async (data: {
    familyRole: string;
  }): Promise<ApiResponse<{ userId: string; role: string }>> => {
    const response = await axiosInstance.post(`${API_BASE_URL}/family/role`, data);
    return response.data;
  },

  // 가족 구성원 조회 (GET /family/members)
  getFamilyMembers: async (): Promise<ApiResponse<FamilyMembersResponse>> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/family/members`);
    return response.data;
  },

  // 가족 ID로 구성원 조회
  getFamilyMembersByFamilyId: async (
    familyId: string
  ): Promise<ApiResponse<FamilyMember[]>> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/family/members/${familyId}`);
    return response.data;
  },

  // 가족 초대 링크 생성
  generateInviteLink: async (): Promise<
    ApiResponse<{ inviteLink: string; familyCode: string }>
  > => {
    const response = await axiosInstance.get(`${API_BASE_URL}/family/generate-link`);
    return response.data;
  },

  // 가족 참여
  joinFamily: async (data: {
    familyCode: string;
    nickname?: string;
  }): Promise<ApiResponse<FamilyMember>> => {
    const response = await axiosInstance.post(`${API_BASE_URL}/family/join`, data);
    return response.data;
  },
};

// React Query 훅들

// 가족 구성원 조회 (GET /family/members)
export const useFamilyMembers = (enabled: boolean = false) => {
  const accessToken = localStorage.getItem('accessToken');
  
  return useQuery({
    queryKey: familyQueryKeys.members(),
    queryFn: familyAPI.getFamilyMembers,
    enabled: !!accessToken && enabled, // 토큰이 있고 enabled가 true일 때만 실행
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: false, // 404 에러 시 재시도하지 않음
    retryDelay: 1000, // 재시도 간격
    retryOnMount: false, // 마운트 시 재시도 비활성화
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 비활성화
    refetchOnReconnect: false, // 네트워크 재연결 시 재요청 비활성화
  });
};

// 가족 ID로 구성원 조회
export const useFamilyMembersByFamilyId = (familyId: string) => {
  return useQuery({
    queryKey: familyQueryKeys.membersByFamilyId(familyId),
    queryFn: () => familyAPI.getFamilyMembersByFamilyId(familyId),
    enabled: !!familyId, // familyId가 있을 때만 실행
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 가족 초대 링크 조회
export const useFamilyInviteLink = () => {
  return useQuery({
    queryKey: familyQueryKeys.inviteLink(),
    queryFn: familyAPI.generateInviteLink,
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 15 * 60 * 1000, // 15분
  });
};

// 가족 생성 뮤테이션
export const useCreateFamily = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: familyAPI.createFamily,
    retry: false, // 재시도 비활성화 - 409 에러 시 중복 요청 방지
    onSuccess: (data) => {
      // 성공 시 가족 정보를 캐시에 저장
      if (data.data) {
        // 가족 생성 응답을 가족 구성원 조회 응답 형태로 변환하여 캐시에 저장
        const familyMembersResponse = {
          familyId: data.data.id,
          familyName: data.data.familyName,
          familyMembers: [] // 가족 생성 시에는 구성원 정보가 없으므로 빈 배열
        };
        
        queryClient.setQueryData(familyQueryKeys.members(), {
          success: true,
          data: familyMembersResponse,
          message: "가족 생성 성공",
          code: "200"
        });
      }
      
      // 가족 관련 모든 캐시 무효화
      queryClient.invalidateQueries({ queryKey: familyQueryKeys.all });
    },
    onError: (error) => {
      console.error("가족 생성 실패:", error);
    },
  });
};

// 가족 역할 설정 뮤테이션
export const useSetFamilyRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: familyAPI.setFamilyRole,
    retry: false, // 재시도 비활성화 - 에러 시 중복 요청 방지
    onSuccess: () => {
      // 성공 시 가족 구성원 캐시 무효화
      queryClient.invalidateQueries({ queryKey: familyQueryKeys.members() });
      // 성공 로그는 컴포넌트에서 처리하므로 여기서는 제거
    },
    onError: (error) => {
      console.error("가족 역할 설정 실패:", error);
    },
  });
};

// 가족 참여 뮤테이션
export const useJoinFamily = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: familyAPI.joinFamily,
    retry: false, // 재시도 비활성화 - 에러 시 중복 요청 방지
    onSuccess: (data) => {
      // 성공 시 가족 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: familyQueryKeys.all });
      console.log("가족 참여 성공:", data);
    },
    onError: (error) => {
      console.error("가족 참여 실패:", error);
    },
  });
};
