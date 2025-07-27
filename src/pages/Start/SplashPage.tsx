import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/context/store/authStore';
import { BasicLoading } from '@/components/BasicLoading';
import { useCurrentUser } from '@/hooks/api/useUserAPI';
import { useFamilyMembers } from '@/hooks/api/useFamilyAPI';
import { useQueryClient } from '@tanstack/react-query';
import { userQueryKeys } from '@/hooks/api/useUserAPI';
import { AxiosError } from 'axios';
import dearfamLogo from "../../assets/image/dearfam_logo_icon.svg";

export const SplashPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setUser, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [step1Completed, setStep1Completed] = useState(false); // 1단계 완료 상태 추가
  const queryClient = useQueryClient();
  
  // 1차: 로컬 스토리지에서 토큰 확인
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken'); // 저장은 되어있지만 현재 사용하지 않음
  
  // 2차: React Query를 사용하여 사용자 정보 조회 (1단계 완료 후에만 실행)
  const { data: userData, error: userError, isLoading: userLoading } = useCurrentUser(step1Completed);
  
  // 3차: 가족 유무 검사 (사용자 인증 성공 후에만 실행)
  const { data: familyData, error: familyError, isLoading: familyLoading } = useFamilyMembers(userAuthenticated);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('🔍 SplashPage 인증 플로우 시작 ===================');
        
        if (!accessToken) {
          // 토큰이 없으면 로그아웃 상태로 설정
          console.log('❌ 1단계 실패: 토큰이 없음');
          console.log('   → 로그인 페이지로 이동');
          logout();
          setIsLoading(false);
          return;
        }

        console.log('✅ 1단계 성공: 토큰 존재');
        console.log('   → 2단계 토큰 유효성 검사 시작');
        setStep1Completed(true); // 1단계 완료 표시
        
        // 2차 검증은 React Query가 자동으로 처리
        // useCurrentUser 훅이 step1Completed가 true일 때만 실행됨
        
      } catch (error) {
        console.error('❌ 인증 상태 확인 중 오류:', error);
        logout();
        setIsLoading(false);
      }
    };

    // 스플래시 화면 효과를 위한 지연
    setTimeout(() => {
      checkAuthStatus();
    }, 2000);
  }, [accessToken, logout]);

  // React Query 결과 처리
  useEffect(() => {
    if (!userLoading) {
      if (userData?.data) {
        // 200 OK - 유저가 있음
        console.log('✅ 2단계 성공: 토큰 유효함 (사용자 정보 확인됨)');
        console.log('   → 3단계 가족 유무 검사 시작');
        
        setUser(userData.data);
        setUserAuthenticated(true); // 사용자 인증 성공 표시
        
        // TanStack Query 캐시에 사용자 정보 저장
        queryClient.setQueryData(userQueryKeys.currentUser(), userData);
        console.log('   → 사용자 정보 캐시 저장 완료');
        
        // 가족 검사는 이제 userAuthenticated가 true가 되어서 자동으로 실행됨
      } else if (userError) {
        // API 에러 처리
        console.log('❌ 2단계 실패: 토큰 유효하지 않음');
        console.log('   → 에러 타입:', typeof userError);
        console.log('   → 에러 메시지:', userError?.message);
        if (userError instanceof AxiosError) {
          console.log('   → 에러 상태:', userError.response?.status);
        }
        console.log('   → 로그인 페이지로 이동');
        
        logout();
        setIsLoading(false);
        
        // 에러 타입에 따라 LoginPage로 이동
        if (userError instanceof AxiosError) {
          if (userError.response?.status === 401) {
            navigate('/LoginPage?error=token-invalid', { replace: true });
          } else if (userError.response?.status === 404) {
            navigate('/LoginPage?error=user-not-found', { replace: true });
          } else {
            navigate('/LoginPage?error=oauth-fail', { replace: true });
          }
        } else {
          navigate('/LoginPage?error=oauth-fail', { replace: true });
        }
      }
    }
  }, [userData, userError, userLoading, setUser, logout, queryClient, navigate]);

  // 가족 유무 검사 결과 처리
  useEffect(() => {
    if (!familyLoading && userAuthenticated && userData?.data) {
      if (familyData?.data && familyData.data.length > 0) {
        // 가족이 있음 - /home으로 이동
        console.log('✅ 3단계 성공: 가족이 있음');
        console.log('   → 가족 구성원 수:', familyData.data.length);
        console.log('   → /home으로 이동');
        navigate('/home', { replace: true });
      } else if (familyError || (familyData && !familyData.data)) {
        // 가족이 없음 (404) - /Start로 이동
        console.log('❌ 3단계 실패: 가족이 없음');
        console.log('   → 에러 타입:', typeof familyError);
        console.log('   → 에러 메시지:', familyError?.message);
        if (familyError instanceof AxiosError) {
          console.log('   → 에러 상태:', familyError.response?.status);
        }
        console.log('   → /Start로 이동');
        navigate('/Start', { replace: true });
      }
      setIsLoading(false);
      console.log('🔍 SplashPage 인증 플로우 완료 ===================');
    }
  }, [familyData, familyError, familyLoading, userAuthenticated, userData, navigate]);

  useEffect(() => {
    if (!isLoading && !userLoading && !familyLoading) {
      if (!isAuthenticated) {
        // 인증되지 않은 사용자는 로그인 페이지로
        navigate('/LoginPage', { replace: true });
      }
      // 인증된 사용자는 가족 검사 결과에 따라 이미 이동됨
    }
  }, [isAuthenticated, isLoading, userLoading, familyLoading, navigate]);

  return (
    <div className="flex justify-center items-center h-app bg-bg-1 select-none">
      <div className="mobile-container flex flex-col items-center relative">
        {/* 로고와 텍스트 */}
        <div className="flex flex-col items-center mt-[8rem] mb-[8rem]">
          <img src={dearfamLogo} alt="Dearfam Logo" className="w-32 h-32 mb-6" />
          <div className="text-center">
            <h1 className="text-h2 text-main-2 mb-2">DearFam</h1>
            <p className="text-body1 text-gray-3 mb-2">가족과 함께하는 특별한 순간</p>
          </div>
        </div>

        {/* 로딩 스피너 */}
        <div className="w-full flex flex-col gap-4 justify-center">
          <div className="mx-[1.25rem] flex justify-center">
            <BasicLoading text="" size={30} />
          </div>
        </div>
      </div>
    </div>
  );
}; 