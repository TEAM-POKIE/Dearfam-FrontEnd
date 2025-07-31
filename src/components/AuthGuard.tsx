import { useEffect, useRef } from 'react';
import { useAuthFlow } from '@/hooks/useAuthFlow';
import { useAuthStore } from '@/context/store/authStore';

type AuthMode = 'yesfam' | 'nofam';

interface AuthGuardProps {
  children: React.ReactNode;
  mode?: AuthMode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, mode = 'nofam' }) => {
  const { isAuthenticated } = useAuthStore();
  const { startAuthFlow } = useAuthFlow(mode);
  const hasStartedAuthFlow = useRef(false);

  useEffect(() => {
    if (!isAuthenticated && !hasStartedAuthFlow.current) {
      hasStartedAuthFlow.current = true;
      startAuthFlow();
    }
  }, [isAuthenticated, startAuthFlow]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}; 