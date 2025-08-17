import React, { useEffect, useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { BasicLoading } from "@/components/BasicLoading";
import dearfamLogo from "../../assets/image/dearfam_logo_icon.svg";

export const SplashPage = () => {
  const [showAuthGuard, setShowAuthGuard] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAuthGuard(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!showAuthGuard) {
    return (
      <div className="mobile-container flex flex-col align-middle m-auto bg-bg-1 select-none">
        <div className="flex flex-col justify-center items-center min-h-screen">
          {/* 로고와 텍스트 */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={dearfamLogo}
              alt="Dearfam Logo"
              className="w-32 h-32 mb-6"
            />
            <div className="text-center">
              <h1 className="text-h2 text-main-2 mb-2">DearFam</h1>
              <p className="text-body1 text-gray-3 mb-2">
                가족과 함께하는 특별한 순간
              </p>
            </div>
          </div>

          {/* 로딩 스피너 */}
          <div className="flex justify-center">
            <BasicLoading text="" size={30} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard mode="yesfam">
      <div className="mobile-container flex flex-col align-middle m-auto bg-bg-1 select-none">
        <div className="flex flex-col justify-center items-center min-h-screen">
          {/* 로고와 텍스트 */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={dearfamLogo}
              alt="Dearfam Logo"
              className="w-32 h-32 mb-6"
            />
            <div className="text-center">
              <h1 className="text-h2 text-main-2 mb-2">DearFam</h1>
              <p className="text-body1 text-gray-3 mb-2">
                가족과 함께하는 특별한 순간
              </p>
            </div>
          </div>

          {/* 로딩 스피너 */}
          <div className="flex justify-center">
            <BasicLoading text="" size={30} />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};
