import * as React from "react";

interface DiaryTemplateProps {
  title?: string;
  content: string;
  weather?: string;
  mood?: string;
  illustration?: string;
  templateStyle?: "default" | "colorful" | "simple";
}

export const DiaryTemplate = ({
  title = "가족 그림일기",
  content,
  weather = "sunny",
  mood = "happy",
  illustration,
  templateStyle = "default",
}: DiaryTemplateProps) => {
  const getWeatherIcon = (weather: string) => {
    const weatherIcons: Record<string, string> = {
      sunny: "☀️",
      cloudy: "☁️",
      rainy: "🌧️",
      rainbow: "🌈",
      snow: "❄️",
    };
    return weatherIcons[weather] || "☀️";
  };

  const getMoodIcon = (mood: string) => {
    const moodIcons: Record<string, string> = {
      happy: "😊",
      sad: "😢",
      excited: "😄",
      calm: "😌",
      angry: "😠",
    };
    return moodIcons[mood] || "😊";
  };

  return (
    <div className="bg-white rounded-[1rem] shadow-lg mx-[1.25rem] mb-[1.25rem] overflow-hidden">
      {/* 노트 바인딩 홀 */}
      <div className="flex gap-[0.5rem] p-[0.75rem] bg-white border-b border-gray-200">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-[0.375rem] h-[0.375rem] bg-gray-300 rounded-full"
          />
        ))}
      </div>

      <div className="p-[1.25rem]">
        {/* 상단 날씨/기분 아이콘 */}
        <div className="flex justify-between items-center mb-[1rem]">
          <div className="flex gap-[0.5rem] text-[1.5rem]">
            {getWeatherIcon(weather)}
            {getMoodIcon(mood)}
            <span>🌈</span>
            <span>☔</span>
          </div>
        </div>

        {/* 일러스트 영역 */}
        <div className="bg-blue-50 rounded-[0.75rem] h-[12rem] mb-[1rem] flex items-center justify-center relative overflow-hidden">
          {illustration ? (
            <img
              src={illustration}
              alt="가족 그림"
              className="w-full h-full object-cover rounded-[0.75rem]"
            />
          ) : (
            // 기본 가족 일러스트 플레이스홀더
            <div className="text-center text-gray-400">
              <div className="text-[3rem] mb-[0.5rem]">👨‍👩‍👧‍👦</div>
              <div className="text-body4">가족 일러스트</div>
            </div>
          )}
        </div>

        {/* 텍스트 내용 영역 */}
        <div className="space-y-[0.5rem]">
          {/* 노트 라인들 - 긴 텍스트 자동 줄바꿈 처리 */}
          {(() => {
            const lines = content.split("\n");
            const processedLines: string[] = [];
            const maxCharsPerLine = 20; // 한 줄에 들어갈 수 있는 글자 수
            
            // 각 라인을 최대 길이로 나누어 처리
            lines.forEach(line => {
              if (line.length <= maxCharsPerLine) {
                processedLines.push(line);
              } else {
                // 긴 라인을 글자 수 기준으로 분할
                for (let i = 0; i < line.length; i += maxCharsPerLine) {
                  processedLines.push(line.slice(i, i + maxCharsPerLine));
                }
              }
            });
            
            return processedLines.slice(0, 6).map((line, index) => (
              <div key={index} className="flex items-start">
                <div className="w-[0.25rem] h-[0.25rem] bg-gray-400 rounded-full mr-[0.75rem] flex-shrink-0 mt-[0.625rem]" />
                <div className="border-b border-gray-200 flex-1 min-h-[1.5rem] pb-[0.125rem]">
                  <span className="text-body3 text-gray-800 font-['Noto_Sans_KR'] leading-relaxed break-words">
                    {line}
                  </span>
                </div>
              </div>
            ));
          })()}

          {/* 빈 라인들 (최대 6줄까지) */}
          {(() => {
            const lines = content.split("\n");
            const maxCharsPerLine = 20;
            const processedLineCount = lines.reduce((count, line) => {
              return count + Math.ceil(line.length / maxCharsPerLine);
            }, 0);
            
            return Array.from({
              length: Math.max(0, 6 - Math.min(processedLineCount, 6)),
            }).map((_, index) => (
              <div key={`empty-${index}`} className="flex items-center">
                <div className="w-[0.25rem] h-[0.25rem] bg-gray-400 rounded-full mr-[0.75rem] flex-shrink-0" />
                <div className="border-b border-gray-200 flex-1 h-[1.5rem]" />
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
};
