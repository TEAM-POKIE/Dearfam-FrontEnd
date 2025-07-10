import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BasicButton } from '@/components/BasicButton';

export const KakaoMockAuth: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [redirectUri, setRedirectUri] = useState<string>('');

  useEffect(() => {
    const uri = searchParams.get('redirect_uri');
    if (uri) {
      setRedirectUri(decodeURIComponent(uri));
    }
  }, [searchParams]);

  const handleApprove = () => {
    // 인가 코드 생성 (모킹용)
    const mockCode = `mock_auth_code_${Date.now()}`;
    
    // 원래 redirect_uri로 code와 함께 리디렉션
    const callbackUrl = `${redirectUri}?code=${mockCode}`;
    console.log('모킹된 카카오 인증 승인, 리디렉션:', callbackUrl);
    window.location.href = callbackUrl;
  };

  const handleDeny = () => {
    // 에러와 함께 리디렉션
    const callbackUrl = `${redirectUri}?error=access_denied&error_description=User denied the request`;
    console.log('모킹된 카카오 인증 거부, 리디렉션:', callbackUrl);
    window.location.href = callbackUrl;
  };

  return (
    <div className="flex justify-center items-center h-app bg-yellow-50 select-none">
      <div className="mobile-container flex flex-col items-center relative bg-white rounded-lg shadow-lg p-8">
        {/* 카카오 로고 (모킹) */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
            <span className="text-black font-bold text-2xl">K</span>
          </div>
          <h1 className="text-h2 text-yellow-600 mb-2">카카오 로그인</h1>
          <p className="text-body2 text-gray-600">🧪 개발용 모킹 페이지</p>
        </div>

        {/* 앱 정보 */}
        <div className="w-full bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-h4 mb-2">DearFam이 다음 정보에 접근하려고 합니다:</h3>
          <ul className="text-body3 text-gray-600 space-y-1">
            <li>• 이메일 주소</li>
            <li>• 프로필 닉네임</li>
          </ul>
        </div>

        {/* 동의/거부 버튼 */}
        <div className="w-full flex flex-col gap-3">
          <BasicButton
            text="동의하고 계속하기"
            color="yellow"
            size={300}
            onClick={handleApprove}
            textStyle="text-h4"
          />
          <BasicButton
            text="취소"
            color="gray_3"
            size={300}
            onClick={handleDeny}
            textStyle="text-h4"
          />
        </div>

        {/* 디버그 정보 */}
        <div className="mt-6 p-3 bg-blue-50 rounded text-xs text-gray-500 text-center">
          <p>개발용 모킹 페이지입니다</p>
          <p>실제 카카오 서버와 연결되지 않습니다</p>
        </div>
      </div>
    </div>
  );
}; 