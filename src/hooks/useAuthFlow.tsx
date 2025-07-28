import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/context/store/authStore';
import { useCurrentUser } from '@/hooks/api/useUserAPI';
import { useFamilyMembers, familyQueryKeys } from '@/hooks/api/useFamilyAPI';
import { userQueryKeys } from '@/hooks/api/useUserAPI';
import { logEnvironmentStatus, isEnvironmentConfigured } from '@/utils/envUtils';

type AuthMode = 'yesfam' | 'nofam';

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
    // 이미 시작된 경우 중복 실행 방지
    if (authFlowStarted) {
      console.log('🔍 인증 플로우가 이미 시작되었습니다.');
      return;
    }

    setAuthFlowStarted(true);
    console.log('🔍 인증 플로우 시작 ===================');
    console.log('   → 모드:', mode === 'yesfam' ? '가족 검사 (1,2단계)' : '기본 검사 (1,2단계)');

    // 로그인 유무 검증 플로우
    const checkAuthStatus = async () => {
      try {
        // 환경 변수 상태 로깅 (개발 환경에서만)
        logEnvironmentStatus();
        
        // 환경 변수 검사
        if (!isEnvironmentConfigured()) {
          console.log('❌ 환경 변수 오류로 인한 인증 실패');
          completeAuthFlow(false);
          navigate('/LoginPage?error=env-config', { replace: true });
          return;
        }
        
        if (!accessToken) {
          // 토큰이 없으면 로그아웃 상태로 설정
          console.log('❌ 1단계 실패: 토큰이 없음');
          console.log('   → 로그인 페이지로 이동');
          completeAuthFlow(false);
          navigate('/LoginPage?error=no-token', { replace: true });
          return;
        }

        console.log('✅ 1단계 성공: 토큰 존재');
        console.log('   → 2단계 토큰 유효성 검사 시작');
        
        // 2단계 API 호출 시작 시점에 타임아웃 설정
        timeoutRef.current = setTimeout(() => {
          console.error('❌ 인증 타임아웃: 30초 내에 인증이 완료되지 않았습니다.');
          completeAuthFlow(false);
          navigate('/LoginPage?error=timeout', { replace: true });
        }, 30000);
        
        setStep1Completed(true); // 1단계 완료 표시
        
        // 2차 검증은 React Query가 자동으로 처리
        // useCurrentUser 훅이 step1Completed가 true일 때만 실행됨
        
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
        // 200 OK - 유저가 있음
        console.log('✅ 2단계 성공: 토큰 유효함 (사용자 정보 확인됨)');
        
        setUser(userData.data);
        
        // TanStack Query 캐시에 사용자 정보 저장
        queryClient.setQueryData(userQueryKeys.currentUser(), userData);
        console.log('   → 사용자 정보 캐시 저장 완료');
        
        if (mode === 'yesfam') {
          // 가족 검사 모드: familyId 필드로 가족 유무 판단
          console.log('   → 가족 정보 확인 시작 (familyId 필드 검사)');
          
          const familyId = userData.data.familyId;
          console.log('   → familyId:', familyId);
          
          if (familyId && familyId !== null && familyId !== undefined) {
            // 가족이 있음 - 가족 정보 조회 시작
            console.log('✅ 가족 검사 성공: 가족이 있음 (familyId 존재)');
            console.log('   → 가족 정보 조회 시작');
            setUserAuthenticated(true);
          } else {
            // 가족이 없음 - Start 페이지로 이동
            console.log('❌ 가족 검사 결과: 가족이 없음 (familyId 없음)');
            console.log('   → Start 페이지로 이동');
            completeAuthFlow(true); // 성공으로 처리 (가족이 없는 것은 정상)
            navigate('/Start?message=no-family', { replace: true });
          }
        } else {
          // 기본 검사 모드: 2단계까지만 검사하고 완료
          console.log('   → 2단계 검사 완료');
          completeAuthFlow(true);
        }
        
      } else if (userError) {
        // API 에러 처리
        console.log('❌ 2단계 실패: 토큰 유효하지 않음');
        console.log('   → 에러 타입:', typeof userError);
        console.log('   → 에러 메시지:', userError?.message);
        if (userError instanceof AxiosError) {
          console.log('   → 에러 상태:', userError.response?.status);
        }
        console.log('   → 로그인 페이지로 이동');
        
        completeAuthFlow(false);
        
        // 에러 타입에 따라 LoginPage로 이동
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
      // 가족 정보 조회 성공
      console.log('✅ 가족 정보 조회 성공');
      console.log('   → 가족 정보를 캐시에 저장');
      queryClient.setQueryData(familyQueryKeys.members(), familyData);
      console.log('   → 홈 페이지로 이동');
      completeAuthFlow(true);
      navigate('/home', { replace: true });
    } else if (mode === 'yesfam' && userAuthenticated && !familyLoading && familyError) {
      // 가족 정보 조회 실패
      console.log('❌ 가족 정보 조회 실패');
      console.log('   → 에러:', familyError);
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