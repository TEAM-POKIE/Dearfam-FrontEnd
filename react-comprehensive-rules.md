# 🚀 Modern React + TypeScript 종합 개발 가이드

## 📂 폴더 구조 및 아키텍처

### 📋 페이지 중심 구조 (Page-Centric Architecture)
```
src/
├── pages/                    # 페이지별 코드 격리
│   ├── Home/
│   │   ├── index.tsx        # 페이지 진입점 (라우팅)
│   │   ├── HomeView.tsx     # UI 컴포넌트
│   │   ├── HomeViewModel.tsx # 상태 관리 로직
│   │   ├── HomePresenter.tsx # 비즈니스 로직
│   │   ├── components/      # 해당 페이지 전용 컴포넌트
│   │   └── hooks/           # 해당 페이지 전용 훅
│   └── Login/
│       ├── index.tsx
│       ├── LoginForm.tsx
│       └── useLogin.ts
├── components/               # 전역 재사용 컴포넌트
│   ├── ui/                  # 기본 UI 요소
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── Card.tsx
│   └── form/                # 폼 관련 컴포넌트
│       ├── FormInput.tsx
│       └── FormSelect.tsx
├── hooks/                   # 전역 커스텀 훅
├── lib/                     # 라이브러리 설정 및 유틸리티
│   ├── api/                # API 관련
│   ├── store/              # 전역 상태 관리
│   └── validation/         # 유효성 검사 스키마
├── context/                # React Context
├── assets/                 # 정적 파일
├── data/                   # 상수, JSON 데이터
└── utils/                  # 순수 함수 유틸리티
```

**🎯 이 구조의 장점:**
- **코드 격리**: 페이지별 코드와 전역 코드 명확히 분리
- **유지보수성**: 관련 코드가 한 곳에 모여있어 수정이 용이
- **확장성**: 새로운 페이지 추가 시 독립적으로 개발 가능
- **코드 재사용**: 전역 컴포넌트와 훅의 효율적 재사용

## 🔧 기술 스택 및 최적화

### ⚡ React 18+ 성능 최적화
```typescript
// 1. React.memo + useMemo + useCallback 조합
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  // 복잡한 계산 메모화
  const processedData = useMemo(() => {
    return data.map(item => expensiveCalculation(item));
  }, [data]);

  // 콜백 함수 메모화
  const handleUpdate = useCallback((id: string) => {
    onUpdate(id);
  }, [onUpdate]);

  return <div>{/* 렌더링 로직 */}</div>;
});

// 2. Concurrent Features 활용
import { startTransition, useDeferredValue } from 'react';

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  // 급하지 않은 업데이트를 지연시켜 성능 최적화
}

// 3. Suspense + Error Boundary
function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<LoadingSpinner />}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### 🗄️ Zustand 상태 관리 최적화
```typescript
// lib/store/userStore.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  // Actions
  setUser: (user: User) => void;
  clearUser: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// 성능 최적화를 위한 선택적 구독
export const useUserStore = create<UserState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      
      setUser: (user) => set({ user }, false, 'setUser'),
      clearUser: () => set({ user: null }, false, 'clearUser'),
      
      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          const updatedUser = await updateUserProfile(data);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      }
    }))
  )
);

// 컴포넌트에서 선택적 구독
function UserProfile() {
  // 필요한 상태만 구독하여 불필요한 리렌더링 방지
  const user = useUserStore((state) => state.user);
  const updateProfile = useUserStore((state) => state.updateProfile);
  
  return <div>{/* UI 로직 */}</div>;
}
```

### 🌐 TanStack Query 서버 상태 최적화
```typescript
// lib/api/queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 쿼리 키 팩토리 패턴
export const queryKeys = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  userPosts: (id: string) => ['users', id, 'posts'] as const,
} as const;

