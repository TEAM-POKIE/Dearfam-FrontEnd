import { useNavigate, useSearchParams } from "react-router-dom";
import dearfamLogo from "../../assets/image/dearfam_logo_icon.svg";
import { BasicButton } from "../../components/BasicButton";
import { KakaoLoginButton } from "../../components/KakaoLoginButton";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/context/store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, logout } = useAuthStore();

  const handleGuestLogin = () => {
    // TODO: 게스트 로그인 또는 체험하기 기능
    console.log("게스트 로그인 버튼 클릭");
    navigate('/StartPage');
  };

  return (
    <div className="flex justify-center items-center h-app bg-bg-1 select-none">
      <div className="mobile-container flex flex-col items-center relative">
        {/* 로고와 텍스트 */}
        <div className="flex flex-col items-center mt-[8rem] mb-[8rem]">
          <img src={dearfamLogo} alt="Dearfam Logo" className="w-32 h-32 mb-6" />
          <div className="text-center">
            <h1 className="text-h2 text-main-2 mb-2">DearFam</h1>
            <p className="text-body1 text-gray-3 mb-2">가족과 함께하는 특별한 순간</p>
            <p className="text-body2 text-gray-4">로그인하여 가족 페이지를 시작해보세요</p>
          </div>
        </div>

        {/* 로그인 버튼들 */}
        <div className="w-full flex flex-col gap-4 justify-center">
          {/* 카카오 로그인 버튼 */}
          <div className="mx-[1.25rem]">
            <KakaoLoginButton className="w-[350px]" />
          </div>
        </div>

        {/* 하단 텍스트 */}
        <div className="mt-4 text-center">
          <p className="text-body3 text-gray-4">
            로그인 시 <span className="text-main-2">개인정보처리방침</span> 및 <span className="text-main-2">이용약관</span>에 동의하게 됩니다.
          </p>
        </div>

        {/* 작은 버튼들 */}
        <div className="mt-4 flex flex-row items-center justify-center gap-2">
          <button 
            onClick={handleGuestLogin}
            className="px-4 py-2 text-body3 text-gray-3 bg-gray-5 rounded-lg hover:bg-gray-4 transition-colors"
          >
            둘러보기
          </button>
        </div>
      </div>
    </div>
  );
} 