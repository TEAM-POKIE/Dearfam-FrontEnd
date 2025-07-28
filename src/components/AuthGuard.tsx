import { useEffect, useRef } from 'react';
import { BasicLoading } from './BasicLoading';
import { useAuthFlow } from '@/hooks/useAuthFlow';
import { useAuthStore } from '@/context/store/authStore';
import dearfamLogo from "@/assets/image/dearfam_logo_icon.svg";

type AuthMode = 'yesfam' | 'nofam';

interface AuthGuardProps {
  children: React.ReactNode;
  mode?: AuthMode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, mode = 'nofam' }) => {
  const { isAuthenticated } = useAuthStore();
  const { isChecking, userLoading, familyLoading, startAuthFlow } = useAuthFlow(mode);
  const hasStartedAuthFlow = useRef(false);

  useEffect(() => {
    // 인증되지 않은 상태에서만 인증 플로우 시작 (한 번만)
    if (!isAuthenticated && !hasStartedAuthFlow.current) {
      console.log('🔒 AuthGuard: 인증되지 않은 상태 - 인증 플로우 시작');
      console.log('🔒 AuthGuard: 모드:', mode === 'yesfam' ? '가족 검사 (1,2,3단계)' : '기본 검사 (1,2단계)');
      
      hasStartedAuthFlow.current = true;
      startAuthFlow();
    }
  }, [isAuthenticated, startAuthFlow, mode]);

  // 인증 검사 중일 때 로딩 표시
  if (isChecking || userLoading || familyLoading) {
    return (
      <div className="flex justify-center items-center h-app bg-bg-1 select-none">
        <div className="mobile-container flex flex-col items-center relative">
          {/* 로고와 텍스트 */}
          <div className="flex flex-col items-center mt-[8rem] mb-[8rem]">
            <img src={dearfamLogo} alt="Dearfam Logo" className="w-32 h-32 mb-6" />
            <div className="text-center">
              <h1 className="text-h2 text-main-2 mb-2">DearFam</h1>
              <p className="text-body1 text-gray-3 mb-2">인증 상태 확인 중...</p>
            </div>
          </div>

          {/* 로딩 스피너 */}
          <div className="w-full flex flex-col gap-4 justify-center">
            <div className="mx-[1.25rem] flex justify-center">
              <BasicLoading text="" size={30} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 인증되지 않음 (useAuthFlow에서 이미 리다이렉트 처리됨)
  if (!isAuthenticated) {
    console.log('🔒 AuthGuard: 인증되지 않음 - 리다이렉트 대기 중');
    return null; // 리다이렉트 중이므로 아무것도 렌더링하지 않음
  }

  // 인증됨 - 보호된 컨텐츠 렌더링
  console.log('✅ AuthGuard: 인증됨 - 보호된 컨텐츠 렌더링');
  return <>{children}</>;
}; 