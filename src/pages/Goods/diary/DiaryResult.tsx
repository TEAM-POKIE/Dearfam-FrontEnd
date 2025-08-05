import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SemiHeader } from "@/components/SemiHeader";
import BasicButton from "@/components/BasicButton";
import { DiaryTemplate } from "./components/DiaryTemplate";
import { TemplateCarousel } from "./components/TemplateCarousel";

interface DiaryData {
  id: string;
  title: string;
  content: string;
  weather?: string;
  mood?: string;
  illustration?: string;
}

interface Template {
  id: string;
  name: string;
  previewImage: string;
  style: 'default' | 'colorful' | 'simple';
}

// 기본 템플릿 데이터
const defaultTemplates: Template[] = [
  {
    id: 'template-1',
    name: '기본 템플릿',
    previewImage: '',
    style: 'default'
  },
  {
    id: 'template-2', 
    name: '컬러풀 템플릿',
    previewImage: '',
    style: 'colorful'
  }
];

export const DiaryResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // SelectDiary에서 전달받은 그림일기 데이터
  const diaryData = location.state?.diaryData as DiaryData;
  
  // 디버깅용 로그
  console.log('DiaryResult - location.state:', location.state);
  console.log('DiaryResult - diaryData:', diaryData);
  
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>(defaultTemplates[0].id);
  
  // 기본 데이터 (테스트용)
  const defaultDiaryData: DiaryData = {
    id: "test-1",
    title: "가족 그림일기",
    content: "오늘 하루도 가족과 함께 행복한 시간을 보냈어요.\n함께 공원에서 산책하고 맛있는 음식도 먹었습니다.\n이런 소중한 시간들이 계속 이어지길 바라요.",
    weather: "sunny",
    mood: "happy",
    illustration: ""
  };

  // 실제 데이터가 없으면 기본 데이터 사용
  const finalDiaryData = diaryData || defaultDiaryData;

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };

  const handleCoverSelect = () => {
    // 표지 선택 페이지로 이동 또는 최종 완료 처리
    console.log('표지 선택하기:', { diaryData: finalDiaryData, selectedTemplateId });
    // navigate('/home/goods/diary/cover', { state: { diaryData: finalDiaryData, templateId: selectedTemplateId } });
  };

  return (
    <div className="h-[100vh] flex flex-col bg-bg-1">
      {/* 상단 고정 헤더 */}
      <div className="flex-shrink-0">
        <SemiHeader title="가족 그림일기" exit={false} />
      </div>

      {/* 가운데 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto hide-scrollbar py-[1rem]">
        {/* 그림일기 템플릿 */}
        <DiaryTemplate
          title={finalDiaryData.title}
          content={finalDiaryData.content}
          weather={finalDiaryData.weather}
          mood={finalDiaryData.mood}
          illustration={finalDiaryData.illustration}
          templateStyle={defaultTemplates.find(t => t.id === selectedTemplateId)?.style}
        />

        {/* 템플릿 선택 캐러셀 */}
        <TemplateCarousel
          templates={defaultTemplates}
          selectedTemplateId={selectedTemplateId}
          onTemplateSelect={handleTemplateSelect}
        />
      </div>

      {/* 하단 고정 버튼 */}
      <div className="flex-shrink-0 p-[1.25rem] pb-[3.44rem] bg-bg-1">
        <BasicButton
          text="표지 선택하기"
          color="main_2_80"
          size={350}
          onClick={handleCoverSelect}
        />
      </div>
    </div>
  );
};