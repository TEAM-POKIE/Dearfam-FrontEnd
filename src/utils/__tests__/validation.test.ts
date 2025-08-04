import { describe, test, expect, vi } from 'vitest';
import { 
  emailSchema,
  nicknameSchema,
  postTitleSchema,
  postContentSchema,
  sanitizeHtml,
  escapeSpecialChars,
  sanitizeFileName,
  isValidUrl,
  isValidEmail,
  isValidPhoneNumber,
  safeParseInt,
  safeParseFloat,
  truncateString,
  limitArraySize,
  validateEnvironmentVariables,
  useFormValidation
} from '../validation';

describe('Validation Schemas', () => {
  describe('emailSchema', () => {
    test('유효한 이메일을 통과시킨다', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.kr',
        'test+tag@gmail.com',
      ];

      validEmails.forEach(email => {
        expect(() => emailSchema.parse(email)).not.toThrow();
      });
    });

    test('유효하지 않은 이메일을 거부한다', () => {
      const invalidEmails = [
        '',
        'invalid-email',
        '@domain.com',
        'test@',
        'test..test@domain.com',
      ];

      invalidEmails.forEach(email => {
        expect(() => emailSchema.parse(email)).toThrow();
      });
    });
  });

  describe('nicknameSchema', () => {
    test('유효한 닉네임을 통과시킨다', () => {
      const validNicknames = [
        '홍길동',
        'user123',
        'test_name',
        'user-name',
        '테스트123',
      ];

      validNicknames.forEach(nickname => {
        expect(() => nicknameSchema.parse(nickname)).not.toThrow();
      });
    });

    test('유효하지 않은 닉네임을 거부한다', () => {
      const invalidNicknames = [
        '',
        'a',
        'a'.repeat(21),
        'user@name',
        'user name',
        'user!',
      ];

      invalidNicknames.forEach(nickname => {
        expect(() => nicknameSchema.parse(nickname)).toThrow();
      });
    });
  });

  describe('postTitleSchema', () => {
    test('유효한 제목을 통과시키고 HTML을 새니타이징한다', () => {
      const title = '<script>alert("xss")</script>안전한 제목';
      const result = postTitleSchema.parse(title);
      
      expect(result).not.toContain('<script>');
      expect(result).toContain('안전한 제목');
    });

    test('빈 제목을 거부한다', () => {
      expect(() => postTitleSchema.parse('')).toThrow();
    });

    test('너무 긴 제목을 거부한다', () => {
      const longTitle = 'a'.repeat(101);
      expect(() => postTitleSchema.parse(longTitle)).toThrow();
    });
  });

  describe('postContentSchema', () => {
    test('유효한 내용을 통과시키고 HTML을 새니타이징한다', () => {
      const content = '<p>안전한 내용</p><script>alert("xss")</script>';
      const result = postContentSchema.parse(content);
      
      expect(result).toContain('<p>안전한 내용</p>');
      expect(result).not.toContain('<script>');
    });

    test('빈 내용을 거부한다', () => {
      expect(() => postContentSchema.parse('')).toThrow();
    });

    test('너무 긴 내용을 거부한다', () => {
      const longContent = 'a'.repeat(2001);
      expect(() => postContentSchema.parse(longContent)).toThrow();
    });
  });
});

describe('Security Utilities', () => {
  describe('sanitizeHtml', () => {
    test('허용된 태그는 유지한다', () => {
      const html = '<p>안전한 내용</p><b>굵은 글씨</b><i>기울임</i>';
      const result = sanitizeHtml(html);
      
      expect(result).toContain('<p>안전한 내용</p>');
      expect(result).toContain('<b>굵은 글씨</b>');
      expect(result).toContain('<i>기울임</i>');
    });

    test('위험한 태그는 제거한다', () => {
      const html = '<script>alert("xss")</script><iframe src="evil.com"></iframe>';
      const result = sanitizeHtml(html);
      
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('<iframe>');
    });

    test('빈 문자열을 처리한다', () => {
      expect(sanitizeHtml('')).toBe('');
      expect(sanitizeHtml(null as any)).toBe('');
    });
  });

  describe('escapeSpecialChars', () => {
    test('SQL 인젝션 방지를 위해 특수문자를 이스케이프한다', () => {
      const input = "'; DROP TABLE users; --";
      const result = escapeSpecialChars(input);
      
      expect(result).toContain("''");
      expect(result).not.toContain("'");
    });

    test('빈 문자열을 처리한다', () => {
      expect(escapeSpecialChars('')).toBe('');
    });
  });

  describe('sanitizeFileName', () => {
    test('안전하지 않은 문자를 언더스코어로 변경한다', () => {
      const fileName = '../../../etc/passwd';
      const result = sanitizeFileName(fileName);
      
      expect(result).toBe('____etc_passwd');
    });

    test('연속된 언더스코어를 하나로 변경한다', () => {
      const fileName = 'file___name';
      const result = sanitizeFileName(fileName);
      
      expect(result).toBe('file_name');
    });

    test('파일명 길이를 제한한다', () => {
      const longFileName = 'a'.repeat(300);
      const result = sanitizeFileName(longFileName);
      
      expect(result.length).toBeLessThanOrEqual(255);
    });
  });
});

