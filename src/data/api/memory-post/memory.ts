import axios from "../axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_URL;
import { useMutation, useQuery } from "@tanstack/react-query";

import { useWritePostStore } from "@/context/store/writePostStore";
import { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";

export type MemoryPost = {
  postId: number;
  memoryDate: string;
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

export const useGetMemoryDetail = (postId: number | null) => {
  return useQuery({
    queryKey: ["memory-post", "detail", postId],
    queryFn: async () => {
      if (!postId) throw new Error("Post ID is required");
      const response = await axios.get(`${API_BASE_URL}/memory-post/${postId}`);
      return response.data;
    },
    enabled: !!postId,
  });
};

export const useGetMemoryTimeOrder = () => {
  return useQuery({
    queryKey: ["memory-post", "time-order"],
    queryFn: async () => {
      const response = await axios.get(
        `${API_BASE_URL}/memory-post/time-order`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
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

export const usePostMemoryPost = () => {
  const { getPostData } = useWritePostStore();

  return useMutation({
    mutationKey: ["memory-post", "post"],
    mutationFn: async () => {
      const postData = getPostData();
      const formData = new FormData();

      // request 객체를 JSON으로 구성
      const requestData = {
        title: postData.title,
        content: postData.content,
        memoryDate: postData.memoryDate,
        participantFamilyMemberIds: postData.participantFamilyMemberIds,
      };

      // request 객체를 JSON 문자열로 추가
      formData.append(
        "request",
        new Blob([JSON.stringify(requestData)], {
          type: "application/json",
        })
      );

      // 이미지 파일들을 images 배열로 추가
      if (postData.images && postData.images.length > 0) {
        postData.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      console.log("전송할 데이터:", {
        request: requestData,
        imageCount: postData.images?.length || 0,
      });

      return axiosInstance.post(`${API_BASE_URL}/memory-post`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30초로 타임아웃 연장 (파일 업로드용)
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`업로드 진행률: ${percentCompleted}%`);
          }
        },
      });
    },
    onSuccess: (data) => {
      console.log("메모리 포스트 생성 성공", data);
    },
    onError: (error: AxiosError) => {
      console.log("❌ 메모리 포스트 생성 실패");

      if (error.response) {
        console.log("📦 응답 상태 코드:", error.response.status);
        console.log("📨 백엔드 응답 메시지:", error.response);
      } else if (error.request) {
        console.log("🕸 요청은 갔지만 응답 없음", error.request);
      } else {
        console.log("⚠️ 요청 생성 중 에러", error.response);
      }
    },
  });
};
