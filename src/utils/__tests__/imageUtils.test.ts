import { describe, test, expect, vi, beforeEach } from 'vitest';
import { 
  validateImage, 
  checkWebPSupport, 
  extractImageMetadata,
  optimizeImageFormat,
  compressImage,
  generateBlurPlaceholder
} from '../imageUtils';

// Canvas 모킹
const mockCanvas = {
  width: 0,
  height: 0,
  getContext: vi.fn(() => ({
    drawImage: vi.fn(),
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
    canvas: mockCanvas,
    getContextAttributes: vi.fn(() => ({})),
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
  })),
  toBlob: vi.fn(),
};

global.HTMLCanvasElement.prototype.getContext = mockCanvas.getContext as any;
Object.defineProperty(global.HTMLCanvasElement.prototype, 'width', {
  get: () => mockCanvas.width,
  set: (value) => { mockCanvas.width = value; },
});
Object.defineProperty(global.HTMLCanvasElement.prototype, 'height', {
  get: () => mockCanvas.height,
  set: (value) => { mockCanvas.height = value; },
});
Object.defineProperty(global.HTMLCanvasElement.prototype, 'toBlob', {
  value: mockCanvas.toBlob,
});

// Image 모킹
const mockImage = {
  width: 1920,
  height: 1080,
  onload: null as (() => void) | null,
  onerror: null as (() => void) | null,
  src: '',
};

global.Image = vi.fn(() => mockImage) as any;

// FileReader 모킹
const mockFileReader = {
  readAsDataURL: vi.fn(),
  onload: null as ((event: any) => void) | null,
  onerror: null as (() => void) | null,
  result: 'data:image/jpeg;base64,mock-data',
};

global.FileReader = vi.fn(() => mockFileReader) as any;