// 최적화된 쿼리 훅
export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => fetchUser(id),
    staleTime: 5 * 60 * 1000, // 5분간 신선한 상태 유지
    cacheTime: 10 * 60 * 1000, // 10분간 캐시 유지
    retry: 3,
    refetchOnWindowFocus: false,
    // 조건부 쿼리 실행
    enabled: !!id,
  });
}

// 낙관적 업데이트를 통한 UX 최적화
export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUser,
    onMutate: async (newUserData) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: queryKeys.user(newUserData.id) });
      
      // 이전 데이터 백업
      const previousUser = queryClient.getQueryData(queryKeys.user(newUserData.id));
      
      // 낙관적 업데이트
      queryClient.setQueryData(queryKeys.user(newUserData.id), {
        ...previousUser,
        ...newUserData,
      });
      
      return { previousUser };
    },
    onError: (err, newUserData, context) => {
      // 에러 시 롤백
      if (context?.previousUser) {
        queryClient.setQueryData(queryKeys.user(newUserData.id), context.previousUser);
      }
    },
    onSettled: (data, error, variables) => {
      // 쿼리 무효화하여 최신 데이터 가져오기
      queryClient.invalidateQueries({ queryKey: queryKeys.user(variables.id) });
    },
  });
}
```

### 🛡️ Zod 유효성 검사 최적화
```typescript
// lib/validation/schemas.ts
import { z } from 'zod';

// 재사용 가능한 스키마 조각
const emailSchema = z.string().email('유효한 이메일을 입력해주세요');
const passwordSchema = z
  .string()
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
  .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, '영문과 숫자를 포함해야 합니다');

// 성능 최적화를 위한 스키마 캐싱
export const userSchemas = {
  login: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
  
  register: z.object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  }),
  
  profile: z.object({
    name: z.string().min(2),
    age: z.number().min(1).max(120),
    bio: z.string().max(500).optional(),
  }),
} as const;

// React Hook Form과 통합
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchemas.login),
    mode: 'onBlur', // 성능 최적화를 위한 검증 타이밍
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 폼 필드 */}
    </form>
  );
}
```

## 📁 현재 프로젝트 구조 분석 및 파일 배치 가이드

### 🔄 기존 구조 vs 권장 구조 비교

#### 현재 프로젝트 구조의 강점:
✅ **페이지별 폴더링**: `src/pages/` 구조로 이미 페이지 중심 아키텍처 적용  
✅ **컴포넌트 분리**: `components/ui/` 구조로 UI 컴포넌트 체계화  
✅ **상태 관리 분리**: `context/store/` 로 전역 상태 관리 구조화  
✅ **API 레이어 분리**: `lib/api.ts` 로 API 로직 분리  

#### 🎯 개선 권장 사항:

```typescript
// 📂 기존 구조
src/pages/Home/
├── index.tsx
├── HomeView.tsx
├── components/
│   └── CommentContent.tsx
└── eventGallery.tsx

// 🚀 권장 구조
src/pages/Home/
├── index.tsx           # 라우팅 진입점
├── HomeView.tsx        # UI 컴포넌트 (기존 유지)
├── HomeViewModel.tsx   # 상태 관리 로직 (신규)
├── HomePresenter.tsx   # 비즈니스 로직 (신규)
├── components/         # 페이지 전용 컴포넌트
│   ├── CommentContent.tsx
│   ├── EventCarousel.tsx
│   └── ImageWithProfiles.tsx
└── hooks/              # 페이지 전용 훅 (신규)
    ├── useHomeData.ts
    └── useEventGallery.ts
```

### 📋 구체적인 파일 배치 가이드

#### 1️⃣ **pages/ 폴더 최적화**
```typescript
// ✅ 권장: 페이지별 완전한 격리
src/pages/Home/
├── index.tsx                 # 라우팅 + 데이터 로딩
├── HomeView.tsx             # UI 렌더링 담당
├── HomeViewModel.tsx        # 로컬 상태 + UI 로직
├── HomePresenter.tsx        # 비즈니스 로직
├── components/              # Home 페이지 전용 컴포넌트
│   ├── EventCarousel.tsx
│   ├── CommentContent.tsx
│   └── InputContainer.tsx
├── hooks/                   # Home 페이지 전용 훅
│   ├── useHomeData.ts
│   └── useCommentHandler.ts
├── types.ts                 # Home 페이지 타입 정의
└── constants.ts            # Home 페이지 상수

