import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dearfamLogo from "@/assets/image/dearfam_logo_icon.svg";

export function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 3초 후 LoginPage로 자동 이동
    const timer = setTimeout(() => {
      navigate('/LoginPage');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-app bg-bg-1 select-none">
      <div className="mobile-container flex flex-col items-center relative">
        {/* 로고 */}
        <div className="flex flex-col items-center mt-[8rem]">
          <img 
            src={dearfamLogo} 
            alt="Dearfam Logo" 
            className="w-32 h-32 animate-pulse mb-6"
          />
          <div className="text-center">
            <h1 className="text-h2 text-main-2 mb-2">DearFam</h1>
            <p className="text-body1 text-gray-3">가족과 함께하는 특별한 순간</p>
          </div>
        </div>
        
        {/* 로딩 애니메이션 */}
        <div className="mt-12 flex space-x-1">
          <div className="w-2 h-2 bg-main-2 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-main-2 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-main-2 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
} 