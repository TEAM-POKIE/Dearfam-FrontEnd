import * as React from "react";

interface Template {
  id: string;
  name: string;
  previewImage: string;
  style: 'default' | 'colorful' | 'simple';
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
  
  return (
    <div className="px-[1.25rem] py-[1rem]">
      {/* 템플릿 미리보기 */}
      <div className="flex gap-[0.75rem] justify-center mb-[0.75rem]">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`relative cursor-pointer transition-all duration-200 ${
              selectedTemplateId === template.id 
                ? 'ring-2 ring-main-1 scale-105' 
                : 'opacity-70'
            }`}
            onClick={() => onTemplateSelect(template.id)}
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
                // 기본 템플릿 미리보기
                <div className="p-[0.25rem] h-full flex flex-col">
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
            
            {/* 선택 표시 */}
            {selectedTemplateId === template.id && (
              <div className="absolute -top-1 -right-1 w-[1.25rem] h-[1.25rem] bg-main-1 rounded-full flex items-center justify-center">
                <div className="w-[0.5rem] h-[0.5rem] bg-white rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 페이지 인디케이터 */}
      <div className="flex justify-center gap-[0.375rem]">
        {templates.map((template) => (
          <div
            key={`indicator-${template.id}`}
            className={`w-[0.5rem] h-[0.5rem] rounded-full transition-all duration-200 ${
              selectedTemplateId === template.id 
                ? 'bg-gray-600' 
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};