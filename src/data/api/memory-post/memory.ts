import axios from "../axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_URL;
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useWritePostStore } from "@/context/store/writePostStore";
import { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";

export const useDeleteMemoryComment = () => {
  return useMutation({
    mutationFn: async ({
      postId,
      commentId,
    }: {
      postId: number;
      commentId: number;
    }) => {
      const response = await axios.delete(
        `${API_BASE_URL}/memory-post/${postId}/comment/${commentId}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("댓글 삭제 성공", data);
    },
    onError: (error) => {
      console.log("댓글 삭제 실패", error);
    },
  });
};

export const usePostMemoryComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["memory-post", "comment"],

    mutationFn: async ({
      postId,
      content,
    }: {
      postId: number;
      content: string;
    }) => {
      console.log(postId, content);
      const response = await axios.post(
        `${API_BASE_URL}/memory-post/${postId}/comment`,
        { content }
      );
      return { ...response.data, postId };
    },
    onSuccess: (data) => {
      console.log("댓글 생성 성공", data);
      // 해당 게시물 댓글 쿼리 무효화하여 최신 댓글 불러오기
      queryClient.invalidateQueries({
        queryKey: ["memory-post", "comment", data.postId],
      });
    },
    onError: (error) => {
      console.log("댓글 생성 실패", error);
    },
  });
};

export const useGetMemoryComment = (postId: number) => {
  return useQuery({
    queryKey: ["memory-post", "comment", postId],
    queryFn: async () => {
      const response = await axios.get(
        `${API_BASE_URL}/memory-post/${postId}/comment`
      );
      return response.data;
    },
    enabled: !!postId,
    staleTime: 0, // 항상 최신 데이터 확인
    gcTime: 1 * 60 * 1000, // 1분
  });
};

export const usePutLiked = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const response = await axios.put(
        `${API_BASE_URL}/memory-post/${postId}/like`
      );

      return response.data;
    },
    onSuccess: (data, postId) => {
      // 성공 시 모든 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["memory-post"] });
      // 특정 게시물의 상세 정보도 명시적으로 무효화
      queryClient.invalidateQueries({
        queryKey: ["memory-post", "detail", postId],
      });
    },
    onError: (error, postId) => {
      console.error(`좋아요 실패: postId ${postId}`, error);
    },
  });
};

export const useDeleteMemoryPost = () => {
  return useMutation({
    mutationFn: async (postId: number) => {
      const response = await axios.delete(
        `${API_BASE_URL}/memory-post/${postId}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("메모리 포스트 삭제 성공", data);
    },
    onError: (error) => {
      console.log("메모리 포스트 삭제 실패", error);
    },
  });
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
    staleTime: 0, // 항상 최신 데이터 확인
    gcTime: 1 * 60 * 1000, // 1분
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
    staleTime: 0, // 항상 최신 데이터 확인
    gcTime: 1 * 60 * 1000, // 1분
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
    staleTime: 0, // 항상 최신 데이터 확인
    gcTime: 5 * 60 * 1000, // 5분
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
        existingImages: getPostData().existingImages || [], // 기존 이미지 URL들 (순서 포함)
        removedExistingImages: getPostData().removedExistingImages || [], // 삭제된 기존 이미지 URL들
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

export const usePutMemoryPost = () => {
  const { getPostData } = useWritePostStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["memory-post", "put"],
    mutationFn: async (postId: number) => {
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

      console.log("수정할 데이터:", {
        postId,
        request: requestData,
        imageCount: postData.images?.length || 0,
      });

      return axiosInstance.put(
        `${API_BASE_URL}/memory-post/${postId}`,
        formData,
        {
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
        }
      );
    },
    onSuccess: (data, postId) => {
      console.log("메모리 포스트 수정 성공", data);
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["memory-post"] });
      queryClient.invalidateQueries({
        queryKey: ["memory-post", "detail", postId],
      });
      // 성공 시 이전 페이지로 이동
      setTimeout(() => {
        window.history.back();
      }, 100);
    },
    onError: (error: AxiosError) => {
      console.log("❌ 메모리 포스트 수정 실패");

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