// 실제 구현 예시
// pages/Home/HomeViewModel.tsx
export function useHomeViewModel() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const presenter = useMemo(() => new HomePresenter(), []);
  
  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await presenter.fetchHomeEvents();
      setEvents(data);
    } finally {
      setIsLoading(false);
    }
  }, [presenter]);

  return { events, isLoading, loadEvents };
}
```

#### 2️⃣ **lib/ 폴더 구조화**
```typescript
// 현재: src/lib/api.ts
// 권장: 기능별 분리
src/lib/
├── api/
│   ├── index.ts           # API 클라이언트 설정
│   ├── types.ts           # API 타입 정의
│   ├── endpoints.ts       # API 엔드포인트
│   ├── auth.ts           # 인증 관련 API
│   ├── user.ts           # 사용자 관련 API
│   └── events.ts         # 이벤트 관련 API
├── store/                # Zustand 스토어
│   ├── index.ts          # 스토어 결합
│   ├── authStore.ts      # 인증 상태
│   ├── userStore.ts      # 사용자 상태
│   └── uiStore.ts        # UI 상태 (헤더, 캐러셀 등)
├── validation/           # Zod 스키마
│   ├── user.ts
│   ├── auth.ts
│   └── common.ts
└── constants/            # 전역 상수
    ├── api.ts
    ├── routes.ts
    └── ui.ts

// 실제 구현 예시
// lib/api/index.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// 자동 토큰 추가
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { apiClient };
```

#### 3️⃣ **context/ → lib/store/ 마이그레이션**
```typescript
// 기존: src/context/store/headerStore.ts
// 권장: src/lib/store/uiStore.ts (통합)

// ❌ 기존 방식: 분산된 작은 스토어들
export const useHeaderStore = create((set) => ({
  title: '',
  setTitle: (title: string) => set({ title }),
}));

export const useCarouselStore = create((set) => ({
  currentIndex: 0,
  setIndex: (index: number) => set({ currentIndex: index }),
}));

// ✅ 권장: 관련 상태 통합
export const useUIStore = create<UIState>()(
  devtools((set, get) => ({
    // Header 관련
    header: {
      title: '',
      showBackButton: false,
      rightAction: null,
    },
    
    // Carousel 관련
    carousel: {
      currentIndex: 0,
      autoPlay: true,
      interval: 3000,
    },
    
    // Modal 관련
    modal: {
      isOpen: false,
      content: null,
    },
    
    // Actions
    setHeader: (header: Partial<HeaderState>) => 
      set(state => ({ 
        header: { ...state.header, ...header } 
      }), false, 'setHeader'),
      
    setCarousel: (carousel: Partial<CarouselState>) =>
      set(state => ({
        carousel: { ...state.carousel, ...carousel }
      }), false, 'setCarousel'),
  }))
);
```

#### 4️⃣ **components/ 폴더 최적화**
```typescript
// 현재 구조 개선
src/components/
├── ui/                    # 기본 UI 컴포넌트 (변경사항 없음)
│   ├── button.tsx
│   ├── card.tsx
│   └── slider.tsx
├── form/                  # 폼 관련 컴포넌트 (개선)
│   ├── FormField.tsx      # 통합 폼 필드 컴포넌트
│   ├── ValidationMessage.tsx
│   └── index.ts           # 내보내기 통합
├── layout/                # 레이아웃 컴포넌트 (신규)
│   ├── Layout.tsx         # 기존 Layout.tsx 이동
│   ├── HeaderBar.tsx      # 기존에서 이동
│   ├── BottomNavbar.tsx   # 기존에서 이동
│   └── PageControl.tsx    # 기존에서 이동
└── feedback/              # 피드백 컴포넌트 (신규)
    ├── BasicToast.tsx     # 기존에서 이동
    ├── BasicPopup.tsx     # 기존에서 이동
    └── LoadingSpinner.tsx

