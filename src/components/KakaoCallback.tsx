import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../context/store/authStore";
import dearfamLogo from "@/assets/image/dearfam_logo_icon.svg";
import { BasicLoading } from "./BasicLoading";
import axios from "axios";

export const KakaoCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isProcessingRef = useRef(false);
  const processedCodeRef = useRef<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      console.log("3️⃣ 카카오 콜백 페이지 진입");

      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const state = searchParams.get("state");

      console.log("4️⃣ URL 파라미터 파싱 완료");

      // 에러가 있으면 먼저 처리
      if (error) {
        console.error("❌ 카카오 인증 에러:", error);
        setError("카카오 인증이 취소되었습니다.");
        setIsLoading(false);
        setTimeout(() => {
          navigate("/LoginPage?error=oauth-cancelled");
        }, 2000);
        return;
      }

      // 코드가 없으면 처리하지 않음
      if (!code) {
        console.log("5️⃣ 인가 코드가 없음");
        setError("인가 코드를 받을 수 없습니다.");
        setIsLoading(false);
        return;
      }

      // 이미 처리된 코드인지 확인
      if (processedCodeRef.current === code) {
        console.log("6️⃣ 이미 처리된 코드 - 중복 실행 방지");
        return;
      }

      // 중복 실행 방지
      if (isProcessingRef.current) {
        console.log("6️⃣ 이미 처리 중 - 중복 실행 방지");
        return;
      }

      isProcessingRef.current = true;
      processedCodeRef.current = code;
      console.log("7️⃣ 카카오 콜백 처리 시작");

      try {
        console.log("8️⃣ 카카오 인가 코드 확인됨");

        // 백엔드 API 호출
        const redirectUri = `${window.location.origin}/kakao/callback`;
        const requestData = {
          provider: "kakao",
          code,
          redirectUri,
        };

        console.log("9️⃣ 백엔드 API 요청 시작");

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || ""}/auth/oauth2/login`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("🔟 백엔드 API 응답 수신");

        const data = response.data;

        if (response.status !== 200) {
          console.log("1️⃣1️⃣ API 오류 발생");
          setError("로그인 처리 중 오류가 발생했습니다.");
          setTimeout(() => {
            navigate("/LoginPage?error=oauth-fail");
          }, 2000);
          return;
        }

        if (response.status === 200 && data.code === 0) {
          const { accessToken, refreshToken, user } = data.data || {};

          console.log("1️⃣2️⃣ 카카오 로그인 성공");

          // 토큰을 localStorage에 저장
          localStorage.setItem("accessToken", accessToken.token);
          localStorage.setItem("refreshToken", refreshToken.token);

          console.log("1️⃣3️⃣ 토큰 저장 완료");

          // zustand store에 로그인 정보 저장
          login(accessToken, refreshToken, user);

          console.log("1️⃣4️⃣ Zustand store 저장 완료");

          // 성공 시 메인 페이지로 이동
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        } else {
          console.log("1️⃣2️⃣ 로그인 실패");
          setError(`로그인 실패: ${data.message || "알 수 없는 오류"}`);
          setTimeout(() => {
            navigate("/LoginPage?error=oauth-fail");
          }, 2000);
        }
      } catch (error: any) {
        console.log("1️⃣5️⃣ 네트워크 오류 발생");

        setError("네트워크 오류가 발생했습니다.");
        setTimeout(() => {
          navigate("/LoginPage?error=oauth-fail");
        }, 2000);
      } finally {
        setIsLoading(false);
        isProcessingRef.current = false;
      }
    };

    // 코드가 있을 때만 실행
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (code || error) {
      console.log("1️⃣6️⃣ URL 파라미터 변경 감지");
      handleCallback();
    } else {
      console.log("1️⃣7️⃣ 유효한 파라미터 없음");
      setError("유효하지 않은 접근입니다.");
      setIsLoading(false);
    }
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
              <BasicLoading size={35} showText={false} className="" />
            </>
          )}

          {error && (
            <>
              <h2 className="text-h3 text-red-500 mb-4">로그인 오류</h2>
              <p className="text-body2 text-gray-3 text-center">{error}</p>
              <p className="text-body3 text-gray-4 mt-2">
                잠시 후 로그인 페이지로 이동합니다...
              </p>
            </>
          )}

          {!isLoading && !error && (
            <>
              <h2 className="text-h3 text-main-2 mb-4">로그인 성공!</h2>
              <p className="text-body2 text-gray-3">
                메인 페이지로 이동합니다...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
