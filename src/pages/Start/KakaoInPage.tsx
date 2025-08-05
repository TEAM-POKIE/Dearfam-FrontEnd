import { useState, useEffect } from "react";
import { BasicButton } from "../../components/BasicButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import dearfamLogo from "../../assets/image/dearfam_logo_icon.svg";
import kakaoLoginButton from "../../assets/image/kakao/kakao_login_medium_wide.png";
import { useKakaoLogin, authUtils } from "../../hooks/api/useAuthAPI";
import { useToastStore } from "@/context/store/toastStore";

export function KakaoInPage() {
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToastStore();

  const kakaoLoginMutation = useKakaoLogin();

  // URL에서 인증 코드 확인
  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      handleKakaoLogin(code);
    }
  }, [searchParams, showToast]);

  // 카카오 로그인 처리
  const handleKakaoLogin = async (code: string) => {
    setIsLoading(true);
    try {
      await kakaoLoginMutation.mutateAsync({
        code,
        redirectUri: window.location.origin + "/kakao/callback",
      });

      showToast("카카오 로그인이 성공했습니다!", "success");

      // 성공 시 홈 페이지로 이동
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error("카카오 로그인 실패:", error);
      showToast("카카오 로그인에 실패했습니다. 다시 시도해주세요.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // 카카오 로그인 시작
  const handleKakaoLoginStart = () => {
    try {
      // 환경변수 확인
      const KAKAO_REST_KEY = import.meta.env.VITE_KAKAO_REST_KEY;
      if (!KAKAO_REST_KEY) {
        showToast(
          "카카오 REST API 키가 설정되지 않았습니다. 개발자에게 문의하세요.",
          "error"
        );
        return;
      }

      const REDIRECT_URI = `${window.location.origin}/kakao/callback`;
      const loginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_KEY}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&response_type=code`;

      console.log("카카오 로그인 URL:", loginUrl);
      window.location.href = loginUrl;
    } catch (error) {
      console.error("카카오 로그인 URL 생성 실패:", error);
      showToast(
        "카카오 로그인을 시작할 수 없습니다. 다시 시도해주세요.",
        "error"
      );
    }
  };

  // 참여 코드 검증 (기존 기능 유지)
  const handleJoin = () => {
    setIsValid(true);
    // TODO: 참여 코드 검증 로직 구현
    navigate("/MakeConfirmPage", {
      state: {
        fromKakao: true,
        familyName: "샘플 가족",
        managerName: "샘플 방장",
      },
    });
  };

  return (
    <div className="flex justify-center items-center h-app bg-bg-1 select-none">
      <div className="mobile-container flex flex-col items-center relative">
        <div className="flex flex-col w-[350px] px-[10px] mx-[20px] mt-[6.25rem]">
          <h2 className="text-h3 mb-[0.63rem]">
            Dearfam에 오신 것을 환영합니다
          </h2>
          <div>
            <p className="text-body2 text-gray-3">
              카카오 계정으로 간편하게 로그인하고 가족과의 소중한 추억을
              공유해보세요.
            </p>
          </div>
        </div>

        <div className="mx-[20px] mt-[7.62rem] flex justify-center">
          <img src={dearfamLogo} alt="Dearfam Logo" className="w-[200px]" />
        </div>

        {!isValid && (
          <p className="text-body3 text-red-500 text-center mt-2">
            유효하지 않은 참여 코드입니다.
          </p>
        )}
        {/* 카카오 로그인 버튼 */}
        <div className="w-full flex justify-center mt-[8.22rem]">
          <div className="mx-[1.25rem]">
            <button
              onClick={handleKakaoLoginStart}
              disabled={isLoading}
              className="w-[350px] h-[50px] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              <img
                src={kakaoLoginButton}
                alt="카카오 로그인"
                className="w-full h-full object-contain"
              />
            </button>
          </div>
        </div>
        {/* 참여하기 버튼 (기존 기능) */}
        <div className="w-full flex justify-center mt-[1rem]">
          <div className="mx-[1.25rem]">
            <BasicButton
              text="참여 코드로 입장"
              color="gray_3"
              size={350}
              onClick={handleJoin}
              textStyle="text-h4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