// 실제 구현 예시
// components/form/FormField.tsx
interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  validation?: ZodSchema;
  placeholder?: string;
}

export function FormField({ name, label, type = 'text', validation, ...props }: FormFieldProps) {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        {...register(name, validation)}
        {...props}
      />
      {errors[name] && (
        <ValidationMessage message={errors[name]?.message} />
      )}
    </div>
  );
}
```

## 📱 컴포넌트 아키텍처 패턴

### 🎨 View-ViewModel-Presenter 패턴
```typescript
// pages/ProductList/ProductListPresenter.tsx
export class ProductListPresenter {
  constructor(
    private readonly productService: ProductService,
    private readonly userStore: UserStore
  ) {}

  async loadProducts(filters: ProductFilters): Promise<Product[]> {
    // 비즈니스 로직 처리
    return await this.productService.getProducts(filters);
  }

  canUserEditProduct(product: Product): boolean {
    const user = this.userStore.getState().user;
    return user?.role === 'admin' || product.ownerId === user?.id;
  }
}

// pages/ProductList/ProductListViewModel.ts
export function useProductListViewModel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const presenter = useMemo(() => new ProductListPresenter(
    productService,
    userStore
  ), []);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const products = await presenter.loadProducts(filters);
      setProducts(products);
    } catch (error) {
      // 에러 처리
    } finally {
      setIsLoading(false);
    }
  }, [presenter, filters]);

  return {
    products,
    filters,
    isLoading,
    setFilters,
    loadProducts,
    canUserEditProduct: presenter.canUserEditProduct,
  };
}

// pages/ProductList/ProductListView.tsx
export function ProductListView() {
  const {
    products,
    filters,
    isLoading,
    setFilters,
    loadProducts,
    canUserEditProduct,
  } = useProductListViewModel();

  // UI 렌더링만 담당
  return (
    <div>
      {/* UI 컴포넌트들 */}
    </div>
  );
}
```

## 🚀 새로운 구조의 장점 비교

| 구분 | 기존 구조 | 권장 구조 | 장점 |
|------|-----------|-----------|------|
| **코드 찾기** | 기능별로 흩어짐 | 페이지별로 집중 | 🔍 관련 코드를 한 곳에서 찾기 쉬움 |
| **재사용성** | 컴포넌트 위주 | 계층별 분리 | ♻️ 비즈니스 로직과 UI 로직 독립적 재사용 |
| **테스트** | 통합 테스트 위주 | 계층별 단위 테스트 | 🧪 각 계층을 독립적으로 테스트 가능 |
| **성능** | 전역 상태 의존 | 선택적 구독 | ⚡ 필요한 상태만 구독하여 리렌더링 최소화 |
| **협업** | 파일 충돌 빈번 | 페이지별 독립 개발 | 👥 팀원간 코드 충돌 최소화 |
| **유지보수** | 사이드 이펙트 추적 어려움 | 명확한 데이터 흐름 | 🔧 버그 수정과 기능 추가가 안전함 |

## 🎯 성능 최적화 베스트 프랙티스

### ⚡ 렌더링 최적화
```typescript
// 1. 컴포넌트 분할 및 지연 로딩
const LazyChart = lazy(() => import('./Chart'));
const LazyDataTable = lazy(() => import('./DataTable'));

// 2. 가상화를 통한 대용량 리스트 최적화
import { FixedSizeList as List } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ItemComponent item={items[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={50}
    >
      {Row}
    </List>
  );
}

