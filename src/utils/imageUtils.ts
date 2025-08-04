// 이미지 리사이징 유틸리티 함수
export const resizeImage = async (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // 비율 유지하면서 크기 조정
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // 캔버스를 Blob으로 변환
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas to Blob conversion failed"));
              return;
            }

            // 새로운 파일 생성
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(resizedFile);
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error("Image loading failed"));
      };
    };

    reader.onerror = () => {
      reject(new Error("File reading failed"));
    };
  });
};

// 이미지 포맷 최적화 (WebP 지원 검사 및 변환)
export const optimizeImageFormat = async (
  file: File,
  targetFormat: 'webp' | 'jpeg' | 'png' = 'webp',
  quality: number = 0.8
): Promise<File> => {
  // WebP 지원 검사
  const supportsWebP = await checkWebPSupport();
  const finalFormat = targetFormat === 'webp' && !supportsWebP ? 'jpeg' : targetFormat;
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        const mimeType = `image/${finalFormat}`;
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Format conversion failed"));
              return;
            }

            const fileName = file.name.replace(/\.[^/.]+$/, `.${finalFormat}`);
            const optimizedFile = new File([blob], fileName, {
              type: mimeType,
              lastModified: Date.now(),
            });

            resolve(optimizedFile);
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error("Image loading failed"));
      };
    };

    reader.onerror = () => {
      reject(new Error("File reading failed"));
    };
  });
};

// WebP 지원 검사
export const checkWebPSupport = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// 이미지 압축 (progressive JPEG 지원)
export const compressImage = async (
  file: File,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Cannot get canvas context"));
          return;
        }

        // 이미지 품질 향상을 위한 설정
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Compression failed"));
              return;
            }

            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error("Image loading failed"));
      };
    };

    reader.onerror = () => {
      reject(new Error("File reading failed"));
    };
  });
};

// 반응형 이미지 생성 (여러 크기)
export const generateResponsiveImages = async (
  file: File,
  sizes: number[] = [320, 640, 960, 1280, 1920],
  quality: number = 0.8
): Promise<{ size: number; file: File }[]> => {
  const results: { size: number; file: File }[] = [];
  
  for (const size of sizes) {
    try {
      const resizedFile = await resizeImage(file, size, size, quality);
      results.push({ size, file: resizedFile });
    } catch (error) {
      console.warn(`Failed to generate ${size}px version:`, error);
    }
  }
  
  return results;
};

// 이미지 블러 플레이스홀더 생성
export const generateBlurPlaceholder = async (
  file: File,
  size: number = 20,
  quality: number = 0.1
): Promise<string> => {
  const smallImage = await resizeImage(file, size, size, quality);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(smallImage);
    
    reader.onload = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to generate blur placeholder"));
    };
  });
};

// 이미지 메타데이터 추출
export const extractImageMetadata = (file: File): Promise<{
  width: number;
  height: number;
  size: number;
  type: string;
  aspectRatio: number;
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          size: file.size,
          type: file.type,
          aspectRatio: img.width / img.height,
        });
      };

      img.onerror = () => {
        reject(new Error("Failed to load image for metadata extraction"));
      };
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
  });
};

// 이미지 파일 유효성 검사
export const validateImage = (
  file: File
): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "지원하지 않는 이미지 형식입니다. (JPEG, PNG, GIF, WebP만 가능)",
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "파일 크기는 10MB 이하여야 합니다.",
    };
  }

  return { isValid: true };
};
