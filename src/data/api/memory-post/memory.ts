import axios from "../axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_URL;
import { useQuery } from "@tanstack/react-query";

export type MemoryPost = {
  postId: number;
  memoryDate: string;
};

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

// POST 응답 타입
export type PostMemoryPostResponse = {
  code: number;
  message: string;
  data: {
    postId: number;
    title: string;
    content: string;
    memoryDate: string;
    createdAt: string;
  };
};

export type MemoryGroupByYear = {
  year: number;
  posts: MemoryPost[];
};

export type GetAllMemoryPostsResponse = {
  code: number;
  message: string;
  data: MemoryGroupByYear[];
};

export type GetRecentMemoryPostsResponse = {
  code: number;
  message: string;
  data: RecentMemoryPost[];
};

export const getAllMemoryPostsByTimeOrder =
  async (): Promise<GetAllMemoryPostsResponse> => {
    const res = await axios.get("/memory-post/time-order");
    return res.data;
  };

// 최근 메모리 포스트 가져오기

// 메모리 포스트 생성 (FormData 사용 - 이미지 포함)
export const postMemoryPost = async (
  data: PostMemoryPostRequest
): Promise<PostMemoryPostResponse> => {
  const formData = new FormData();

  // 기본 데이터 추가
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("memoryDate", data.memoryDate);

  // 참여자 ID 배열 추가
  data.participantFamilyMemberIds.forEach((id, index) => {
    formData.append(`participantFamilyMemberIds[${index}]`, id.toString());
  });

  // 이미지 파일들 추가
  if (data.images && data.images.length > 0) {
    data.images.forEach((file) => {
      formData.append(`images`, file);
    });
  }

  console.log("📤 POST 요청 데이터:", {
    title: data.title,
    content: data.content,
    memoryDate: data.memoryDate,
    participantFamilyMemberIds: data.participantFamilyMemberIds,
    imageCount: data.images?.length || 0,
  });

  const response = await axios.post(`${API_BASE_URL}/memory-post`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("✅ POST 응답:", response.data);
  return response.data;
};

export const getMemoryPostById = async () => {
  const res = await axios.get(`${API_BASE_URL}/memory-post`);
  return res.data;
};

export const useGetMemoryRecentPosts = () => {
  return useQuery({
    queryKey: ["memory-post", "recent"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/memory-post/recent`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
};
