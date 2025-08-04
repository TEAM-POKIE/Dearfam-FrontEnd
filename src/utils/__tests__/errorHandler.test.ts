import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { AxiosError } from 'axios';
import { 
  transformAxiosError, 
  GlobalErrorHandler, 
  handleApiError, 
  showErrorMessage,
  reportError 
} from '../errorHandler';
import { toast } from 'sonner';

// Sonner toast 모킹
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

describe('transformAxiosError', () => {
  test('네트워크 에러를 올바르게 변환한다', () => {
    const axiosError = {
      response: undefined,
      message: 'Network Error',
    } as AxiosError;

    const result = transformAxiosError(axiosError);

    expect(result).toEqual({
      code: 'NETWORK_ERROR',
      message: '네트워크 연결을 확인해주세요.',
      status: 0,
    });
  });

  test('서버에서 제공하는 에러 정보를 변환한다', () => {
    const axiosError = {
      response: {
        status: 400,
        data: {
          code: 'VALIDATION_ERROR',
          message: '입력 데이터가 올바르지 않습니다.',
          details: { field: 'email' },
        },
      },
    } as AxiosError;

    const result = transformAxiosError(axiosError);

    expect(result).toEqual({
      code: 'VALIDATION_ERROR',
      message: '입력 데이터가 올바르지 않습니다.',
      status: 400,
      details: { field: 'email' },
    });
  });

  test('HTTP 상태 코드에 따른 기본 에러를 변환한다', () => {
    const axiosError = {
      response: {
        status: 401,
        data: null,
      },
    } as AxiosError;

    const result = transformAxiosError(axiosError);

    expect(result).toEqual({
      code: 'UNAUTHORIZED',
      message: '로그인이 필요합니다.',
      status: 401,
    });
  });

  test('알 수 없는 상태 코드를 처리한다', () => {
    const axiosError = {
      response: {
        status: 999,
        data: null,
      },
    } as AxiosError;

    const result = transformAxiosError(axiosError);

    expect(result).toEqual({
      code: 'UNKNOWN_ERROR',
      message: '알 수 없는 오류가 발생했습니다.',
      status: 999,
    });
  });
});

describe('GlobalErrorHandler', () => {
  let errorHandler: GlobalErrorHandler;
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

  beforeEach(() => {
    errorHandler = GlobalErrorHandler.getInstance();
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockClear();
    consoleWarnSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  test('싱글톤 패턴으로 동작한다', () => {
    const instance1 = GlobalErrorHandler.getInstance();
    const instance2 = GlobalErrorHandler.getInstance();

    expect(instance1).toBe(instance2);
  });

  test('일반 에러를 처리한다', () => {
    const error = new Error('Test error');

    errorHandler.handleError(error);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error handled:',
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'UNKNOWN_ERROR',
          message: 'Test error',
        }),
        timestamp: expect.any(String),
      })
    );
    expect(toast.error).toHaveBeenCalledWith('Test error');
  });

  test('Axios 에러를 처리한다', () => {
    const axiosError = {
      response: {
        status: 400,
        data: {
          code: 'BAD_REQUEST',
          message: '잘못된 요청입니다.',
        },
      },
    } as AxiosError;

    errorHandler.handleError(axiosError);

    expect(toast.error).toHaveBeenCalledWith('잘못된 요청입니다.');
  });

  test('silent 옵션이 true일 때 토스트를 표시하지 않는다', () => {
    const error = new Error('Silent error');

    errorHandler.handleError(error, { silent: true });

    expect(toast.error).not.toHaveBeenCalled();
  });

  test('중복 에러를 방지한다', () => {
    const error = new Error('Duplicate error');

    // 첫 번째 호출
    errorHandler.handleError(error);
    expect(toast.error).toHaveBeenCalledTimes(1);

    // 즉시 두 번째 호출 (중복으로 간주)
    errorHandler.handleError(error);
    expect(toast.error).toHaveBeenCalledTimes(1); // 여전히 1번만 호출
  });

  test('인증 에러의 경우 특별한 토스트를 표시한다', () => {
    const error = {
      code: 'UNAUTHORIZED',
      message: '로그인이 필요합니다.',
    };

    errorHandler.handleError(error);

    expect(toast.error).toHaveBeenCalledWith(
      '로그인이 필요합니다.',
      expect.objectContaining({
        action: expect.objectContaining({
          label: '로그인',
          onClick: expect.any(Function),
        }),
      })
    );
  });

  test('수동 에러 리포팅을 처리한다', () => {
    const message = 'Manual error report';
    const data = { userId: '123', action: 'upload' };

    errorHandler.reportManualError(message, data);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error handled:',
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'MANUAL_ERROR',
          message,
          details: data,
        }),
        context: 'manual',
      })
    );
  });
});

describe('편의 함수들', () => {
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  test('handleApiError가 올바르게 동작한다', () => {
    const axiosError = {
      response: {
        status: 500,
        data: null,
      },
    } as AxiosError;

    handleApiError(axiosError, true);

    expect(consoleErrorSpy).toHaveBeenCalled();
    // silent=true이므로 toast는 호출되지 않아야 함
    expect(toast.error).not.toHaveBeenCalled();
  });

  test('showErrorMessage가 올바르게 동작한다', () => {
    const message = '커스텀 에러 메시지';
    const code = 'CUSTOM_CODE';

    showErrorMessage(message, code);

    expect(toast.error).toHaveBeenCalledWith(message);
  });

  test('reportError가 올바르게 동작한다', () => {
    const message = '리포트 에러';
    const data = { component: 'TestComponent' };

    reportError(message, data);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error handled:',
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'MANUAL_ERROR',
          message,
          details: data,
        }),
      })
    );
  });
});