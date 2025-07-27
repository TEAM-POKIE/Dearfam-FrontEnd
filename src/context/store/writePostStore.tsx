import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { PostMemoryPostRequest } from "@/data/api/memory-post/type";

interface WritePostState {
  // 게시물 데이터
  title: string;
  content: string;
  memoryDate: string;
  participantFamilyMemberIds: number[];
  images: File[];

  // UI 상태
  isSubmitting: boolean;

  // 액션들
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setMemoryDate: (date: string) => void;
  setParticipantIds: (ids: number[]) => void;
  addParticipantId: (id: number) => void;
  removeParticipantId: (id: number) => void;
  setImages: (images: File[]) => void;
  addImage: (image: File) => void;
  removeImage: (index: number) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;

  // 유틸리티
  getPostData: () => PostMemoryPostRequest;
  resetForm: () => void;
  validateForm: () => { isValid: boolean; errors: string[] };

  // 개별 필드 검증
  validateTitle: (title: string) => { isValid: boolean; error?: string };
  validateContent: (content: string) => { isValid: boolean; error?: string };
  validateDate: (date: string) => { isValid: boolean; error?: string };
  validateImages: (images: File[]) => { isValid: boolean; errors: string[] };
}

const initialState = {
  title: "",
  content: "",
  memoryDate: new Date().toISOString().split("T")[0], // 오늘 날짜를 기본값으로
  participantFamilyMemberIds: [],
  images: [],
  isSubmitting: false,
};

export const useWritePostStore = create<WritePostState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // 기본 setter들
      setTitle: (title) => set({ title }, false, "setTitle"),
      setContent: (content) => set({ content }, false, "setContent"),
      setMemoryDate: (memoryDate) =>
        set({ memoryDate }, false, "setMemoryDate"),
      setParticipantIds: (participantFamilyMemberIds) =>
        set({ participantFamilyMemberIds }, false, "setParticipantIds"),
      setImages: (images) => set({ images }, false, "setImages"),
      setIsSubmitting: (isSubmitting) =>
        set({ isSubmitting }, false, "setIsSubmitting"),

      // 참여자 관리
      addParticipantId: (id) => {
        const { participantFamilyMemberIds } = get();
        if (!participantFamilyMemberIds.includes(id)) {
          set(
            { participantFamilyMemberIds: [...participantFamilyMemberIds, id] },
            false,
            "addParticipantId"
          );
        }
      },

      removeParticipantId: (id) => {
        const { participantFamilyMemberIds } = get();
        set(
          {
            participantFamilyMemberIds: participantFamilyMemberIds.filter(
              (pid) => pid !== id
            ),
          },
          false,
          "removeParticipantId"
        );
      },

      // 이미지 관리
      addImage: (image) => {
        const { images } = get();
        set({ images: [...images, image] }, false, "addImage");
      },

      removeImage: (index) => {
        const { images } = get();
        set(
          { images: images.filter((_, i) => i !== index) },
          false,
          "removeImage"
        );
      },

      // API 요청용 데이터 반환
      getPostData: (): PostMemoryPostRequest => {
        const {
          title,
          content,
          memoryDate,
          participantFamilyMemberIds,
          images,
        } = get();
        return {
          title,
          content,
          memoryDate,
          participantFamilyMemberIds,
          images: images.length > 0 ? images : undefined,
        };
      },

      // 폼 검증
      validateForm: () => {
        const { title, content, memoryDate, images } = get();
        const errors: string[] = [];

        // 개별 필드 검증 결과 수집
        const titleValidation = get().validateTitle(title);
        const contentValidation = get().validateContent(content);
        const dateValidation = get().validateDate(memoryDate);
        const imagesValidation = get().validateImages(images);

        // 에러 메시지 수집
        if (!titleValidation.isValid) {
          errors.push(titleValidation.error!);
        }
        if (!contentValidation.isValid) {
          errors.push(contentValidation.error!);
        }
        if (!dateValidation.isValid) {
          errors.push(dateValidation.error!);
        }
        if (!imagesValidation.isValid) {
          errors.push(...imagesValidation.errors);
        }

        return {
          isValid: errors.length === 0,
          errors,
        };
      },

      // 폼 초기화
      resetForm: () => set(initialState, false, "resetForm"),

      // 개별 필드 검증 함수들
      validateTitle: (title: string) => {
        if (!title.trim()) {
          return { isValid: false, error: "제목을 입력해주세요." };
        }
        if (title.trim().length < 1) {
          return {
            isValid: false,
            error: "제목은 최소 1자 이상 입력해주세요.",
          };
        }
        if (title.trim().length > 20) {
          return {
            isValid: false,
            error: "제목은 최대 20자까지 입력 가능합니다.",
          };
        }
        return { isValid: true };
      },

      validateContent: (content: string) => {
        if (!content.trim()) {
          return { isValid: false, error: "내용을 입력해주세요." };
        }
        if (content.trim().length < 1) {
          return {
            isValid: false,
            error: "내용은 최소 10자 이상 입력해주세요.",
          };
        }
        if (content.trim().length > 500) {
          return {
            isValid: false,
            error: "내용은 최대 500자까지 입력 가능합니다.",
          };
        }
        return { isValid: true };
      },

      validateDate: (date: string) => {
        if (!date) {
          return { isValid: false, error: "날짜를 선택해주세요." };
        }
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        if (selectedDate > today) {
          return { isValid: false, error: "미래 날짜는 선택할 수 없습니다." };
        }
        return { isValid: true };
      },

      validateImages: (images: File[]) => {
        const errors: string[] = [];
        const maxImageSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ];

        if (images.length > 10) {
          errors.push("이미지는 최대 10개까지 업로드 가능합니다.");
        }

        for (let i = 0; i < images.length; i++) {
          const image = images[i];

          if (!allowedTypes.includes(image.type)) {
            errors.push(
              `이미지 ${
                i + 1
              }: 지원하지 않는 파일 형식입니다. (JPEG, PNG, GIF, WebP만 가능)`
            );
          }

          if (image.size > maxImageSize) {
            errors.push(`이미지 ${i + 1}: 파일 크기는 10MB 이하여야 합니다.`);
          }
        }

        return { isValid: errors.length === 0, errors };
      },
    }),
    { name: "write-post-store" }
  )
);
