import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../context/store/authStore';
import dearfamLogo from '@/assets/image/dearfam_logo_icon.svg';
import { BasicLoading } from './BasicLoading';
import axios from 'axios';

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
      
              const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');

      // 에러가 있으면 먼저 처리
      if (error) {
        console.error('❌ 카카오 인증 에러:', error);
        setError('카카오 인증이 취소되었습니다.');
        setIsLoading(false);
        setTimeout(() => {
          navigate('/LoginPage?error=oauth-cancelled');
        }, 2000);
        return;
      }

      // 코드가 없으면 처리하지 않음
      if (!code) {
        setError('인가 코드를 받을 수 없습니다.');
        setIsLoading(false);
        return;
      }

      // 이미 처리된 코드인지 확인
      if (processedCodeRef.current === code) {
        return;
      }

      // 중복 실행 방지
      if (isProcessingRef.current) {
        return;
      }

      isProcessingRef.current = true;
      processedCodeRef.current = code;

      try {



        // 백엔드 API 호출
        const redirectUri = `${window.location.origin}/kakao/callback`;
        const requestData = {
          provider: 'kakao',
          code,
          redirectUri,
        };

        const response = await axios.post(`${import.meta.env.VITE_API_URL || ''}/auth/oauth2/login`, requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = response.data;

        if (response.status !== 200) {
          setError('로그인 처리 중 오류가 발생했습니다.');
          setTimeout(() => {
            navigate('/LoginPage?error=oauth-fail');
          }, 2000);
          return;
        }

        if (response.status === 200 && data.code === 0) {
          const { accessToken, refreshToken, user } = data.data || {};
          
          // 토큰을 localStorage에 저장 (Object를 String으로 변환)
          if (accessToken) {
            // JSON 객체인 경우 실제 토큰 값만 추출
            let actualAccessToken = accessToken;
            if (typeof accessToken === 'object' && accessToken.token) {
              actualAccessToken = accessToken.token;
            }
            
            localStorage.setItem('accessToken', String(actualAccessToken));
          }
          
          if (refreshToken) {
            // JSON 객체인 경우 실제 토큰 값만 추출
            let actualRefreshToken = refreshToken;
            if (typeof refreshToken === 'object' && refreshToken.token) {
              actualRefreshToken = refreshToken.token;
            }
            
            localStorage.setItem('refreshToken', String(actualRefreshToken));
          }
          
          // zustand store에 로그인 정보 저장
          login(accessToken, '', user); // refreshToken 빈 문자열로 전달

          // 성공 시 메인 페이지로 이동
          setTimeout(() => {
            navigate('/home');
          }, 1000);
        } else {
          setError(`로그인 실패: ${data.message || '알 수 없는 오류'}`);
          setTimeout(() => {
            navigate('/LoginPage?error=oauth-fail');
          }, 2000);
        }
      } catch (error: any) {
        
        setError('네트워크 오류가 발생했습니다.');
        setTimeout(() => {
          navigate('/LoginPage?error=oauth-fail');
        }, 2000);
      } finally {
        setIsLoading(false);
        isProcessingRef.current = false;
      }
    };

    // 코드가 있을 때만 실행
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    if (code || error) {
      handleCallback();
    } else {
      setError('유효하지 않은 접근입니다.');
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
              <BasicLoading 
                size={35} 
                showText={false} 
                className=""
              />
            </>
          )}
          
          {error && (
            <>
              <h2 className="text-h3 text-red-500 mb-4">로그인 오류</h2>
              <p className="text-body2 text-gray-3 text-center">{error}</p>
              <p className="text-body3 text-gray-4 mt-2">잠시 후 로그인 페이지로 이동합니다...</p>
            </>
          )}
          
          {!isLoading && !error && (
            <>
              <h2 className="text-h3 text-main-2 mb-4">로그인 성공!</h2>
              <p className="text-body2 text-gray-3">메인 페이지로 이동합니다...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 