describe('Image Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCanvas.toBlob.mockImplementation((callback, type, quality) => {
      const mockBlob = new Blob(['mock-blob-data'], { type: type || 'image/jpeg' });
      callback(mockBlob);
    });
  });

  describe('validateImage', () => {
    test('유효한 이미지 파일을 통과시킨다', () => {
      const file = new File(['mock-data'], 'test.jpg', { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 }); // 5MB

      const result = validateImage(file);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('지원하지 않는 파일 타입을 거부한다', () => {
      const file = new File(['mock-data'], 'test.bmp', { 
        type: 'image/bmp',
        lastModified: Date.now()
      });

      const result = validateImage(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('지원하지 않는 이미지 형식');
    });

    test('파일 크기가 너무 큰 경우 거부한다', () => {
      const file = new File(['mock-data'], 'test.jpg', { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      Object.defineProperty(file, 'size', { value: 15 * 1024 * 1024 }); // 15MB

      const result = validateImage(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('10MB 이하');
    });

    test('지원하는 모든 이미지 타입을 허용한다', () => {
      const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      
      supportedTypes.forEach(type => {
        const file = new File(['mock-data'], `test.${type.split('/')[1]}`, { 
          type,
          lastModified: Date.now()
        });
        Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB

        const result = validateImage(file);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('checkWebPSupport', () => {
    test('WebP 지원을 올바르게 감지한다', async () => {
      // WebP 지원 시뮬레이션
      setTimeout(() => {
        mockImage.height = 2; // WebP 지원 시 height가 2가 됨
        mockImage.onload?.();
      }, 10);

      const supportsWebP = await checkWebPSupport();
      expect(supportsWebP).toBe(true);
    });

    test('WebP 미지원을 올바르게 감지한다', async () => {
      // WebP 미지원 시뮬레이션
      setTimeout(() => {
        mockImage.height = 0; // WebP 미지원 시 height가 0
        mockImage.onload?.();
      }, 10);

      const supportsWebP = await checkWebPSupport();
      expect(supportsWebP).toBe(false);
    });
  });

  describe('extractImageMetadata', () => {
    test('이미지 메타데이터를 올바르게 추출한다', async () => {
      const file = new File(['mock-data'], 'test.jpg', { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      Object.defineProperty(file, 'size', { value: 2048 * 1024 }); // 2MB

      // FileReader onload 시뮬레이션
      setTimeout(() => {
        mockFileReader.onload?.({ target: { result: 'data:image/jpeg;base64,mock' } });
      }, 10);

      // Image onload 시뮬레이션
      setTimeout(() => {
        mockImage.width = 1920;
        mockImage.height = 1080;
        mockImage.onload?.();
      }, 20);

      const metadata = await extractImageMetadata(file);

      expect(metadata).toEqual({
        width: 1920,
        height: 1080,
        size: 2048 * 1024,
        type: 'image/jpeg',
        aspectRatio: 1920 / 1080,
      });
    });

    test('이미지 로드 실패 시 에러를 발생시킨다', async () => {
      const file = new File(['mock-data'], 'broken.jpg', { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      // FileReader onload 시뮬레이션
      setTimeout(() => {
        mockFileReader.onload?.({ target: { result: 'data:image/jpeg;base64,mock' } });
      }, 10);

      // Image onerror 시뮬레이션
      setTimeout(() => {
        mockImage.onerror?.();
      }, 20);

      await expect(extractImageMetadata(file)).rejects.toThrow('Failed to load image');
    });
  });

  describe('optimizeImageFormat', () => {
    test('WebP 형식으로 최적화한다', async () => {
      const file = new File(['mock-data'], 'test.jpg', { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      // WebP 지원 시뮬레이션
      setTimeout(() => {
        mockImage.height = 2;
        mockImage.onload?.();
      }, 10);

      // FileReader와 Image 로딩 시뮬레이션
      setTimeout(() => {
        mockFileReader.onload?.({ target: { result: 'data:image/jpeg;base64,mock' } });
        setTimeout(() => {
          mockImage.onload?.();
        }, 5);
      }, 20);

      const optimizedFile = await optimizeImageFormat(file, 'webp', 0.8);

      expect(optimizedFile.name).toBe('test.webp');
      expect(optimizedFile.type).toBe('image/webp');
    });

    test('WebP 미지원 시 JPEG로 폴백한다', async () => {
      const file = new File(['mock-data'], 'test.png', { 
        type: 'image/png',
        lastModified: Date.now()
      });

      // WebP 미지원 시뮬레이션
      setTimeout(() => {
        mockImage.height = 0;
        mockImage.onload?.();
      }, 10);

      // FileReader와 Image 로딩 시뮬레이션
      setTimeout(() => {
        mockFileReader.onload?.({ target: { result: 'data:image/png;base64,mock' } });
        setTimeout(() => {
          mockImage.onload?.();
        }, 5);
      }, 20);

      const optimizedFile = await optimizeImageFormat(file, 'webp', 0.8);

      expect(optimizedFile.name).toBe('test.jpeg');
      expect(optimizedFile.type).toBe('image/jpeg');
    });
  });

  describe('compressImage', () => {
    test('이미지를 압축한다', async () => {
      const file = new File(['mock-data'], 'test.jpg', { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      // FileReader와 Image 로딩 시뮬레이션
      setTimeout(() => {
        mockFileReader.onload?.({ target: { result: 'data:image/jpeg;base64,mock' } });
        setTimeout(() => {
          mockImage.onload?.();
        }, 5);
      }, 10);

      const compressedFile = await compressImage(file, 0.6);

      expect(compressedFile.type).toBe('image/jpeg');
      expect(mockCanvas.getContext).toHaveBeenCalled();
      expect(mockCanvas.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        'image/jpeg',
        0.6
      );
    });

    test('canvas context를 가져올 수 없으면 에러를 발생시킨다', async () => {
      const file = new File(['mock-data'], 'test.jpg', { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      // getContext가 null을 반환하도록 모킹
      mockCanvas.getContext.mockReturnValueOnce(null as any);

      // FileReader onload 시뮬레이션
      setTimeout(() => {
        mockFileReader.onload?.({ target: { result: 'data:image/jpeg;base64,mock' } });
        setTimeout(() => {
          mockImage.onload?.();
        }, 5);
      }, 10);

      await expect(compressImage(file, 0.8)).rejects.toThrow('Cannot get canvas context');
    });
  });

  describe('generateBlurPlaceholder', () => {
    test('블러 플레이스홀더를 생성한다', async () => {
      const file = new File(['mock-data'], 'test.jpg', { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      // 여러 단계의 비동기 처리 시뮬레이션
      setTimeout(() => {
        // 첫 번째 resizeImage 호출
        mockFileReader.onload?.({ target: { result: 'data:image/jpeg;base64,mock' } });
        setTimeout(() => {
          mockImage.onload?.();
          // 두 번째 FileReader 호출 (generateBlurPlaceholder)
          setTimeout(() => {
            mockFileReader.onload?.({ target: { result: 'data:image/jpeg;base64,mock' } } as any);
          }, 10);
        }, 10);
      }, 10);

      const blurDataURL = await generateBlurPlaceholder(file, 20, 0.1);

      expect(blurDataURL).toBe('data:image/jpeg;base64,mock-data');
    });
  });
});