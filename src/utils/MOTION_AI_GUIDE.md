# Motion AI 애니메이션 가이드

Motion AI를 사용하여 생성된 고품질 애니메이션을 React 프로젝트에 적용하는 방법을 안내합니다.

## 🎯 포함된 애니메이션

### 스프링 애니메이션

- `motion-spring-gentle` (450ms) - 부드러운 스프링 효과
- `motion-spring-medium` (900ms) - 중간 강도 스프링 효과
- `motion-spring-strong` (1250ms) - 강한 스프링 효과

### 바운스 애니메이션

- `motion-bounce-fast` (0.8s) - 빠른 바운스 효과
- `motion-bounce-slow` (1.2s) - 느린 바운스 효과

### 미리 정의된 프리셋

- `motion-button-hover` - 버튼 호버 효과
- `motion-card-hover` - 카드 호버 효과
- `motion-modal-enter` - 모달 등장 효과
- `motion-list-item-enter` - 리스트 아이템 등장 효과

## 🚀 사용 방법

### 1. CSS 클래스 직접 사용

```jsx
// 기본 스프링 애니메이션
<div className="motion-spring-gentle">
  <p>부드러운 스프링 효과</p>
</div>

// 버튼 호버 효과
<button className="motion-button-hover">
  클릭하세요
</button>

// 카드 호버 효과
<div className="motion-card-hover">
  <p>카드 콘텐츠</p>
</div>
```

### 2. TypeScript 헬퍼 함수 사용

```jsx
import { applyMotionAI } from '../utils/motion-ai-animations';

// 스프링 애니메이션 적용
<div
  style={applyMotionAI.spring('gentle')}
  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
>
  콘텐츠
</div>

// 바운스 애니메이션 적용
<div
  style={applyMotionAI.bounce('fast')}
  onClick={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
>
  클릭하세요
</div>
```

### 3. 기존 컴포넌트 개선

```jsx
// BasicButton 컴포넌트 사용 예시
<BasicButton
  text="버튼 텍스트"
  animation="gentle"  // Motion AI 애니메이션 적용
  onClick={() => console.log('clicked')}
/>

// 다양한 애니메이션 강도 선택
<BasicButton text="부드러운 효과" animation="gentle" />
<BasicButton text="중간 효과" animation="medium" />
<BasicButton text="강한 효과" animation="strong" />
<BasicButton text="애니메이션 없음" animation="none" />
```

### 4. 모달 등장 효과

```jsx
const [showModal, setShowModal] = useState(false);

return (
  <>
    <button onClick={() => setShowModal(true)}>모달 열기</button>

    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div
          className={`motion-modal-enter ${
            showModal ? "show" : ""
          } bg-white p-6 rounded-lg`}
        >
          <h2>모달 제목</h2>
          <p>모달 내용</p>
          <button onClick={() => setShowModal(false)}>닫기</button>
        </div>
      </div>
    )}
  </>
);
```

### 5. 리스트 아이템 순차 등장

```jsx
const [items, setItems] = useState([]);

useEffect(() => {
  setItems(["아이템 1", "아이템 2", "아이템 3"]);
}, []);

return (
  <div>
    {items.map((item, index) => (
      <div
        key={index}
        className="motion-list-item-enter show"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {item}
      </div>
    ))}
  </div>
);
```

## 📱 실제 적용 예시

### 홈 페이지 카드 호버 효과

```jsx
// src/pages/Home/EventCarousel.tsx
<div className="motion-card-hover p-4 bg-white rounded-lg shadow-md">
  <img src={event.image} alt={event.title} />
  <h3>{event.title}</h3>
  <p>{event.description}</p>
</div>
```

### 내비게이션 버튼 애니메이션

```jsx
// src/components/BottomNavbar.tsx
<button className="motion-button-hover p-3 rounded-full">
  <img src={icon} alt="Home" />
</button>
```

### 페이지 전환 애니메이션

```jsx
// src/pages/Write/index.tsx
<div className="motion-spring-medium">
  <form onSubmit={handleSubmit}>{/* 폼 내용 */}</form>
</div>
```

## 🎨 커스텀 애니메이션 만들기

필요한 경우 Motion AI 도구를 사용하여 새로운 애니메이션을 생성할 수 있습니다:

```typescript
// 새로운 애니메이션 생성 (예시)
const customSpring = '600ms linear(0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.0, 0.95, 1)';

// CSS에 추가
.motion-custom-spring {
  transition: transform 600ms linear(0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.0, 0.95, 1);
}
```

## 🔧 성능 최적화 팁

1. **애니메이션 최소화**: 한 번에 너무 많은 애니메이션을 적용하지 마세요
2. **transform 사용**: `left`, `top` 대신 `transform`을 사용하여 성능 최적화
3. **will-change 속성**: 필요시 `will-change: transform`을 사용하여 GPU 가속 활용
4. **애니메이션 지연**: 리스트 아이템 등장 시 적절한 지연 시간 적용

## 🚨 주의사항

1. **접근성**: 사용자가 애니메이션을 비활성화할 수 있도록 `prefers-reduced-motion` 미디어 쿼리 고려
2. **성능**: 모바일 환경에서의 성능 테스트 필수
3. **UX**: 애니메이션은 사용자 경험을 향상시키기 위한 도구이므로 과도한 사용은 피하세요

## 📊 데모 컴포넌트

Motion AI 애니메이션을 테스트하려면 `MotionAIDemo` 컴포넌트를 사용하세요:

```jsx
import MotionAIDemo from "../components/MotionAIDemo";

function TestPage() {
  return <MotionAIDemo />;
}
```

이 가이드를 통해 Motion AI 애니메이션을 효과적으로 활용하여 더 매력적인 사용자 인터페이스를 구현해보세요!
