import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, afterEach, afterAll } from 'vitest';
import { ErrorBoundary, ErrorFallback } from '../ErrorBoundary';

// 에러를 발생시키는 테스트 컴포넌트
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No Error</div>;
};

describe('ErrorBoundary', () => {
  // 콘솔 에러 모킹 (테스트 중 에러 로그 방지)
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  test('정상적인 경우 children을 렌더링한다', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No Error')).toBeInTheDocument();
  });

  test('에러 발생 시 기본 에러 UI를 표시한다', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('문제가 발생했습니다')).toBeInTheDocument();
    expect(screen.getByText('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')).toBeInTheDocument();
    expect(screen.getByText('다시 시도')).toBeInTheDocument();
    expect(screen.getByText('새로고침')).toBeInTheDocument();
  });

  test('에러 발생 시 onError 콜백이 호출된다', () => {
    const onErrorMock = vi.fn();

    render(
      <ErrorBoundary onError={onErrorMock}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onErrorMock).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  test('사용자 정의 fallback UI를 표시한다', () => {
    const customFallback = <div>Custom Error UI</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    expect(screen.queryByText('문제가 발생했습니다')).not.toBeInTheDocument();
  });

  test('다시 시도 버튼을 클릭하면 에러 상태가 리셋된다', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('문제가 발생했습니다')).toBeInTheDocument();

    // 다시 시도 버튼 클릭
    fireEvent.click(screen.getByText('다시 시도'));

    // 컴포넌트를 정상 상태로 리렌더링
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No Error')).toBeInTheDocument();
  });

  test('새로고침 버튼을 클릭하면 페이지가 새로고침된다', () => {
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText('새로고침'));

    expect(reloadSpy).toHaveBeenCalled();
  });
});

describe('ErrorFallback', () => {
  test('에러 정보와 함께 에러 UI를 렌더링한다', () => {
    const error = new Error('Test error message');
    const resetError = vi.fn();

    render(<ErrorFallback error={error} resetError={resetError} />);

    expect(screen.getByText('문제가 발생했습니다')).toBeInTheDocument();
    expect(screen.getByText('다시 시도')).toBeInTheDocument();
    expect(screen.getByText('새로고침')).toBeInTheDocument();
  });

  test('다시 시도 버튼을 클릭하면 resetError가 호출된다', () => {
    const error = new Error('Test error');
    const resetError = vi.fn();

    render(<ErrorFallback error={error} resetError={resetError} />);

    fireEvent.click(screen.getByText('다시 시도'));

    expect(resetError).toHaveBeenCalled();
  });

  test('개발 환경에서 에러 상세 정보를 표시한다', () => {
    // 개발 환경 모킹
    vi.stubEnv('DEV', true);

    const error = new Error('Detailed error message');
    const resetError = vi.fn();

    render(<ErrorFallback error={error} resetError={resetError} />);

    expect(screen.getByText('개발자 정보 (개발 모드에서만 표시)')).toBeInTheDocument();
    
    // details 요소 클릭하여 에러 상세 정보 표시
    fireEvent.click(screen.getByText('개발자 정보 (개발 모드에서만 표시)'));
    
    expect(screen.getByText(/Detailed error message/)).toBeInTheDocument();

    vi.unstubAllEnvs();
  });
});