export type RecentMemoryPost = {
  postId: number;
  title: string;
  content: string;
  commentCount: number;
  memoryDate: string;
  participants: {
    familyMemberId: number;
    nickname: string;
  }[];
  liked: boolean;
  images?: string[]; // 이미지 속성 추가
};

// POST 요청을 위한 타입 정의 (API 스키마에 맞춰서)
export type PostMemoryPostRequest = {
  title: string;
  content: string;
  memoryDate: string; // YYYY-MM-DD 형식
  participantFamilyMemberIds: number[];
  images?: File[]; // 파일 배열
};
