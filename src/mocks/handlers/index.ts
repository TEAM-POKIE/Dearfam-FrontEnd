import { familyHandlers } from "./familyHandlers";
import { memoryPostHandlers } from "./memoryPostHandlers";
import { usersHandlers } from "./usersHandlers";
import { commentHandlers } from "./commentHandlers";
import { likeHandlers } from "./likeHandlers";
import { authHandlers } from "./authHandlers";
import { memoryHandlers } from "./memoryHandlers";

// 모든 핸들러를 API 태그별로 통합
export const handlers = [
  ...familyHandlers, // 가족 관련 API
  ...memoryPostHandlers, // 추억 게시글 관련 API
  ...usersHandlers, // 사용자 관련 API
  ...commentHandlers, // 댓글 관련 API
  ...likeHandlers, // 좋아요 관련 API
  ...authHandlers, // 인증 관련 API
  ...memoryHandlers, // 기존 메모리 핸들러 (호환성 유지)
];

// 태그별로 핸들러 export (선택적 사용)
export {
  familyHandlers,
  memoryPostHandlers,
  usersHandlers,
  commentHandlers,
  likeHandlers,
  authHandlers,
  memoryHandlers,
};
