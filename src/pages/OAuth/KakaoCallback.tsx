import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import dearfamLogo from '@/assets/image/dearfam_logo_icon.svg';

export const KakaoCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          console.error('카카오 인증 에러:', error);
          setError('카카오 인증이 취소되었습니다.');
          setTimeout(() => {
            navigate('/LoginPage?error=oauth-cancelled');
          }, 2000);
          return;
        }

        if (!code) {
          console.error('인가 코드가 없습니다.');
          setError('인가 코드를 받을 수 없습니다.');
          setTimeout(() => {
            navigate('/LoginPage?error=oauth-fail');
          }, 2000);
          return;
        }

        console.log('📋 카카오 인가 코드 받음:', code);

        // 백엔드 API 호출 (fetch 사용 - MSW 인터셉트용)
        const redirectUri = `${window.location.origin}/oauth/kakao/callback`;
        const requestData = {
          provider: 'kakao',
          code,
          redirectUri,
        };

        console.log('🚀 API 요청 시작:', requestData);
        console.log('🎯 요청 URL:', '/api/v1/auth/oauth2/login');

        const response = await fetch('/api/v1/auth/oauth2/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        console.log('📡 응답 상태:', response.status, response.statusText);
        console.log('📡 응답 헤더들:', Object.fromEntries(response.headers.entries()));

        const data = await response.json();
        console.log('📦 응답 데이터:', data);

        if (!response.ok) {
          console.error('❌ 백엔드 API 오류:', data);
          setError('로그인 처리 중 오류가 발생했습니다.');
          setTimeout(() => {
            navigate('/LoginPage?error=oauth-fail');
          }, 2000);
          return;
        }

        if (data.success && data.data) {
          const { accessToken, refreshToken, user } = data.data;
          
          // 토큰을 localStorage에도 저장 (axios 인터셉터에서 사용)
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          
          // zustand store에 로그인 정보 저장
          login(accessToken, refreshToken, user);

          console.log('✅ 카카오 로그인 성공:', user);
          
          // 성공 시 메인 페이지로 이동
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          console.error('❌ 로그인 응답 데이터 오류:', data);
          setError('로그인 데이터 처리 중 오류가 발생했습니다.');
          setTimeout(() => {
            navigate('/LoginPage?error=oauth-fail');
          }, 2000);
        }
      } catch (error: any) {
        console.error('❌ 카카오 로그인 처리 오류:', error);
        setError('네트워크 오류가 발생했습니다.');
        setTimeout(() => {
          navigate('/LoginPage?error=oauth-fail');
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="flex justify-center items-center h-app bg-bg-1 select-none">
      <div className="mobile-container flex flex-col items-center relative">
        <div className="flex flex-col items-center mt-[8rem]">
          <img 
            src={dearfamLogo} 
            alt="Dearfam Logo" 
            className="w-32 h-32 mb-8"
          />
          
          {isLoading && (
            <>
              <h2 className="text-h3 text-main-2 mb-4">로그인 처리 중...</h2>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-main-2 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-main-2 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-main-2 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </>
          )}
          
          {error && (
            <>
              <h2 className="text-h3 text-red-500 mb-4">로그인 오류</h2>
              <p className="text-body2 text-gray-3 text-center">{error}</p>
              <p className="text-body3 text-gray-4 mt-2">잠시 후 로그인 페이지로 이동합니다...</p>
            </>
          )}
          
          {!isLoading && !error && (
            <>
              <h2 className="text-h3 text-main-2 mb-4">로그인 성공!</h2>
              <p className="text-body2 text-gray-3">메인 페이지로 이동합니다...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 