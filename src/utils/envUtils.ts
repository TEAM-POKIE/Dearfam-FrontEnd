/**
 * 환경 변수 검사 유틸리티
 */

export interface EnvironmentConfig {
  apiUrl: string;
  kakaoRestKey: string;
}

/**
 * 필수 환경 변수들을 검사하고 설정값을 반환합니다.
 * @returns 환경 변수 설정 객체
 * @throws 환경 변수가 누락된 경우 에러
 */
export const validateEnvironmentVariables = (): EnvironmentConfig => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const kakaoRestKey = import.meta.env.VITE_KAKAO_REST_KEY;

  const missingVars: string[] = [];

  if (!apiUrl) {
    missingVars.push('VITE_API_URL');
  }

  if (!kakaoRestKey) {
    missingVars.push('VITE_KAKAO_REST_KEY');
  }

  if (missingVars.length > 0) {
    throw new Error(
      `필수 환경 변수가 설정되지 않았습니다: ${missingVars.join(', ')}\n` +
      '프로젝트 루트에 .env 파일을 생성하고 필요한 환경 변수를 설정해주세요.'
    );
  }

  return {
    apiUrl,
    kakaoRestKey,
  };
};

/**
 * 환경 변수가 설정되어 있는지 간단히 확인합니다.
 * @returns 환경 변수 설정 여부
 */
export const isEnvironmentConfigured = (): boolean => {
  try {
    validateEnvironmentVariables();
    return true;
  } catch {
    return false;
  }
};

/**
 * 개발 환경에서 환경 변수 상태를 콘솔에 출력합니다.
 */
export const logEnvironmentStatus = (): void => {
  if (import.meta.env.DEV) {
    console.log('🔧 환경 변수 상태:');
    console.log('  VITE_API_URL:', import.meta.env.VITE_API_URL ? '✅ 설정됨' : '❌ 누락');
    console.log('  VITE_KAKAO_REST_KEY:', import.meta.env.VITE_KAKAO_REST_KEY ? '✅ 설정됨' : '❌ 누락');
  }
}; 