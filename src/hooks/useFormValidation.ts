import { useState, useCallback } from "react";
import { useWritePostStore } from "@/context/store/writePostStore";

interface ValidationState {
  title: { isValid: boolean; error?: string };
  content: { isValid: boolean; error?: string };
  date: { isValid: boolean; error?: string };
  images: { isValid: boolean; errors: string[] };
}

export const useFormValidation = () => {
  const { validateTitle, validateContent, validateDate, validateImages } =
    useWritePostStore();
  const [validationState, setValidationState] = useState<ValidationState>({
    title: { isValid: true },
    content: { isValid: true },
    date: { isValid: true },
    images: { isValid: true, errors: [] },
  });

  const [isDirty, setIsDirty] = useState({
    title: false,
    content: false,
    date: false,
    images: false,
  });

  // 실시간 제목 검증
  const validateTitleField = useCallback(
    (title: string) => {
      const result = validateTitle(title);
      setValidationState((prev) => ({
        ...prev,
        title: result,
      }));
      return result;
    },
    [validateTitle]
  );

  // 실시간 내용 검증
  const validateContentField = useCallback(
    (content: string) => {
      const result = validateContent(content);
      setValidationState((prev) => ({
        ...prev,
        content: result,
      }));
      return result;
    },
    [validateContent]
  );

  // 실시간 날짜 검증
  const validateDateField = useCallback(
    (date: string) => {
      const result = validateDate(date);
      setValidationState((prev) => ({
        ...prev,
        date: result,
      }));
      return result;
    },
    [validateDate]
  );

  // 실시간 이미지 검증
  const validateImagesField = useCallback(
    (images: File[]) => {
      const result = validateImages(images);
      setValidationState((prev) => ({
        ...prev,
        images: result,
      }));
      return result;
    },
    [validateImages]
  );

  // 필드 터치 상태 설정
  const setFieldDirty = useCallback((field: keyof typeof isDirty) => {
    setIsDirty((prev) => ({
      ...prev,
      [field]: true,
    }));
  }, []);

  // 전체 폼 유효성 확인
  const isFormValid = useCallback(() => {
    return (
      validationState.title.isValid &&
      validationState.content.isValid &&
      validationState.date.isValid &&
      validationState.images.isValid
    );
  }, [validationState]);

  // 모든 에러 메시지 수집
  const getAllErrors = useCallback(() => {
    const errors: string[] = [];

    if (!validationState.title.isValid && validationState.title.error) {
      errors.push(validationState.title.error);
    }
    if (!validationState.content.isValid && validationState.content.error) {
      errors.push(validationState.content.error);
    }
    if (!validationState.date.isValid && validationState.date.error) {
      errors.push(validationState.date.error);
    }
    if (!validationState.images.isValid) {
      errors.push(...validationState.images.errors);
    }

    return errors;
  }, [validationState]);

  // 검증 상태 초기화
  const resetValidation = useCallback(() => {
    setValidationState({
      title: { isValid: true },
      content: { isValid: true },
      date: { isValid: true },
      images: { isValid: true, errors: [] },
    });
    setIsDirty({
      title: false,
      content: false,
      date: false,
      images: false,
    });
  }, []);

  return {
    validationState,
    isDirty,
    validateTitleField,
    validateContentField,
    validateDateField,
    validateImagesField,
    setFieldDirty,
    isFormValid,
    getAllErrors,
    resetValidation,
  };
};
