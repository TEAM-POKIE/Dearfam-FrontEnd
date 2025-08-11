import axios from "../axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_URL;
import { useMutation } from "@tanstack/react-query";

interface RequestObject {
  actionPrompt: string;
}

interface AnimatePhotoRequest {
  request: RequestObject;
  image: File; // File 객체
}

interface AnimatePhotoSaveRequest {
  tempVideoUrl: string;
}

// Axios 응답 구조를 고려한 타입 정의
interface AnimatePhotoApiData {
  code: number;
  message: string;
  data: {
    animatePhotoId: number;
    animatePhotoTempUrl: string;
  };
}

interface AnimatePhotoResponse {
  data: AnimatePhotoApiData;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: Record<string, unknown>;
}

// File을 Base64 문자열로 변환하는 헬퍼 함수
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // "data:image/jpeg;base64," 부분을 제거하고 순수 Base64만 반환
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const usePostAnimatePhotoGenerate = () => {
  return useMutation<AnimatePhotoResponse, Error, AnimatePhotoRequest>({
    mutationKey: ["animate", "photo", "generate"],
    mutationFn: async ({ request, image }: AnimatePhotoRequest) => {
      const formData = new FormData();

      // JSON 객체를 문자열로 변환해서 추가
      // request 객체를 JSON 문자열로 추가
      formData.append(
        "request",
        new Blob([JSON.stringify(request)], {
          type: "application/json",
        })
      );

      // File 객체 직접 추가
      formData.append("image", image);

      // 디버깅을 위한 로깅
      console.log("=== FormData 요청 (File 사용) ===");
      console.log("request:", request);
      console.log("image File:", image);
      console.log("image name:", image.name);
      console.log("image size:", image.size);
      console.log("image type:", image.type);
      console.log("Access Token:", localStorage.getItem("accessToken"));
      console.log("API URL:", `${API_BASE_URL}/animate-photo/generate`);

      return axios.post(`${API_BASE_URL}/animate-photo/generate`, formData, {
        timeout: 300000,
      });
    },
  });
};

export const usePostAnimatePhotoSave = () => {
  return useMutation<AnimatePhotoResponse, Error, AnimatePhotoSaveRequest>({
    mutationKey: ["animate", "photo", "save"],
    mutationFn: async (request: AnimatePhotoSaveRequest) => {
      // API 스펙에 따라 JSON으로 전송
      console.log("=== AnimatePhotoSave API 호출 ===");
      console.log("Request:", request);
      console.log("tempVideoUrl:", request.tempVideoUrl);
      console.log("API URL:", `${API_BASE_URL}/animate-photo/save`);
      console.log("Access Token:", localStorage.getItem("accessToken"));

      return axios.post(
        `${API_BASE_URL}/animate-photo/save`,
        request, // JSON 객체로 직접 전송
        {
          timeout: 300000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    onSuccess: (data) => {
      console.log("AnimatePhotoSave Success:", data);
    },
    onError: (error) => {
      console.error("AnimatePhotoSave Error:", error);
    },
  });
};

// File을 Base64로 변환하는 유틸리티 함수 내보내기
export { fileToBase64 };

// 타입 내보내기
export type {
  AnimatePhotoRequest,
  AnimatePhotoSaveRequest,
  AnimatePhotoResponse,
  AnimatePhotoApiData,
  RequestObject,
};
