import { saveAs } from 'file-saver';

/**
 * CORS 캐시 우회 방식으로 미디어 파일을 다운로드하는 유틸리티
 * 이미지, 동영상 등 외부 URL의 미디어 파일을 안전하게 다운로드
 */

export interface MediaDownloadOptions {
  filename?: string;
  timeout?: number;
  onProgress?: (loaded: number, total: number) => void;
}

/**
 * CORS 캐시 우회 방식으로 미디어 파일 다운로드
 */
export const downloadMediaWithCorsCache = async (
  url: string, 
  options: MediaDownloadOptions = {}
): Promise<void> => {
  const { 
    filename = generateDefaultFilename(url), 
    timeout = 30000 
  } = options;

  try {
    console.log('CORS 캐시 우회 방식으로 미디어 다운로드 시작:', url);
    
    // 캐시 우회를 위한 타임스탬프 추가
    const cacheBuster = `?t=${Date.now()}`;
    const mediaUrl = url + cacheBuster;
    
    // 타임아웃 설정
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      // CORS 모드로 fetch
      const response = await fetch(mediaUrl, {
        method: 'GET',
        mode: 'cors',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // blob으로 변환
      const blob = await response.blob();
      
      // file-saver로 다운로드
      saveAs(blob, filename);
      
      console.log('미디어 다운로드 성공:', filename);
      
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
      
  } catch (error) {
    console.warn('CORS 캐시 우회 방식 다운로드 실패:', error);
    
    // 구체적인 에러 메시지 생성
    let errorMessage = '다운로드 중 오류가 발생했습니다.';
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = '다운로드 시간이 초과되었습니다. 다시 시도해주세요.';
      } else if (error.message.includes('CORS') || error.message.includes('Access-Control')) {
        errorMessage = '파일 다운로드 권한 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = '파일에 접근할 수 없습니다. 다시 시도해주세요.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = '네트워크 연결을 확인하고 다시 시도해주세요.';
      }
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * 미디어 파일을 base64로 변환 (이미지 저장용)
 */
export const loadMediaAsBase64 = async (
  url: string, 
  timeout: number = 15000
): Promise<string> => {
  try {
    console.log('CORS 캐시 우회 방식으로 미디어를 base64로 변환 시작:', url);
    
    // 캐시 우회를 위한 타임스탬프 추가
    const cacheBuster = `?t=${Date.now()}`;
    const mediaUrl = url + cacheBuster;
    
    // 타임아웃 설정
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      // CORS 모드로 fetch
      const response = await fetch(mediaUrl, {
        method: 'GET',
        mode: 'cors',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // blob으로 변환
      const blob = await response.blob();
      
      // blob을 base64로 변환
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
      
  } catch (error) {
    console.warn('base64 변환 실패:', error);
    throw error;
  }
};

/**
 * 기본 파일명 생성
 */
const generateDefaultFilename = (url: string): string => {
  try {
    // URL에서 파일명 추출 시도
    const urlPart = url.split('?')[0]; // 쿼리 파라미터 제거
    const filename = urlPart.split('/').pop();
    
    if (filename && filename.includes('.')) {
      return filename;
    }
  } catch (error) {
    console.warn('파일명 추출 실패:', error);
  }
  
  // 기본 파일명 생성
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `dearfam-media-${timestamp}`;
};

/**
 * 미디어 타입 감지
 */
export const detectMediaType = (url: string): 'image' | 'video' | 'unknown' => {
  const extension = url.split('.').pop()?.toLowerCase();
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov'];
  
  if (extension && imageExtensions.includes(extension)) {
    return 'image';
  } else if (extension && videoExtensions.includes(extension)) {
    return 'video';
  }
  
  return 'unknown';
};