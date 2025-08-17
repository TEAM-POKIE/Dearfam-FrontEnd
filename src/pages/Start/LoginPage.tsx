import { useNavigate, useSearchParams } from "react-router-dom";
import dearfamLogo from "../../assets/image/dearfam_logo_icon.svg";
import { BasicButton } from "../../components/BasicButton";
import { KakaoLoginButton } from "../../components/KakaoLoginButton";
import { useEffect } from "react";
import { useAuthStore } from "@/context/store/authStore";
import { useToastStore } from "@/context/store/toastStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, logout } = useAuthStore();
  const { showToast } = useToastStore();

  useEffect(() => {
    // URL 파라미터에서 메시지 확인
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if (error) {
      let errorMessage = "";
      switch (error) {
        case "timeout":
          errorMessage = "인증 시간이 초과되었습니다.\n다시 로그인해주세요.";
          break;
        case "env-config":
          errorMessage =
            "환경 변수가 설정되지 않았습니다.\n관리자에게 문의해주세요.";
          break;
        case "no-token":
          errorMessage = "로그인 정보가 없습니다.\n다시 로그인해주세요.";
          break;

        case "token-validation-failed":
          errorMessage = "로그인 검증에 실패했습니다.\n다시 로그인해주세요.";
          break;
        case "user-not-found":
          errorMessage =
            "사용자 정보를 찾을 수 없습니다.\n다시 로그인해주세요.";
          break;
        case "network-error":
          errorMessage = "네트워크 연결을 확인해주세요.";
          break;

        case "oauth-cancelled":
          errorMessage = "카카오 로그인이 취소되었습니다.";
          break;
        case "invalid-access":
          errorMessage =
            "유효하지 않은 접근입니다.\n정상적인 로그인을 시도해주세요.";
          break;
        case "unknown":
          errorMessage = "알 수 없는 오류가 발생했습니다.\n다시 시도해주세요.";
          break;
        default:
          errorMessage = "로그인에 문제가 발생했습니다.\n다시 시도해주세요.";
      }

      // 에러 메시지를 toast로 표시
      showToast(errorMessage, "error");
    } else if (message === "logout-success") {
      // 로그아웃 성공 메시지 표시
      showToast("정상적으로 로그아웃 되었습니다.", "success");

      // URL에서 파라미터 제거
      navigate("/LoginPage", { replace: true });
    }
  }, [searchParams, navigate, showToast]);

  return (
    <div className="flex justify-center items-center  bg-bg-1 select-none">
      <div className="mobile-container flex flex-col items-center relative w-full max-w-md px-4">
        {/* 로고와 텍스트 */}
        <div className="flex flex-col items-center mt-[8rem] mb-[8rem] w-full">
          <img
            src={dearfamLogo}
            alt="Dearfam Logo"
            className="w-32 h-32 mb-6"
          />
          <div className="text-center w-full">
            <h1 className="text-h2 text-main-2 mb-2">DearFam</h1>
            <p className="text-body1 text-gray-3 mb-2">
              가족과 함께하는 특별한 순간
            </p>
            <p className="text-body2 text-gray-4">
              로그인하여 가족 페이지를 시작해보세요
            </p>
          </div>
        </div>

        {/* 로그인 버튼들 */}
        <div className="w-full flex flex-col gap-4 justify-center items-center">
          {/* 카카오 로그인 버튼 */}
          <div className="w-full flex justify-center">
            <KakaoLoginButton className="w-full max-w-[350px]" />
          </div>
        </div>

        {/* 하단 텍스트 */}
        <div className="mt-4 text-center">
          <p className="text-body3 text-gray-4">
            로그인 시{" "}
            <a
              href="about:blank"
              target="_blank"
              rel="noopener noreferrer"
              className="text-main-2 hover:underline cursor-pointer"
            >
              개인정보처리방침
            </a>{" "}
            및{" "}
            <a
              href="about:blank"
              target="_blank"
              rel="noopener noreferrer"
              className="text-main-2 hover:underline cursor-pointer"
            >
              이용약관
            </a>
            에<br />
            동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
