import axios from "../axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_URL;
import { useMutation } from "@tanstack/react-query";

export const usePostDiaryGenerate = () => {
  return useMutation({
    mutationKey: ["diary", "generate"],
    mutationFn: (postId: number) =>
      axios.post(`${API_BASE_URL}/diary/generate`, { postId }),
  });
};
