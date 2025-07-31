// 가족 구성원 타입
export interface FamilyMember {
  familyMemberId: number;
  familyMemberNickname: string;
  familyMemberRole: string;
  familyMemberProfileImage: string;
}

// 가족 데이터 타입
export interface FamilyData {
  familyId: number;
  familyName: string;
  familyMembers: FamilyMember[];
}

// API 응답 타입
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 가족 API 응답 타입
export type FamilyApiResponse = ApiResponse<FamilyData>;

// 가족 구성원 역할 타입
export type FamilyRole = "FATHER" | "MOTHER" | "SON" | "DAUGHTER";
