import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { OptimizedImage, useImagePreload } from '../OptimizedImage';

// IntersectionObserver 모킹
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
});
window.IntersectionObserver = mockIntersectionObserver;

describe('OptimizedImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('기본 props로 이미지를 렌더링한다', () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image" 
      />
    );

    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
  });

  test('lazy loading이 활성화되면 IntersectionObserver를 사용한다', () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image" 
        lazy={true}
      />
    );

    expect(mockIntersectionObserver).toHaveBeenCalled();
    expect(mockIntersectionObserver.mock.calls[0][1]).toEqual({
      rootMargin: '50px',
      threshold: 0.1,
    });
  });

  test('priority가 true이면 lazy loading을 비활성화한다', () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image" 
        lazy={true}
        priority={true}
      />
    );

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('loading', 'eager');
  });

  test('이미지 로드 실패 시 fallback 이미지를 표시한다', async () => {
    const fallbackSrc = '/fallback.jpg';
    
    render(
      <OptimizedImage 
        src="/broken-image.jpg" 
        alt="Test image"
        fallbackSrc={fallbackSrc}
        priority={true}
      />
    );

    const img = screen.getByAltText('Test image');
    
    // 이미지 로드 실패 시뮬레이션
    fireEvent.error(img);

    await waitFor(() => {
      expect(img).toHaveAttribute('src', fallbackSrc);
    });
  });

  test('placeholder를 표시한다', () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image"
        placeholder="Loading..."
        priority={true}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('blurDataURL이 제공되면 블러 플레이스홀더를 표시한다', () => {
    const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...';
    
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image"
        blurDataURL={blurDataURL}
        priority={true}
      />
    );

    const blurImg = screen.getByRole('img', { hidden: true });
    expect(blurImg).toHaveAttribute('src', blurDataURL);
    expect(blurImg).toHaveClass('blur-md');
  });

  test('이미지 로드 완료 시 onLoad 콜백을 호출한다', async () => {
    const onLoadMock = vi.fn();
    
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image"
        onLoad={onLoadMock}
        priority={true}
      />
    );

    const img = screen.getByAltText('Test image');
    
    // 이미지 로드 완료 시뮬레이션
    fireEvent.load(img);

    await waitFor(() => {
      expect(onLoadMock).toHaveBeenCalled();
    });
  });

  test('이미지 로드 실패 시 onError 콜백을 호출한다', async () => {
    const onErrorMock = vi.fn();
    
    render(
      <OptimizedImage 
        src="/broken-image.jpg" 
        alt="Test image"
        onError={onErrorMock}
        priority={true}
      />
    );

    const img = screen.getByAltText('Test image');
    
    // 이미지 로드 실패 시뮬레이션
    fireEvent.error(img);

    await waitFor(() => {
      expect(onErrorMock).toHaveBeenCalled();
    });
  });

  test('quality 파라미터가 src에 적용된다', () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image"
        quality={60}
        priority={true}
      />
    );

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('src', '/test-image.jpg?q=60');
  });

  test('sizes 속성이 올바르게 적용된다', () => {
    const sizes = '(max-width: 768px) 100vw, 50vw';
    
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image"
        sizes={sizes}
        priority={true}
      />
    );

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('sizes', sizes);
  });
});

describe('useImagePreload', () => {
  test('이미지들을 preload 한다', () => {
    const TestComponent = () => {
      useImagePreload(['/image1.jpg', '/image2.jpg']);
      return <div>Test</div>;
    };

    render(<TestComponent />);

    // preload link 태그들이 head에 추가되었는지 확인
    const preloadLinks = document.querySelectorAll('link[rel="preload"][as="image"]');
    expect(preloadLinks).toHaveLength(2);
    expect(preloadLinks[0]).toHaveAttribute('href', '/image1.jpg');
    expect(preloadLinks[1]).toHaveAttribute('href', '/image2.jpg');
  });
});