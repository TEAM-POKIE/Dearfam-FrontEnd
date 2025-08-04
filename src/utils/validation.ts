import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// ===========================================
// 기본 검증 스키마들
// ===========================================

// 이메일 검증
export const emailSchema = z
  .string()
  .min(1, '이메일을 입력해주세요.')
  .email('올바른 이메일 형식을 입력해주세요.')
  .max(255, '이메일이 너무 깁니다.');

// 비밀번호 검증 (미래 사용을 위해)
export const passwordSchema = z
  .string()
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
  .max(128, '비밀번호가 너무 깁니다.')
  .regex(
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.'
  );

// 닉네임 검증
export const nicknameSchema = z
  .string()
  .min(2, '닉네임은 최소 2자 이상이어야 합니다.')
  .max(20, '닉네임은 최대 20자까지 가능합니다.')
  .regex(
    /^[가-힣a-zA-Z0-9_-]+$/,
    '닉네임은 한글, 영문, 숫자, 언더스코어, 하이픈만 사용 가능합니다.'
  );

// 가족 이름 검증
export const familyNameSchema = z
  .string()
  .min(2, '가족 이름은 최소 2자 이상이어야 합니다.')
  .max(50, '가족 이름은 최대 50자까지 가능합니다.')
  .regex(
    /^[가-힣a-zA-Z0-9\s_-]+$/,
    '가족 이름은 한글, 영문, 숫자, 공백, 언더스코어, 하이픈만 사용 가능합니다.'
  );

// 가족 코드 검증
export const familyCodeSchema = z
  .string()
  .length(8, '가족 코드는 8자리여야 합니다.')
  .regex(/^[A-Z0-9]+$/, '가족 코드는 대문자와 숫자만 포함해야 합니다.');

// 게시물 제목 검증
export const postTitleSchema = z
  .string()
  .min(1, '제목을 입력해주세요.')
  .max(100, '제목은 최대 100자까지 가능합니다.')
  .transform((val) => sanitizeHtml(val));

// 게시물 내용 검증
export const postContentSchema = z
  .string()
  .min(1, '내용을 입력해주세요.')
  .max(2000, '내용은 최대 2000자까지 가능합니다.')
  .transform((val) => sanitizeHtml(val));

// 댓글 내용 검증
export const commentContentSchema = z
  .string()
  .min(1, '댓글을 입력해주세요.')
  .max(500, '댓글은 최대 500자까지 가능합니다.')
  .transform((val) => sanitizeHtml(val));

// 파일 크기 검증 (바이트 단위)
export const fileSizeSchema = (maxSizeInMB: number) =>
  z.number().max(maxSizeInMB * 1024 * 1024, `파일 크기는 ${maxSizeInMB}MB 이하여야 합니다.`);

// 이미지 파일 타입 검증
export const imageFileTypeSchema = z
  .string()
  .refine(
    (type) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(type),
    '지원되는 이미지 형식: JPEG, PNG, WebP'
  );

// ===========================================
// 복합 스키마들
// ===========================================

// 사용자 프로필 업데이트
export const updateProfileSchema = z.object({
  nickname: nicknameSchema,
  profileImage: z.string().url().optional(),
});

// 가족 생성
export const createFamilySchema = z.object({
  name: familyNameSchema,
});

// 가족 참여
export const joinFamilySchema = z.object({
  code: familyCodeSchema,
});

// 메모리 포스트 생성/수정
export const memoryPostSchema = z.object({
  title: postTitleSchema,
  content: postContentSchema,
  images: z.array(z.string().url()).max(10, '이미지는 최대 10개까지 업로드 가능합니다.'),
});

// 댓글 생성/수정
export const commentSchema = z.object({
  content: commentContentSchema,
});

// 파일 업로드
export const fileUploadSchema = z.object({
  file: z.object({
    size: fileSizeSchema(10), // 10MB 제한
    type: imageFileTypeSchema,
    name: z.string().min(1, '파일명이 없습니다.'),
  }),
});

// ===========================================
// 보안 관련 유틸리티 함수들
// ===========================================

/**
 * HTML 새니타이징 - XSS 방지
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // DOMPurify를 사용하여 안전한 HTML만 허용
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
};

/**
 * SQL 인젝션 방지를 위한 특수문자 이스케이프
 */
export const escapeSpecialChars = (str: string): string => {
  if (!str) return '';
  
  return str
    .replace(/'/g, "''")
    .replace(/"/g, '""')
    .replace(/\\/g, '\\\\')
    .replace(/\0/g, '\\0')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\u001a/g, '\\Z');
};

/**
 * 파일명 새니타이징
 */
export const sanitizeFileName = (fileName: string): string => {
  if (!fileName) return '';
  
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_') // 안전한 문자만 허용
    .replace(/_{2,}/g, '_') // 연속된 언더스코어 제거
    .substring(0, 255); // 길이 제한
};

/**
 * URL 검증
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

/**
 * 이메일 형식 검증
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 전화번호 형식 검증 (한국)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * 안전한 정수 파싱
 */
export const safeParseInt = (value: string | number, defaultValue = 0): number => {
  if (typeof value === 'number') return Math.floor(value);
  
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * 안전한 실수 파싱
 */
export const safeParseFloat = (value: string | number, defaultValue = 0): number => {
  if (typeof value === 'number') return value;
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * 문자열 길이 제한
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
};

/**
 * 배열 크기 제한
 */
export const limitArraySize = <T>(array: T[], maxSize: number): T[] => {
  if (!Array.isArray(array)) return [];
  return array.slice(0, maxSize);
};

// ===========================================
// 환경 변수 검증
// ===========================================

/**
 * 필수 환경 변수 검증
 */
export const validateEnvironmentVariables = (): void => {
  const requiredEnvVars = [
    'VITE_API_URL',
    'VITE_KAKAO_REST_KEY',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  // API URL 형식 검증
  if (!isValidUrl(import.meta.env.VITE_API_URL)) {
    throw new Error('VITE_API_URL must be a valid URL');
  }

  console.log('✅ Environment variables validated successfully');
};

// ===========================================
// 커스텀 훅 - 폼 검증
// ===========================================

/**
 * 실시간 폼 검증 훅
 */
export const useFormValidation = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) => {
  const validateField = (fieldName: keyof T, value: unknown) => {
    try {
      const fieldSchema = schema.shape[fieldName];
      if (fieldSchema) {
        fieldSchema.parse(value);
        return { isValid: true, error: null };
      }
      return { isValid: true, error: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          error: error.errors[0]?.message || '유효하지 않은 값입니다.',
        };
      }
      return { isValid: false, error: '검증 중 오류가 발생했습니다.' };
    }
  };

  const validateForm = (data: z.infer<typeof schema>) => {
    try {
      schema.parse(data);
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        return { isValid: false, errors };
      }
      return { isValid: false, errors: { _form: '검증 중 오류가 발생했습니다.' } };
    }
  };

  return { validateField, validateForm };
};

// ===========================================
// 타입 정의
// ===========================================

export type ValidationResult = {
  isValid: boolean;
  error: string | null;
};

export type FormValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

// 스키마 타입 추출
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
export type CreateFamilyData = z.infer<typeof createFamilySchema>;
export type JoinFamilyData = z.infer<typeof joinFamilySchema>;
export type MemoryPostData = z.infer<typeof memoryPostSchema>;
export type CommentData = z.infer<typeof commentSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;