import React, { useRef } from 'react';
import kakaoLoginImage from '@/assets/image/kakao/kakao_login_large_wide.png';

interface KakaoLoginButtonProps {
  className?: string;
}

export const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({ className = '' }) => {
  const isProcessingRef = useRef(false);

  const handleKakaoLogin = () => {
    // 중복 클릭 방지
    if (isProcessingRef.current) {
      console.log('🔄 이미 로그인 처리 중입니다.');
      return;
    }

    isProcessingRef.current = true;
    const clientId = import.meta.env.VITE_KAKAO_REST_KEY;
    // 카카오 로그인 redirectURL 설정
    const redirectUri = `${window.location.origin}/kakao/callback`;
    const responseType = 'code';
    const scope = 'account_email,profile_nickname';
    const state = Math.random().toString(36).substring(2, 15); // CSRF 방지용 state

    console.log('1️⃣ 카카오 로그인 버튼 클릭됨');

    // 실제 카카오 OAuth 처리
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=${responseType}&scope=${scope}&state=${state}`;

    console.log('2️⃣ 실제 카카오 OAuth로 리디렉션');
    window.location.href = kakaoAuthUrl;
  };

  return (
    <button
      onClick={handleKakaoLogin}
      className={`cursor-pointer transition-opacity hover:opacity-90 flex justify-center items-center ${className}`}
      type="button"
    >
      <img
        src={kakaoLoginImage}
        alt="카카오 로그인"
        className="w-full h-auto object-contain"
      />
    </button>
  );
}; 