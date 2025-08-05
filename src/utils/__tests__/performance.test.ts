import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  measureFunction, 
  measureAsyncFunction, 
  usePerformanceMonitor,
  trackImageLoading,
  trackMemoryUsage
} from '../performance';

// Performance API 모킹
const mockPerformance = {
  now: vi.fn(),
  memory: {
    usedJSHeapSize: 1024 * 1024,
    totalJSHeapSize: 2048 * 1024,
    jsHeapSizeLimit: 4096 * 1024,
  },
  getEntriesByType: vi.fn(() => []),
};

Object.defineProperty(global, 'performance', {
  writable: true,
  value: mockPerformance,
});

// PerformanceObserver 모킹
const mockPerformanceObserver = vi.fn();
mockPerformanceObserver.mockImplementation((callback) => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  callback,
}));
global.PerformanceObserver = mockPerformanceObserver as any;

// Console 모킹
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('Performance Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPerformance.now.mockReturnValue(0);
  });

  afterEach(() => {
    consoleLogSpy.mockClear();
    consoleWarnSpy.mockClear();
  });

  describe('measureFunction', () => {
    test('함수 실행 시간을 측정한다', () => {
      mockPerformance.now
        .mockReturnValueOnce(0) // 시작 시간
        .mockReturnValueOnce(100); // 종료 시간

      const testFunction = vi.fn(() => 'result');
      const measuredFunction = measureFunction(testFunction, 'testFunc');

      const result = measuredFunction();

      expect(result).toBe('result');
      expect(testFunction).toHaveBeenCalledWith('arg1', 'arg2');
      expect(mockPerformance.now).toHaveBeenCalledTimes(2);
    });

    test('에러가 발생해도 측정을 완료한다', () => {
      mockPerformance.now
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(50);

      const errorFunction = vi.fn(() => {
        throw new Error('Test error');
      });
      const measuredFunction = measureFunction(errorFunction, 'errorFunc');

      expect(() => measuredFunction()).toThrow('Test error');
      expect(mockPerformance.now).toHaveBeenCalledTimes(2);
    });
  });

  describe('measureAsyncFunction', () => {
    test('비동기 함수 실행 시간을 측정한다', async () => {
      mockPerformance.now
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(200);

      const asyncFunction = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return 'async result';
      });
      const measuredFunction = measureAsyncFunction(asyncFunction, 'asyncFunc');

      const result = await measuredFunction();

      expect(result).toBe('async result');
      expect(asyncFunction).toHaveBeenCalledWith('arg1');
      expect(mockPerformance.now).toHaveBeenCalledTimes(2);
    });

    test('비동기 함수에서 에러가 발생해도 측정을 완료한다', async () => {
      mockPerformance.now
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(150);

      const errorAsyncFunction = vi.fn(async () => {
        throw new Error('Async error');
      });
      const measuredFunction = measureAsyncFunction(errorAsyncFunction, 'errorAsyncFunc');

      await expect(measuredFunction()).rejects.toThrow('Async error');
      expect(mockPerformance.now).toHaveBeenCalledTimes(2);
    });
  });

  describe('trackImageLoading', () => {
    test('이미지 로딩 시간을 추적한다', () => {
      const src = '/path/to/image.jpg';
      const loadTime = 150;

      trackImageLoading(src, loadTime);

      // 개발 환경에서는 콘솔 로그가 출력됨
      if (import.meta.env.DEV) {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('Performance: ImageLoadTime'),
          expect.any(Number),
          expect.objectContaining({
            src: 'image.jpg'
          })
        );
      }
    });

    test('이미지 파일명만 추출하여 기록한다', () => {
      const src = 'https://example.com/uploads/user-images/profile.png';
      const loadTime = 200;

      trackImageLoading(src, loadTime);

      // 파일명만 추출되어 기록되는지 확인 (프라이버시 보호)
      if (import.meta.env.DEV) {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.anything(),
          expect.any(Number),
          expect.objectContaining({
            src: 'profile.png'
          })
        );
      }
    });
  });

  describe('trackMemoryUsage', () => {
    test('메모리 사용량을 추적한다', () => {
      trackMemoryUsage();

      if (import.meta.env.DEV) {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('Performance: MemoryUsed'),
          1024 * 1024,
          undefined
        );
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('Performance: MemoryTotal'),
          2048 * 1024,
          undefined
        );
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('Performance: MemoryLimit'),
          4096 * 1024,
          undefined
        );
      }
    });

    test('메모리 API가 없어도 에러가 발생하지 않는다', () => {
      const originalMemory = mockPerformance.memory;
      (mockPerformance as any).memory = undefined;

      expect(() => trackMemoryUsage()).not.toThrow();

      mockPerformance.memory = originalMemory;
    });
  });

  describe('usePerformanceMonitor', () => {
    test('성능 모니터링 훅이 올바른 메서드들을 반환한다', () => {
      const { recordMetric, getMetrics, getAverageMetric } = usePerformanceMonitor();

      expect(typeof recordMetric).toBe('function');
      expect(typeof getMetrics).toBe('function');
      expect(typeof getAverageMetric).toBe('function');
    });
  });
});