import axios from "../axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { FamilyData, FamilyApiResponse } from "./type";
import { queryKeys } from "../queryKeys";
import { useFamilyStore } from "@/context/store/familyStore";
import { useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// 전역 상태와 연동된 가족 정보 훅
export const useGetFamilyMembers = () => {
  const { familyData, isLoading, error, setFamilyData, setLoading, setError } =
    useFamilyStore();

  const query = useQuery({
    queryKey: queryKeys.family.members(),
    queryFn: async (): Promise<FamilyData> => {
      const response = await axios.get<FamilyApiResponse>(
        `${API_BASE_URL}/family/members`
      );
      console.log("가족 정보:", response.data);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5분간 신선
    gcTime: 10 * 60 * 1000, // 10분간 캐시
    retry: 3,
    refetchOnWindowFocus: false,
    enabled: true, // 항상 활성화하여 데이터가 없을 때 API 호출
  });

  // 쿼리 결과를 전역 상태와 동기화
  useEffect(() => {
    if (query.data && !familyData) {
      setFamilyData(query.data);
    }
    if (query.isLoading !== isLoading) {
      setLoading(query.isLoading);
    }
    if (query.error && !error) {
      setError(query.error.message);
    }
  }, [
    query.data,
    query.isLoading,
    query.error,
    familyData,
    isLoading,
    error,
    setFamilyData,
    setLoading,
    setError,
  ]);

  return {
    data: familyData || query.data,
    isLoading: isLoading || query.isLoading,
    error: error || query.error,
    refetch: query.refetch,
  };
};

// 전역 상태에서만 가족 정보를 가져오는 훅 (API 호출 없음)
export const useFamilyMembers = () => {
  const { familyData, isLoading, error } = useFamilyStore();

  return {
    data: familyData,
    isLoading,
    error,
  };
};
