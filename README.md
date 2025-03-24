# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

# DearFam 프로젝트

## 프로젝트 구조

```
src/
├── assets/            # 정적 파일 (이미지, 아이콘, 폰트 등)
├── components/        # 공통적으로 사용하는 UI 컴포넌트 모음
│   └── ui/            # 기본 UI 컴포넌트 (버튼, 카드, 입력 필드 등)
├── features/          # 특정 도메인(기능) 단위 컴포넌트 및 상태 관리
├── hooks/             # 커스텀 훅을 저장하는 곳
├── lib/               # 외부 라이브러리나 프로젝트의 핵심 유틸리티 파일 관리
│   ├── api/           # API 요청 관련 코드
│   ├── store/         # 상태 관리 라이브러리
│   └── validation/    # 입력값 검증 관련 로직
├── pages/             # 개별 페이지 컴포넌트
├── presenters/        # 비즈니스 로직 처리를 담당하는 부분
├── viewmodels/        # 상태 및 UI 데이터 관리
└── views/             # 실제 UI를 구성하는 부분
```

## 폴더 구조 설명

**🔹 assets/**

- 정적 파일 (이미지, 아이콘, 폰트 등)

**🔹 components/**

- 공통적으로 사용하는 UI 컴포넌트 모음 (버튼, 모달, 입력 필드 등)

**🔹 features/**

- 특정 도메인(기능) 단위 컴포넌트 및 상태 관리 포함
- (예: auth, dashboard, profile 같은 도메인별로 나뉘는 경우)

**🔹 hooks/**

- 커스텀 훅을 저장하는 곳
- (예: useAuth.ts, useDebounce.ts 등)

**🔹 lib/**

- 외부 라이브러리나 프로젝트의 핵심 유틸리티 파일 관리
- api/: API 요청 관련 코드 (axios 관련 설정)
- store/: 상태 관리 라이브러리 (예: Zustand 또는 Redux)
- validation/: 입력값 검증 관련 로직 (예: Yup 또는 Zod)
- utils.ts: 공통적으로 사용되는 유틸리티 함수 모음

**🔹 pages/**

- 개별 페이지 컴포넌트
- (예: Login.tsx, Dashboard.tsx 등)

**🔹 presenters/**

- 비즈니스 로직 처리를 담당하는 부분
- ViewModel과 분리해서 UI 로직과 데이터 처리 로직을 명확히 구분하는 역할
- 예를 들면, 컴포넌트에서 직접 API 요청을 하지 않고 Presenter를 통해 호출하도록 설계 가능

**🔹 viewmodels/**

- ViewModel (상태 및 UI 데이터 관리)
- 상태를 관리하면서 View(UI)와 Model(API, Store) 사이를 연결하는 역할
- 예를 들어, React의 Zustand, Recoil 같은 상태 관리 라이브러리를 활용할 수 있음

**🔹 views/**

- 실제 UI를 구성하는 부분
- Presenter 또는 ViewModel에서 데이터를 받아서 UI를 렌더링하는 역할
