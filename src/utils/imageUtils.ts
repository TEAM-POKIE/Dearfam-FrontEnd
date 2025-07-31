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
