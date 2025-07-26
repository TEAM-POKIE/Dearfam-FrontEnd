import { useNavigate, useSearchParams } from "react-router-dom";
import dearfamLogo from "../../assets/image/dearfam_logo_icon.svg";
import { BasicButton } from "../../components/BasicButton";
import { KakaoLoginButton } from "../../components/KakaoLoginButton";
import { BasicToast } from "../../components/BasicToast";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/context/store/authStore";

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useAuthStore();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      switch (error) {
        case 'oauth-fail':
          setErrorMessage('로그인 처리 중 오류가 발생했습니다.');
          break;
        case 'oauth-cancelled':
          setErrorMessage('로그인이 취소되었습니다.');
          break;
        case 'session-expired':
          setErrorMessage('세션이 만료되었습니다. 다시 로그인해주세요.');
          break;
        default:
          setErrorMessage('알 수 없는 오류가 발생했습니다.');
      }
    }
  }, [searchParams]);

  const handleGuestLogin = () => {
    // TODO: 게스트 로그인 또는 체험하기 기능
    console.log("게스트 로그인 버튼 클릭");
    navigate('/StartPage');
  };

  const handleTestLogin = () => {
    // 테스트용 로그인 - 실제 구현에서는 제거
    const testUser = {
      id: '1',
      nickname: '테스트 사용자',
      email: 'test@example.com',
      profilePicture: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // 토큰 저장
    localStorage.setItem('accessToken', 'test-access-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');
    
    // Zustand store에 로그인 정보 저장
    login('test-access-token', 'test-refresh-token', testUser);
    
    // 메인 페이지로 이동
    navigate('/home');
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

        {/* 에러 메시지 - BasicToast 사용 */}
        {errorMessage && (
          <div className="mb-4">
            <BasicToast message={errorMessage} />
          </div>
        )}

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
          
          {/* 테스트용 로그인 버튼 - 개발 환경에서만 표시 */}
          {import.meta.env.DEV && (
            <button 
              onClick={handleTestLogin}
              className="px-4 py-2 text-body3 text-main-2 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors"
            >
              테스트 로그인
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 