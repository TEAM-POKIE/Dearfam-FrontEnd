import { AxiosError } from "axios";
import { toast } from "sonner";

// 에러 타입 정의
export interface ApiError {
  code: string;
  message: string;
  status?: number;
  details?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
}

// 에러 코드 매핑
const ERROR_MESSAGES: Record<string, string> = {
  // 네트워크 에러
  NETWORK_ERROR: "네트워크 연결을 확인해주세요.",
  TIMEOUT: "요청 시간이 초과되었습니다.",

  // 인증 에러
  UNAUTHORIZED: "로그인이 필요합니다.",
  FORBIDDEN: "접근 권한이 없습니다.",
  TOKEN_EXPIRED: "로그인이 만료되었습니다. 다시 로그인해주세요.",

  // 서버 에러
  INTERNAL_SERVER_ERROR: "서버에 일시적인 문제가 발생했습니다.",
  BAD_REQUEST: "잘못된 요청입니다.",
  NOT_FOUND: "요청하신 내용을 찾을 수 없습니다.",

  // 비즈니스 로직 에러
  VALIDATION_ERROR: "입력 정보가 올바르지 않습니다.",
  DUPLICATE_ERROR: "이미 존재하는 데이터입니다.",
  LIMIT_EXCEEDED: "제한을 초과했습니다.",

  // 기본 에러
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",
};

// Axios 에러를 ApiError로 변환
export const transformAxiosError = (error: AxiosError): ApiError => {
  if (!error.response) {
    // 네트워크 에러
    return {
      code: "NETWORK_ERROR",
      message: ERROR_MESSAGES.NETWORK_ERROR,
      status: 0,
    };
  }

  const { status, data } = error.response;

  // 서버에서 에러 정보를 제공하는 경우
  if (data && typeof data === "object" && "code" in data) {
    return {
      code: (data as any).code,
      message: (data as any).message || ERROR_MESSAGES.UNKNOWN_ERROR,
      status,
      details: (data as any).details,
    };
  }

  // HTTP 상태 코드에 따른 기본 에러 처리
  let code: string;
  switch (status) {
    case 400:
      code = "BAD_REQUEST";
      break;
    case 401:
      code = "UNAUTHORIZED";
      break;
    case 403:
      code = "FORBIDDEN";
      break;
    case 404:
      code = "NOT_FOUND";
      break;
    case 408:
      code = "TIMEOUT";
      break;
    case 500:
      code = "INTERNAL_SERVER_ERROR";
      break;
    default:
      code = "UNKNOWN_ERROR";
  }

  return {
    code,
    message: ERROR_MESSAGES[code] || ERROR_MESSAGES.UNKNOWN_ERROR,
    status,
  };
};

// 전역 에러 핸들러
export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorQueue: Set<string> = new Set();

  private constructor() {
    this.setupGlobalHandlers();
  }

  public static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  private setupGlobalHandlers() {
    // Unhandled Promise Rejection
    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled promise rejection:", event.reason);

      if (event.reason instanceof Error) {
        this.handleError(event.reason, { context: "unhandledRejection" });
      }

      event.preventDefault();
    });

    // Global Error Handler
    window.addEventListener("error", (event) => {
      console.error("Global error:", event.error);
      this.handleError(event.error, { context: "globalError" });
    });
  }

  // 에러 중복 처리 방지
  private isDuplicateError(error: Error | ApiError): boolean {
    const errorKey = "message" in error ? error.message : String(error);

    if (this.errorQueue.has(errorKey)) {
      return true;
    }

    this.errorQueue.add(errorKey);

    // 5초 후 에러 키 제거 (중복 방지 해제)
    setTimeout(() => {
      this.errorQueue.delete(errorKey);
    }, 5000);

    return false;
  }

  // 에러 처리 메인 메서드
  public handleError(
    error: Error | ApiError | AxiosError,
    options: {
      showToast?: boolean;
      context?: string;
      silent?: boolean;
    } = {}
  ): void {
    const { showToast = true, context, silent = false } = options;

    let processedError: ApiError;

    // 에러 타입별 처리
    if (error instanceof AxiosError) {
      processedError = transformAxiosError(error);
    } else if ("code" in error && "message" in error) {
      processedError = error as ApiError;
    } else {
      processedError = {
        code: "UNKNOWN_ERROR",
        message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      };
    }

    // 중복 에러 체크
    if (!silent && this.isDuplicateError(processedError)) {
      return;
    }

    // 컨텍스트 정보와 함께 로깅
    console.error("Error handled:", {
      error: processedError,
      context,
      timestamp: new Date().toISOString(),
    });

    // 프로덕션 환경에서 에러 리포팅 서비스로 전송
    if (import.meta.env.PROD && !silent) {
      this.reportError(processedError, context);
    }

    // 토스트 알림 표시
    if (showToast && !silent) {
      this.showErrorToast(processedError);
    }
  }

  // 에러 토스트 표시
  private showErrorToast(error: ApiError): void {
    // 인증 에러의 경우 특별 처리
    if (error.code === "UNAUTHORIZED" || error.code === "TOKEN_EXPIRED") {
      toast.error(error.message, {
        action: {
          label: "로그인",
          onClick: () => {
            // 로그인 페이지로 리다이렉트
            window.location.href = "/LoginPage";
          },
        },
      });
      return;
    }

    // 일반 에러 토스트
    toast.error(error.message, {
      description: import.meta.env.DEV ? `Code: ${error.code}` : undefined,
    });
  }

  // 에러 리포팅 (향후 Sentry 등 연동)
  private reportError(error: ApiError, context?: string): void {
    // 향후 에러 추적 서비스 연동
    // Sentry.captureException(error, {
    //   tags: { context },
    //   extra: { timestamp: new Date().toISOString() }
    // });

    console.warn("Error reporting not configured:", { error, context });
  }

  // 수동 에러 리포팅 메서드
  public reportManualError(message: string, data?: Record<string, any>): void {
    const error: ApiError = {
      code: "MANUAL_ERROR",
      message,
      details: data,
    };

    this.handleError(error, { context: "manual" });
  }
}

// 전역 에러 핸들러 인스턴스 생성 및 내보내기
export const globalErrorHandler = GlobalErrorHandler.getInstance();

// 편의 함수들
export const handleApiError = (error: AxiosError, silent = false) => {
  globalErrorHandler.handleError(error, { silent });
};

export const showErrorMessage = (message: string, code = "CUSTOM_ERROR") => {
  const error: ApiError = { code, message };
  globalErrorHandler.handleError(error);
};

export const reportError = (message: string, data?: Record<string, any>) => {
  globalErrorHandler.reportManualError(message, data);
};
