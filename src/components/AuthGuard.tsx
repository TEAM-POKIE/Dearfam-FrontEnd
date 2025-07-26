import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/context/store/authStore';
import { BasicLoading } from './BasicLoading';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthStore();
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
            nickname: '사용자',
            email: 'user@example.com',
            profilePicture: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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

    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (!isChecking) {
      if (isAuthenticated) {
        // 인증된 사용자는 메인 페이지로
        navigate('/', { replace: true });
      } else {
        // 인증되지 않은 사용자는 로그인 페이지로
        navigate('/LoginPage', { replace: true });
      }
    }
  }, [isAuthenticated, isChecking, navigate]);

  // 인증 상태 확인 중일 때 로딩 표시
  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen bg-bg-1 flex items-center justify-center">
        <BasicLoading fullscreen text="인증 상태 확인 중..." size={80} />
      </div>
    );
  }

  return <>{children}</>;
}; 