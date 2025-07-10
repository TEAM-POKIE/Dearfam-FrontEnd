import React from 'react';
import kakaoLoginImage from '@/assets/image/kakao/kakao_login_large_wide.png';

interface KakaoLoginButtonProps {
  className?: string;
}

export const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({ className = '' }) => {
  const handleKakaoLogin = () => {
    const clientId = import.meta.env.VITE_KAKAO_REST_KEY;
    const redirectUri = `${window.location.origin}/oauth/kakao/callback`;
    const responseType = 'code';
    const scope = 'account_email,profile_nickname';

    // 모킹 모드 체크 (환경변수가 없거나 'mock'인 경우)
    const isMockMode = !clientId || clientId === 'your_kakao_rest_api_key_here' || clientId === 'mock';

    if (isMockMode) {
      console.log('🧪 모킹 모드로 카카오 로그인 실행');
      // 모킹된 카카오 인증 페이지로 리디렉션
      const mockKakaoUrl = `/mock/kakao/auth?redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${scope}`;
      console.log('모킹된 카카오 인증 페이지로 이동:', mockKakaoUrl);
      window.location.href = mockKakaoUrl;
      return;
    }

    // 실제 카카오 OAuth 처리
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=${responseType}&scope=${scope}`;

    console.log('실제 카카오 OAuth로 리디렉션:', kakaoAuthUrl);
    window.location.href = kakaoAuthUrl;
  };

  return (
    <button
      onClick={handleKakaoLogin}
      className={`cursor-pointer transition-opacity hover:opacity-90 ${className}`}
      type="button"
    >
      <img
        src={kakaoLoginImage}
        alt="카카오 로그인"
        className="w-full h-auto"
      />
    </button>
  );
}; 