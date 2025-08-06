import * as React from "react";

interface Template {
  id: string;
  name: string;
  previewImage: string;
  style: 'default' | 'colorful' | 'simple' | 'classic' | 'grid' | 'minimal' | 'orange_notebook' | 'yellow_grid';
}

interface TemplateCarouselProps {
  templates: Template[];
  selectedTemplateId: string;
  onTemplateSelect: (templateId: string) => void;
}

export const TemplateCarousel = ({ 
  templates, 
  selectedTemplateId, 
  onTemplateSelect 
}: TemplateCarouselProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(
    templates.findIndex(t => t.id === selectedTemplateId) || 0
  );
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [translateX, setTranslateX] = React.useState(0);
  const [dragStartTranslateX, setDragStartTranslateX] = React.useState(0);
  const [hasDragged, setHasDragged] = React.useState(false);
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  const itemWidth = 84; // 4.5rem (72px) + gap (12px)
  const visibleItems = 3;
  
  React.useEffect(() => {
    const newIndex = templates.findIndex(t => t.id === selectedTemplateId);
    if (newIndex !== -1) {
      setCurrentIndex(newIndex);
      // 선택된 아이템을 중앙에 배치
      const containerWidth = 300; // 대략적인 컨테이너 너비
      const centerOffset = containerWidth / 2 - itemWidth / 2;
      setTranslateX(centerOffset - newIndex * itemWidth);
    }
  }, [selectedTemplateId, templates, itemWidth]);
  
  React.useEffect(() => {
    // 초기 위치 설정
    const initialIndex = templates.findIndex(t => t.id === selectedTemplateId) || 0;
    setCurrentIndex(initialIndex);
    const containerWidth = 300;
    const centerOffset = containerWidth / 2 - itemWidth / 2;
    setTranslateX(centerOffset - initialIndex * itemWidth);
  }, []);
  
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setDragStartTranslateX(translateX);
    setHasDragged(false);
  };
  
  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startX;
    const newTranslateX = dragStartTranslateX + deltaX;
    setTranslateX(newTranslateX);
    
    // 드래그 임계값을 넘었는지 확인
    if (Math.abs(deltaX) > 5) {
      setHasDragged(true);
    }
  };
  
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // 스냅 로직
    const dragDistance = translateX - dragStartTranslateX;
    const threshold = itemWidth / 3;
    
    let newIndex = currentIndex;
    
    if (dragDistance > threshold && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (dragDistance < -threshold && currentIndex < templates.length - 1) {
      newIndex = currentIndex + 1;
    }
    
    setCurrentIndex(newIndex);
    
    // 선택된 아이템을 중앙에 배치
    const containerWidth = 300;
    const centerOffset = containerWidth / 2 - itemWidth / 2;
    setTranslateX(centerOffset - newIndex * itemWidth);
    
    onTemplateSelect(templates[newIndex].id);
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };
  
  const handleMouseUp = () => {
    handleDragEnd();
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleDragMove(e.touches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    handleDragEnd();
  };
  
  React.useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => handleDragMove(e.clientX);
      const handleGlobalMouseUp = () => handleDragEnd();
      
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, translateX, dragStartTranslateX, startX]);
  
  return (
    <div className="px-[1.25rem] py-[1rem]">
      {/* 템플릿 미리보기 */}
      <div className="overflow-hidden">
        <div 
          ref={containerRef}
          className="flex gap-[0.75rem] mb-[0.75rem] cursor-grab active:cursor-grabbing select-none"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            width: `${templates.length * itemWidth}px`
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {templates.map((template, index) => (
            <div
              key={template.id}
              className={`relative transition-all duration-200 flex-shrink-0 ${
                selectedTemplateId === template.id 
                  ? 'ring-2 ring-main-1 scale-105' 
                  : 'opacity-70'
              }`}
              style={{ width: '72px' }} // 4.5rem
              onClick={(e) => {
                e.stopPropagation();
                if (!hasDragged) {
                  onTemplateSelect(template.id);
                }
              }}
            >
            {/* 템플릿 미리보기 이미지 */}
            <div className="w-[4.5rem] h-[6rem] bg-white rounded-[0.5rem] shadow-md overflow-hidden border border-gray-200">
              {template.previewImage ? (
                <img 
                  src={template.previewImage} 
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                // 템플릿별 미리보기
                <div className="p-[0.25rem] h-full flex flex-col">
                  {template.style === 'classic' ? (
                    // 클래식 노트북 미리보기
                    <div className="relative h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-[0.125rem] p-[0.125rem]">
                      <div className="bg-white rounded-[0.0625rem] h-full p-[0.125rem] relative">
                        {/* 바인딩 홀 */}
                        <div className="absolute left-[0.0625rem] top-[0.25rem] flex flex-col gap-[0.25rem]">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="w-[0.125rem] h-[0.125rem] bg-gray-400 rounded-full" />
                          ))}
                        </div>
                        <div className="ml-[0.375rem]">
                          <div className="text-[0.375rem] text-center mb-[0.125rem] font-bold">일일기</div>
                          <div className="text-[0.25rem] text-center mb-[0.125rem]">☀️☁️🌂⛄</div>
                          <div className="bg-gray-100 rounded-[0.0625rem] h-[1rem] mb-[0.125rem] flex items-center justify-center text-[0.5rem]">🎨</div>
                          <div className="space-y-[0.0625rem]">
                            {Array.from({ length: 2 }).map((_, i) => (
                              <div key={i} className="flex items-center">
                                <div className="w-[0.0625rem] h-[0.0625rem] bg-gray-400 rounded-full mr-[0.0625rem]" />
                                <div className="border-b border-gray-300 flex-1 h-[0.25rem]" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : template.style === 'grid' ? (
                    // 격자 스타일 미리보기
                    <div className="h-full bg-gradient-to-br from-yellow-100 to-pink-100 rounded-[0.125rem] p-[0.125rem] relative">
                      <div className="absolute text-[0.25rem]">🌸</div>
                      <div className="absolute top-0 right-0 text-[0.25rem]">🌈</div>
                      <div className="bg-white rounded-[0.0625rem] h-full p-[0.125rem]">
                        <div className="text-[0.375rem] text-center mb-[0.125rem] font-bold">○○의 그림일기</div>
                        <div className="bg-gray-100 rounded-[0.0625rem] h-[0.75rem] mb-[0.125rem] flex items-center justify-center text-[0.375rem]">👨‍👩‍👧‍👦</div>
                        <div className="grid grid-cols-4 gap-0 border border-gray-200 rounded-[0.0625rem]">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="w-[0.25rem] h-[0.25rem] border-r border-b border-gray-200 text-[0.25rem] flex items-center justify-center">
                              {i < 4 ? '글' : ''}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="absolute bottom-[0.125rem] right-[0.125rem] text-[0.25rem]">🐰</div>
                    </div>
                  ) : template.style === 'minimal' ? (
                    // 미니멀 스타일 미리보기
                    <div className="h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-[0.125rem] p-[0.125rem]">
                      <div className="text-[0.375rem] text-center mb-[0.125rem] font-light text-slate-600">그림일기</div>
                      <div className="text-[0.25rem] text-center mb-[0.125rem]">☀️😊</div>
                      <div className="bg-white rounded-[0.0625rem] h-[1rem] mb-[0.125rem] shadow-sm flex items-center justify-center text-[0.375rem]">📸</div>
                      <div className="bg-white rounded-[0.0625rem] p-[0.0625rem] shadow-sm">
                        <div className="space-y-[0.0625rem]">
                          {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="h-[0.25rem] bg-slate-100 rounded-[0.03125rem]" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : template.style === 'orange_notebook' ? (
                    // 주황 노트북 미리보기
                    <div className="h-full bg-orange-400 rounded-[0.125rem] p-[0.125rem]">
                      <div className="bg-white rounded-[0.0625rem] h-full p-[0.125rem] border border-black relative">
                        {/* 바인딩 홀 */}
                        <div className="absolute left-[0.0625rem] top-[0.25rem] flex flex-col gap-[0.25rem]">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="w-[0.125rem] h-[0.125rem] bg-white border border-black rounded-full" />
                          ))}
                        </div>
                        <div className="ml-[0.375rem]">
                          <div className="text-[0.25rem] text-center mb-[0.125rem] border-b border-black pb-[0.0625rem]">☀️☁️🌂⛄</div>
                          <div className="bg-gray-100 border border-black rounded-[0.0625rem] h-[1rem] mb-[0.125rem] flex items-center justify-center text-[0.375rem]">🖼️</div>
                          <div className="space-y-[0.0625rem]">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div key={i} className="border-b-2 border-black h-[0.25rem]" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : template.style === 'yellow_grid' ? (
                    // 노란 격자 미리보기
                    <div className="h-full bg-yellow-200 rounded-[0.125rem] p-[0.125rem] relative">
                      <div className="absolute text-[0.25rem]">🌈</div>
                      <div className="absolute top-0 right-0 text-[0.25rem]">🌸</div>
                      <div className="bg-white rounded-[0.0625rem] h-full p-[0.125rem] border border-black">
                        <div className="text-[0.25rem] text-center mb-[0.0625rem] font-bold">○○의 그림일기</div>
                        <div className="text-[0.1875rem] mb-[0.0625rem] border border-black rounded-[0.03125rem] px-[0.0625rem] py-[0.03125rem]">년 월 일 날씨</div>
                        <div className="bg-gray-100 border border-black rounded-[0.0625rem] h-[0.625rem] mb-[0.0625rem] flex items-center justify-center text-[0.25rem]">👨‍👩‍👧‍👦</div>
                        <div className="text-[0.1875rem] mb-[0.0625rem] border-b border-black">제목:</div>
                        <div className="grid grid-cols-5 gap-0 border border-black rounded-[0.03125rem]">
                          {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="w-[0.25rem] h-[0.25rem] border-r border-b border-gray-200 text-[0.1875rem] flex items-center justify-center">
                              {i < 5 ? '글' : ''}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="absolute bottom-[0.0625rem] right-[0.0625rem] text-[0.1875rem]">🐰</div>
                    </div>
                  ) : (
                    // 기본 및 컬러풀 템플릿 미리보기
                    <div className="p-[0.125rem] h-full flex flex-col">
                      {/* 상단 아이콘들 */}
                      <div className="flex gap-[0.125rem] text-[0.5rem] mb-[0.25rem]">
                        <span>☀️</span>
                        <span>😊</span>
                      </div>
                      
                      {/* 이미지 영역 */}
                      <div className={`flex-1 rounded-[0.25rem] mb-[0.25rem] flex items-center justify-center text-[0.75rem] ${
                        template.style === 'colorful' ? 'bg-yellow-100' :
                        template.style === 'simple' ? 'bg-gray-100' : 'bg-blue-50'
                      }`}>
                        👨‍👩‍👧‍👦
                      </div>
                      
                      {/* 텍스트 라인들 */}
                      <div className="space-y-[0.125rem]">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex items-center">
                            <div className="w-[0.0625rem] h-[0.0625rem] bg-gray-400 rounded-full mr-[0.125rem]" />
                            <div className="border-b border-gray-300 flex-1 h-[0.375rem]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* 선택 표시 */}
            {selectedTemplateId === template.id && (
              <div className="absolute -top-1 -right-1 w-[1.25rem] h-[1.25rem] bg-main-1 rounded-full flex items-center justify-center">
                <div className="w-[0.5rem] h-[0.5rem] bg-white rounded-full" />
              </div>
            )}
          </div>
          ))}
        </div>
      </div>

      {/* 선택된 템플릿 이름 */}
      <div className="text-center mb-[0.5rem]">
        <span className="text-body3 text-gray-700 font-medium">
          {templates.find(t => t.id === selectedTemplateId)?.name}
        </span>
      </div>

      {/* 페이지 인디케이터 */}
      <div className="flex justify-center gap-[0.375rem]">
        {templates.map((template, index) => (
          <div
            key={`indicator-${template.id}`}
            className={`w-[0.5rem] h-[0.5rem] rounded-full transition-all duration-200 cursor-pointer ${
              currentIndex === index 
                ? 'bg-gray-600' 
                : 'bg-gray-300'
            }`}
            onClick={() => {
              setCurrentIndex(index);
              const containerWidth = 300;
              const centerOffset = containerWidth / 2 - itemWidth / 2;
              setTranslateX(centerOffset - index * itemWidth);
              onTemplateSelect(template.id);
            }}
          />
        ))}
      </div>
    </div>
  );
};