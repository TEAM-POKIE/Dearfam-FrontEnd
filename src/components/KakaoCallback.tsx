import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../context/store/authStore';
import dearfamLogo from '@/assets/image/dearfam_logo_icon.svg';
import { BasicLoading } from './BasicLoading';
import { useKakaoLogin } from '@/hooks/api/useAuthAPI';
import { AuthGuard } from './AuthGuard';

export const KakaoCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isKakaoLoginComplete, setIsKakaoLoginComplete] = useState(false);
  const isProcessingRef = useRef(false);
  const processedCodeRef = useRef<string | null>(null);

  // TanStack Query 카카오 로그인 뮤테이션
  const kakaoLoginMutation = useKakaoLogin();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const state = searchParams.get('state');

      // 에러가 있으면 즉시 리다이렉트
      if (error) {
        console.error('❌ 카카오 인증 에러:', error);
        navigate('/LoginPage?error=oauth-cancelled', { replace: true });
        return;
      }

      // 코드가 없으면 즉시 리다이렉트 (보안 강화)
      if (!code) {
        console.log('❌ KakaoCallback: 인가 코드 없음 - 강제 접근 차단');
        navigate('/LoginPage?error=invalid-access', { replace: true });
        return;
      }

      // 이미 처리된 코드인지 확인
      if (processedCodeRef.current === code) {
        return;
      }

      // 중복 실행 방지
      if (isProcessingRef.current) {
        return;
      }

      isProcessingRef.current = true;
      processedCodeRef.current = code;

      try {
        // TanStack Query 뮤테이션 실행
        const redirectUri = `${window.location.origin}/kakao/callback`;
        const result = await kakaoLoginMutation.mutateAsync({
          code,
          redirectUri,
        });

        setIsKakaoLoginComplete(true);
        
      } catch (error: any) {
        console.error('❌ 카카오 로그인 실패:', error);
        navigate('/LoginPage?error=oauth-fail', { replace: true });
      } finally {
        setIsLoading(false);
        isProcessingRef.current = false;
      }
    };

    // 코드가 있을 때만 실행
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (code || error) {
      handleCallback();
    } else {
      // 유효하지 않은 접근 시 즉시 리다이렉트 (보안 강화)
      console.log('❌ KakaoCallback: 유효하지 않은 접근 - 즉시 차단');
      navigate('/LoginPage?error=invalid-access', { replace: true });
    }
  }, [searchParams, navigate, login, kakaoLoginMutation]);

  // 카카오 로그인 처리 중일 때 로딩 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-app bg-bg-1 select-none">
        <div className="mobile-container flex flex-col items-center relative">
          {/* 로고와 텍스트 */}
          <div className="flex flex-col items-center mt-[8rem] mb-[8rem]">
            <img src={dearfamLogo} alt="Dearfam Logo" className="w-32 h-32 mb-6" />
            <div className="text-center">
              <h1 className="text-h2 text-main-2 mb-2">DearFam</h1>
              <p className="text-body1 text-gray-3 mb-2">카카오 로그인 처리 중...</p>
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
  }

  // 카카오 로그인이 완료되면 AuthGuard를 통해 인증 플로우 실행
  if (isKakaoLoginComplete) {
    return (
      <AuthGuard mode="yesfam">
        <div className="flex justify-center items-center h-app bg-bg-1 select-none">
          <div className="mobile-container flex flex-col items-center relative">
            {/* 로고와 텍스트 */}
            <div className="flex flex-col items-center mt-[8rem] mb-[8rem]">
              <img src={dearfamLogo} alt="Dearfam Logo" className="w-32 h-32 mb-6" />
              <div className="text-center">
                <h1 className="text-h2 text-main-2 mb-2">DearFam</h1>
                <p className="text-body1 text-gray-3 mb-2">로그인 성공! 인증 상태를 확인하고 있습니다...</p>
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
      </AuthGuard>
    );
  }

  return null;
}; 
