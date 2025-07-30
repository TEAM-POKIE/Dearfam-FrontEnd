export type RecentMemoryPost = {
  postId: number;
  title: string;
  thumbnailUrl: string;
  imageCount: number;
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

export type TimeOrderMemoryPost = {
  code: number;
  message: string;
  data: {
    year: number;
    posts: {
      postId: number;
      memoryDate: string;
      thumbnailUrl: string;
    }[];
  }[];
};

export type MemoryDetail = {
  code: number;
  message: string;
  data: {
    writerId: number;
    title: string;
    content: string;
    memoryDate: string;
    liked: boolean;
    participants: {
      familyMemberId: number;
      nickname: string;
      profileImageUrl: string;
    }[];
    imageUrls: {
      imageUrl: string;
      imageOrder: number;
    }[];
    participantFamilyMember?: {
      familyMemberId: number;
      familyMemberNickname: string;
      familyMemberProfileImage: string | null;
      familyMemberRole: string;
    }[];
  };
};
