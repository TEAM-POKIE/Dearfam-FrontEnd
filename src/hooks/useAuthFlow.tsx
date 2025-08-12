import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/context/store/authStore';
import { useCurrentUser } from '@/hooks/api/useUserAPI';
import { useFamilyMembers, familyQueryKeys } from '@/hooks/api/useFamilyAPI';
import { userQueryKeys } from '@/hooks/api/useUserAPI';


// 환경 변수 설정 확인 함수
const isEnvironmentConfigured = (): boolean => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const kakaoKey = import.meta.env.VITE_KAKAO_REST_KEY;
  
  return !!(apiUrl && kakaoKey);
};

export const useAuthFlow = (mode: 'yesfam' | 'nofam' = 'nofam') => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser, logout } = useAuthStore();
  const accessToken = localStorage.getItem('accessToken');

  const [isChecking, setIsChecking] = useState(false);
  const [authFlowStarted, setAuthFlowStarted] = useState(false);
  const [step1Completed, setStep1Completed] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  
  // 타임아웃 타이머를 ref로 관리
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // TanStack Query 훅들 - 사용자 정보만 조회
  const { data: userData, error: userError, isLoading: userLoading } = useCurrentUser(step1Completed);

  // 가족 정보 조회 (가족이 있는 경우에만)
  const shouldFetchFamily = mode === 'yesfam' && userAuthenticated && !!userData?.data?.familyId;
  const { data: familyData, error: familyError, isLoading: familyLoading } = useFamilyMembers(shouldFetchFamily);

  // 타임아웃 정리 함수
  const clearAuthTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // 인증 플로우 완료 함수 (타임아웃 정리 포함)
  const completeAuthFlow = (success: boolean = true) => {
    clearAuthTimeout();
    setIsChecking(false);
    setAuthFlowStarted(false);
    if (!success) {
      logout();
    }
  };

  const startAuthFlow = () => {
    if (authFlowStarted) {
      return;
    }

    setAuthFlowStarted(true);

    const checkAuthStatus = async () => {
      try {
        // logEnvironmentStatus(); // Removed as per edit hint
        
        if (!isEnvironmentConfigured()) {
          completeAuthFlow(false);
          navigate('/LoginPage?error=env-config', { replace: true });
          return;
        }
        
        if (!accessToken) {
          completeAuthFlow(false);
          navigate('/LoginPage?error=no-token', { replace: true });
          return;
        }

        timeoutRef.current = setTimeout(() => {
          completeAuthFlow(false);
          navigate('/LoginPage?error=timeout', { replace: true });
        }, 30000);
        
        setStep1Completed(true);
        
      } catch (error) {
        console.error('❌ 인증 상태 확인 중 오류:', error);
        completeAuthFlow(false);
        navigate('/LoginPage?error=unknown', { replace: true });
      }
    };

    checkAuthStatus();
  };

  // React Query 결과 처리 (2단계 + 가족 검사)
  useEffect(() => {
    if (!userLoading && step1Completed) {
      if (userData?.data) {
        setUser(userData.data);
        queryClient.setQueryData(userQueryKeys.currentUser(), userData);
        
        if (mode === 'yesfam') {
          const familyId = userData.data.familyId;
          
          if (familyId && familyId !== null && familyId !== undefined) {
            setUserAuthenticated(true);
          } else {
            completeAuthFlow(true);
            navigate('/Start?message=no-family', { replace: true });
          }
        } else {
          completeAuthFlow(true);
        }
        
      } else if (userError) {
        completeAuthFlow(false);
        
        if (userError instanceof AxiosError) {
          if (userError.code === 'ECONNABORTED' || userError.message.includes('timeout')) {
            navigate('/LoginPage?error=timeout', { replace: true });
          } else if (userError.response?.status === 401) {
            navigate('/LoginPage?error=token-invalid', { replace: true });
          } else if (userError.response?.status === 404) {
            navigate('/LoginPage?error=user-not-found', { replace: true });
          } else if (userError.code === 'ERR_NETWORK') {
            navigate('/LoginPage?error=network-error', { replace: true });
          } else {
            navigate('/LoginPage?error=token-validation-failed', { replace: true });
          }
        } else {
          navigate('/LoginPage?error=token-validation-failed', { replace: true });
        }
      }
    }
  }, [userData, userError, userLoading, step1Completed, mode, setUser, logout, queryClient, navigate]);

  // 가족 정보 조회 결과 처리
  useEffect(() => {
    if (mode === 'yesfam' && userAuthenticated && !familyLoading && familyData?.data) {
      queryClient.setQueryData(familyQueryKeys.members(), familyData);
      completeAuthFlow(true);
      navigate('/home', { replace: true });
    } else if (mode === 'yesfam' && userAuthenticated && !familyLoading && familyError) {
      completeAuthFlow(false);
      navigate('/LoginPage?error=network-error', { replace: true });
    }
  }, [familyData, familyError, familyLoading, userAuthenticated, mode, queryClient, navigate]);

  // 컴포넌트 언마운트 시 타임아웃 정리
  useEffect(() => {
    return () => {
      clearAuthTimeout();
    };
  }, []);

  return {
    isChecking,
    userLoading,
    familyLoading,
    startAuthFlow,
  };
}; 