# MSW (Mock Service Worker) 서버 구조

노션 API 명세서를 기반으로 구현된 MSW 서버입니다. API 태그별로 폴더를 나누어 재사용성과 유지보수성을 높였습니다.

## 📁 폴더 구조

```
src/mocks/
├── types/
│   └── index.ts          # 공통 타입 정의
├── data/
│   └── mockData.ts       # Mock 데이터 생성 및 관리
├── handlers/
│   ├── familyHandlers.ts     # 가족 관련 API
│   ├── memoryPostHandlers.ts # 추억 게시글 관련 API
│   ├── usersHandlers.ts      # 사용자 관련 API
│   ├── commentHandlers.ts    # 댓글 관련 API
│   ├── likeHandlers.ts       # 좋아요 관련 API
│   ├── authHandlers.ts       # 인증 관련 API
│   ├── memoryHandlers.ts     # 기존 메모리 핸들러
│   └── index.ts              # 모든 핸들러 통합
├── browser.ts            # 브라우저용 MSW 설정
├── server.ts             # 서버용 MSW 설정
└── README.md             # 사용법 안내
```

## 🚀 구현된 API 목록

### 1. 가족 관련 API (family)

- `POST /api/v1/family` - 가족 생성
- `POST /api/v1/family/role` - 가족 내 역할 정하기
- `GET /api/v1/family/members/:familyId` - 가족 ID를 통한 가족 구성원 리스트 조회
- `GET /api/v1/family/members` - 사용자의 가족 구성원 리스트 조회
- `GET /api/v1/family/generate-link` - 가족 초대 링크 생성하기
- `POST /api/v1/family/join` - 가족 참여하기

### 2. 추억 게시글 관련 API (memory-post)

- `POST /api/v1/memory-post` - 추억게시글 생성
- `GET /api/v1/memory-post/recent` - 최근 게시글 조회
- `GET /api/v1/memory-post/time-order` - 전체 게시글 시간 순서 별 조회
- `GET /api/v1/memory-post/:postId` - ID를 통한 게시글 단일 조회
- `GET /api/v1/memory-post/:postId/family-members` - 게시글 참여 가족 리스트 조회
- `PUT /api/v1/memory-post/:postId` - 추억게시글 수정
- `DELETE /api/v1/memory-post/:postId` - 추억게시글 삭제

### 3. 사용자 관련 API (users)

- `GET /api/v1/users/user` - 로그인한 사용자 정보 조회
- `GET /api/v1/users/:userId` - id로 사용자 정보 조회
- `PUT /api/v1/users/nickname` - 사용자 이름 변경

### 4. 댓글 관련 API (comment)

- `POST /api/v1/memory-post/:postId/comment` - 추억게시글 댓글 생성
- `GET /api/v1/memory-post/:postId/comment` - 추억게시글의 댓글 전체 조회
- `DELETE /api/v1/memory-post/:postId/comment/:commentId` - 댓글 삭제

### 5. 좋아요 관련 API (like)

- `PUT /api/v1/memory-post/:postId/like` - 게시글 좋아요 토글
- `GET /api/v1/memory-post/:postId/like` - 게시글 좋아요 상태 조회

### 6. 인증 관련 API (auth)

- `POST /api/v1/auth/oauth2/login` - 카카오(소셜) 로그인
- `POST /api/v1/auth/refresh` - 토큰 새로고침
- `POST /api/v1/auth/logout` - 로그아웃

## 📦 사용법

### 1. 전체 핸들러 사용

```typescript
import { handlers } from "./mocks/handlers";

// 모든 API 핸들러가 포함됨
```

### 2. 태그별 핸들러 선택적 사용

```typescript
import {
  familyHandlers,
  memoryPostHandlers,
  usersHandlers,
} from "./mocks/handlers";

// 필요한 핸들러만 선택해서 사용
const customHandlers = [...familyHandlers, ...usersHandlers];
```

### 3. 개별 API 테스트

```typescript
// 특정 API만 테스트하고 싶을 때
import { familyHandlers } from "./mocks/handlers/familyHandlers";

// 개발 중인 기능만 mock 처리
```

## 🔧 Mock 데이터 커스터마이징

### 기본 사용자 정보 변경

```typescript
// src/mocks/data/mockData.ts
export const currentUser = {
  id: "your-user-id",
  nickname: "사용자 이름",
  email: "user@example.com",
  // ... 기타 필드
};
```

### 임시 데이터 생성

```typescript
import { generateMockMemoryPost } from "./mocks/data/mockData";

const customPost = generateMockMemoryPost({
  title: "커스텀 제목",
  content: "커스텀 내용",
});
```

## 🎯 특징

### 1. 재사용성

- API 태그별로 핸들러를 분리하여 필요한 부분만 선택적으로 사용 가능
- 공통 타입과 유틸리티 함수로 코드 중복 최소화

### 2. 유지보수성

- 각 API 태그별로 파일이 분리되어 있어 관리가 용이
- 일관된 응답 구조로 예측 가능한 API 동작

### 3. 가독성

- 각 핸들러에 명확한 주석과 설명
- 타입스크립트로 타입 안정성 보장
- 직관적인 폴더 구조

## 🛡️ 오류 처리

모든 API는 일관된 오류 응답 구조를 가집니다:

```typescript
{
  success: false,
  message: "오류 메시지",
  code: "ERROR_CODE",
  details?: any
}
```

## 📊 응답 구조

모든 성공 응답은 다음 구조를 따릅니다:

```typescript
{
  success: true,
  data: any,
  message: "성공 메시지"
}
```

## 🔄 실시간 데이터 업데이트

댓글과 좋아요 기능은 메모리 스토리지를 사용하여 실시간으로 상태가 업데이트됩니다:

- 댓글: `commentStorage` Map을 사용
- 좋아요: `likeStorage` Map을 사용

## 🚀 확장 방법

새로운 API 추가 시:

1. `src/mocks/handlers/` 폴더에 새로운 핸들러 파일 생성
2. `src/mocks/types/index.ts`에 필요한 타입 추가
3. `src/mocks/data/mockData.ts`에 Mock 데이터 생성 함수 추가
4. `src/mocks/handlers/index.ts`에 새로운 핸들러 import 및 export

이렇게 구성된 MSW 서버는 개발 중 실제 API 없이도 프론트엔드 개발과 테스트를 진행할 수 있게 해줍니다.
