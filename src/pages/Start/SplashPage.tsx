import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dearfamLogo from "../../assets/image/dearfam_logo_icon.svg";
import { BasicLoading } from "@/components/BasicLoading";
import { useAuthStore } from "@/context/store/authStore";

export function SplashPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 토큰 확인
    const checkAuthStatus = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        
        // 토큰이 있으면 인증된 것으로 간주
        if (accessToken && refreshToken) {
          // 여기서 실제 토큰 유효성 검증 API 호출 가능
          // 현재는 토큰 존재 여부만 확인
          useAuthStore.getState().setUser({
            id: '1',
            name: '사용자',
            email: 'user@example.com',
            profileImage: null,
          });
        } else {
          // 토큰이 없으면 로그아웃 상태로 설정
          useAuthStore.getState().logout();
        }
      } catch (error) {
        console.error('인증 상태 확인 중 오류:', error);
        useAuthStore.getState().logout();
      } finally {
        setIsChecking(false);
      }
    };

    // 3초 후 인증 상태 확인 시작
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isChecking) {
      // 0.5초 후 적절한 페이지로 리다이렉트
      const redirectTimer = setTimeout(() => {
        if (isAuthenticated) {
          // 인증된 사용자는 메인 페이지로
          navigate('/home', { replace: true });
        } else {
          // 인증되지 않은 사용자는 로그인 페이지로
          navigate('/LoginPage', { replace: true });
        }
      }, 500);

      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, isChecking, navigate]);

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
        
        {/* 로딩 애니메이션 - BasicLoading 아이콘 사용 (70% 크기) */}
        <div className="mt-12">
          <BasicLoading 
            size={35} 
            showText={false} 
            className=""
          />
        </div>
      </div>
    </div>
  );
} 