describe('Validation Utilities', () => {
  describe('isValidUrl', () => {
    test('유효한 URL을 인식한다', () => {
      const validUrls = [
        'https://example.com',
        'http://localhost:3000',
        'https://sub.domain.com/path?query=1',
      ];

      validUrls.forEach(url => {
        expect(isValidUrl(url)).toBe(true);
      });
    });

    test('유효하지 않은 URL을 거부한다', () => {
      const invalidUrls = [
        'ftp://example.com',
        'javascript:alert("xss")',
        'not-a-url',
        'https://',
      ];

      invalidUrls.forEach(url => {
        expect(isValidUrl(url)).toBe(false);
      });
    });
  });

  describe('isValidEmail', () => {
    test('유효한 이메일 형식을 인식한다', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.kr',
        'test+tag@gmail.com',
      ];

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    test('유효하지 않은 이메일 형식을 거부한다', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'test@',
        'test..test@domain.com',
      ];

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });

  describe('isValidPhoneNumber', () => {
    test('유효한 한국 전화번호를 인식한다', () => {
      const validNumbers = [
        '010-1234-5678',
        '01012345678',
        '011-123-4567',
        '010 1234 5678',
      ];

      validNumbers.forEach(number => {
        expect(isValidPhoneNumber(number)).toBe(true);
      });
    });

    test('유효하지 않은 전화번호를 거부한다', () => {
      const invalidNumbers = [
        '02-1234-5678',
        '010-123-456',
        '010-12345-6789',
        'abc-defg-hijk',
      ];

      invalidNumbers.forEach(number => {
        expect(isValidPhoneNumber(number)).toBe(false);
      });
    });
  });

  describe('safeParseInt', () => {
    test('유효한 정수를 파싱한다', () => {
      expect(safeParseInt('123')).toBe(123);
      expect(safeParseInt(456)).toBe(456);
      expect(safeParseInt('123.7')).toBe(123);
    });

    test('유효하지 않은 값에 대해 기본값을 반환한다', () => {
      expect(safeParseInt('abc')).toBe(0);
      expect(safeParseInt('abc', 100)).toBe(100);
      expect(safeParseInt('')).toBe(0);
    });
  });

  describe('safeParseFloat', () => {
    test('유효한 실수를 파싱한다', () => {
      expect(safeParseFloat('123.45')).toBe(123.45);
      expect(safeParseFloat(678.9)).toBe(678.9);
    });

    test('유효하지 않은 값에 대해 기본값을 반환한다', () => {
      expect(safeParseFloat('abc')).toBe(0);
      expect(safeParseFloat('abc', 1.5)).toBe(1.5);
    });
  });

  describe('truncateString', () => {
    test('긴 문자열을 자른다', () => {
      const longString = 'This is a very long string';
      const result = truncateString(longString, 10);
      
      expect(result).toBe('This is...');
      expect(result.length).toBe(10);
    });

    test('짧은 문자열은 그대로 유지한다', () => {
      const shortString = 'Short';
      const result = truncateString(shortString, 10);
      
      expect(result).toBe('Short');
    });
  });

  describe('limitArraySize', () => {
    test('배열 크기를 제한한다', () => {
      const largeArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = limitArraySize(largeArray, 5);
      
      expect(result).toEqual([1, 2, 3, 4, 5]);
      expect(result.length).toBe(5);
    });

    test('작은 배열은 그대로 유지한다', () => {
      const smallArray = [1, 2, 3];
      const result = limitArraySize(smallArray, 5);
      
      expect(result).toEqual([1, 2, 3]);
    });

    test('유효하지 않은 입력에 대해 빈 배열을 반환한다', () => {
      expect(limitArraySize(null as any, 5)).toEqual([]);
      expect(limitArraySize('not-array' as any, 5)).toEqual([]);
    });
  });
});

describe('Environment Validation', () => {
  describe('validateEnvironmentVariables', () => {
    test('필수 환경 변수가 없으면 에러를 발생시킨다', () => {
      // 환경 변수를 임시로 제거
      vi.stubEnv('VITE_API_URL', '');
      vi.stubEnv('VITE_KAKAO_REST_KEY', '');

      expect(() => validateEnvironmentVariables()).toThrow(
        'Missing required environment variables'
      );

      vi.unstubAllEnvs();
    });

    test('유효하지 않은 API URL에 대해 에러를 발생시킨다', () => {
      vi.stubEnv('VITE_API_URL', 'invalid-url');
      vi.stubEnv('VITE_KAKAO_REST_KEY', 'test-key');

      expect(() => validateEnvironmentVariables()).toThrow(
        'VITE_API_URL must be a valid URL'
      );

      vi.unstubAllEnvs();
    });

    test('유효한 환경 변수에 대해 성공한다', () => {
      vi.stubEnv('VITE_API_URL', 'https://api.example.com');
      vi.stubEnv('VITE_KAKAO_REST_KEY', 'test-key');

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      expect(() => validateEnvironmentVariables()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('✅ Environment variables validated successfully');

      consoleSpy.mockRestore();
      vi.unstubAllEnvs();
    });
  });
});

describe('useFormValidation', () => {
  test('필드 검증을 수행한다', () => {
    const schema = emailSchema;
    const { validateField } = useFormValidation({ email: schema });

    const validResult = validateField('email', 'test@example.com');
    expect(validResult.isValid).toBe(true);
    expect(validResult.error).toBeNull();

    const invalidResult = validateField('email', 'invalid-email');
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.error).toBeTruthy();
  });

  test('전체 폼 검증을 수행한다', () => {
    const schema = { email: emailSchema, nickname: nicknameSchema };
    const { validateForm } = useFormValidation(schema);

    const validData = { email: 'test@example.com', nickname: '홍길동' };
    const validResult = validateForm(validData);
    expect(validResult.isValid).toBe(true);
    expect(Object.keys(validResult.errors)).toHaveLength(0);

    const invalidData = { email: 'invalid', nickname: 'a' };
    const invalidResult = validateForm(invalidData);
    expect(invalidResult.isValid).toBe(false);
    expect(Object.keys(invalidResult.errors).length).toBeGreaterThan(0);
  });
});