// 3. 이미지 최적화
function OptimizedImage({ src, alt, ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
}
```

### 🔄 상태 업데이트 최적화
```typescript
// Immer를 활용한 불변성 유지
import { produce } from 'immer';

const useOptimizedState = () => {
  const [state, setState] = useState(initialState);

  const updateNested = useCallback((path: string, value: any) => {
    setState(produce(draft => {
      draft[path] = value;
    }));
  }, []);

  return { state, updateNested };
};
```

## 📋 네이밍 컨벤션

### 📁 파일 및 폴더
- **컴포넌트**: PascalCase (`UserProfile.tsx`)
- **훅**: camelCase with 'use' prefix (`useUserData.ts`)
- **유틸리티**: camelCase (`formatDate.ts`)
- **상수**: SCREAMING_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **폴더**: camelCase (`userProfile/`)

### 🏷️ 변수 및 함수
```typescript
// 좋은 예시
const isUserLoggedIn = checkAuthStatus();
const userProfileData = await fetchUserProfile();
const handleUserRegistration = () => { /* ... */ };

// 피해야 할 예시
const flag = checkAuthStatus();
const data = await fetchUserProfile();
const func = () => { /* ... */ };
```

## 🚨 에러 처리 및 접근성

### 🛡️ Error Boundaries
```typescript
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // 에러 리포팅 서비스로 전송
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

### ♿ 접근성 (a11y)
```typescript
// ARIA 속성과 시맨틱 HTML 사용
function AccessibleButton({ onClick, children, ...props }) {
  return (
    <button
      onClick={onClick}
      aria-label={props['aria-label']}
      aria-describedby={props['aria-describedby']}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

// 키보드 네비게이션 지원
function AccessibleModal({ isOpen, onClose }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
      // 포커스 트랩 구현
    }
  }, [isOpen]);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
    >
      {/* 모달 내용 */}
    </div>
  );
}
```

## 🧪 테스팅 전략

### 🔬 단위 테스트
```typescript
// 컴포넌트 테스트
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from './UserProfile';

test('사용자 프로필 정보를 올바르게 표시한다', () => {
  const mockUser = { name: '홍길동', email: 'hong@example.com' };
  
  render(<UserProfile user={mockUser} />);
  
  expect(screen.getByText('홍길동')).toBeInTheDocument();
  expect(screen.getByText('hong@example.com')).toBeInTheDocument();
});

// 훅 테스트
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('카운터 훅이 올바르게 동작한다', () => {
  const { result } = renderHook(() => useCounter());
  
  expect(result.current.count).toBe(0);
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

## 📊 마이그레이션 로드맵

### 1단계: 스토어 통합 (1-2일)
```bash
# 기존 작은 스토어들을 논리적 단위로 통합
src/context/store/ → src/lib/store/
- headerStore + carouselStore + sliderStore → uiStore
- 새로운 authStore, userStore 생성
```

### 2단계: API 계층 구조화 (2-3일)
```bash
# API 로직을 기능별로 분리하고 TanStack Query 적용
src/lib/api.ts → src/lib/api/
- 엔드포인트별 파일 분리
- 쿼리 키 팩토리 패턴 적용
- 낙관적 업데이트 구현
```

### 3단계: 페이지별 아키텍처 적용 (페이지당 1일)
```bash
# 각 페이지에 View-ViewModel-Presenter 패턴 적용
pages/Home/ → HomeView + HomeViewModel + HomePresenter
pages/Write/ → WriteView + WriteViewModel + WritePresenter
```

### 4단계: 컴포넌트 최적화 (2-3일)
```bash
# 컴포넌트 재구성 및 성능 최적화
- React.memo 적용
- 불필요한 리렌더링 제거
- 지연 로딩 적용
```

## 📊 번들 크기 및 성능 모니터링

### 📈 webpack-bundle-analyzer 설정
```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    // ... 다른 플러그인들
    visualizer({
      filename: 'bundle-analysis.html',
      open: true,
      gzipSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
});
```

이 가이드는 최신 React 생태계의 공식 문서를 기반으로 작성되었으며, 실제 프로덕션 환경에서 검증된 패턴들을 포함하고 있습니다. 성능 최적화와 유지보수성을 동시에 고려한 현대적인 React 개발 방법론을 제시합니다. 