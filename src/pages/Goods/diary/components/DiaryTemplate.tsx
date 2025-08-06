import * as React from "react";

interface DiaryTemplateProps {
  title?: string;
  content: string;
  weather?: string;
  mood?: string;
  illustration?: string;
  templateStyle?:
    | "default"
    | "colorful"
    | "simple"
    | "classic"
    | "grid"
    | "minimal"
    | "orange_notebook"
    | "yellow_grid";
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

  // 격자 스타일 렌더링
  if (templateStyle === "grid") {
    return (
      <div className="relative mx-[1.25rem] mb-[1.25rem]">
        {/* 배경 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-yellow-100 to-pink-100 rounded-[1rem] shadow-lg" />

        {/* 장식 요소들 */}
        <div className="absolute top-[1rem] left-[1rem] text-[1.5rem]">🌸</div>
        <div className="absolute top-[1rem] right-[1rem] text-[1.5rem]">🌈</div>
        <div className="absolute bottom-[1rem] left-[1rem] text-[1.5rem]">
          💝
        </div>
        <div className="absolute bottom-[1rem] right-[1rem] text-[1.5rem]">
          🌺
        </div>

        {/* 메인 영역 */}
        <div className="relative bg-white rounded-[0.75rem] shadow-md overflow-hidden m-[0.75rem] p-[1rem]">
          {/* 제목 영역 */}
          <div className="text-center mb-[1rem]">
            <div className="inline-block bg-white border-2 border-gray-300 rounded-[0.5rem] px-[1rem] py-[0.25rem] mb-[0.5rem]">
              <span className="text-body2 text-gray-600">우리 가족</span>
            </div>
            <h2 className="text-h3 font-bold text-gray-800">의 그림일기</h2>
          </div>

          {/* 날짜와 정보 입력 칸 */}
          <div className="bg-gray-50 border border-gray-200 rounded-[0.5rem] p-[0.75rem] mb-[1rem]">
            <div className="grid grid-cols-3 gap-[0.5rem] text-body4 text-gray-600">
              <div className="flex items-center gap-[0.25rem]">
                <span>년</span>
                <div className="border-b border-gray-300 flex-1 text-center">
                  2025
                </div>
              </div>
              <div className="flex items-center gap-[0.25rem]">
                <span>월</span>
                <div className="border-b border-gray-300 flex-1 text-center">
                  08
                </div>
              </div>
              <div className="flex items-center gap-[0.25rem]">
                <span>일</span>
                <div className="border-b border-gray-300 flex-1 text-center">
                  05
                </div>
              </div>
            </div>
            <div className="flex items-center gap-[1rem] mt-[0.5rem]">
              <div className="flex items-center gap-[0.25rem]">
                <span className="text-body4 text-gray-600">날씨:</span>
                <span className="text-[1.25rem]">
                  {getWeatherIcon(weather)}
                </span>
              </div>
              <div className="flex items-center gap-[0.25rem]">
                <span className="text-body4 text-gray-600">기분:</span>
                <span className="text-[1.25rem]">{getMoodIcon(mood)}</span>
              </div>
            </div>
          </div>

          {/* 이미지 영역 */}
          <div className="border-2 border-gray-300 rounded-[0.5rem] h-[12rem] mb-[1rem] flex items-center justify-center bg-white">
            {illustration ? (
              <img
                src={illustration}
                alt="그림일기 이미지"
                className="w-full h-full object-cover rounded-[0.375rem]"
              />
            ) : (
              <div className="text-center text-gray-400">
                <div className="text-[3rem] mb-[0.25rem]">👨‍👩‍👧‍👦</div>
                <div className="text-body4">가족 그림</div>
              </div>
            )}
          </div>

          {/* 제목 입력 칸 */}
          <div className="mb-[0.75rem]">
            <div className="flex items-center gap-[0.5rem]">
              <span className="text-body3 text-gray-600 font-medium">
                제목:
              </span>
              <div className="border-b-2 border-gray-300 flex-1 min-h-[1.5rem] flex items-end pb-[0.125rem]">
                <span className="text-body3 text-gray-800">{title}</span>
              </div>
            </div>
          </div>

          {/* 격자 텍스트 영역 */}
          <div className="bg-white border border-gray-300 rounded-[0.5rem] p-[0.5rem]">
            <div className="grid grid-cols-8 gap-0">
              {(() => {
                const gridContent = content.padEnd(64, " ");
                return Array.from({ length: 64 }).map((_, index) => {
                  const char = gridContent[index];
                  const isNewLine = index % 8 === 0 && index > 0;
                  return (
                    <div
                      key={index}
                      className={`
                        w-[1.75rem] h-[1.75rem] border-r border-b border-gray-200 
                        flex items-center justify-center text-body4 text-gray-800
                        ${index % 8 === 7 ? "border-r-0" : ""}
                        ${index >= 56 ? "border-b-0" : ""}
                      `}
                    >
                      {char !== " " ? char : ""}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* 우측 하단 귀여운 캐릭터 */}
        <div className="absolute bottom-[2rem] right-[2rem] text-[2rem]">
          🐰
        </div>
      </div>
    );
  }

  // 미니멀 스타일 렌더링
  if (templateStyle === "minimal") {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-[1rem] shadow-md mx-[1.25rem] mb-[1.25rem] overflow-hidden">
        <div className="p-[1.5rem]">
          {/* 심플한 제목 */}
          <div className="text-center mb-[1.5rem]">
            <h2 className="text-h2 font-light text-slate-700 tracking-wide">
              {title}
            </h2>
            <div className="flex justify-center gap-[0.5rem] mt-[0.5rem] text-[1.25rem]">
              {getWeatherIcon(weather)}
              {getMoodIcon(mood)}
            </div>
          </div>

          {/* 이미지 영역 */}
          <div className="rounded-[0.75rem] h-[14rem] mb-[1.5rem] flex items-center justify-center bg-white shadow-sm overflow-hidden">
            {illustration ? (
              <img
                src={illustration}
                alt="그림일기 이미지"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center text-slate-400">
                <div className="text-[3rem] mb-[0.5rem]">📸</div>
                <div className="text-body4">사진을 추가해보세요</div>
              </div>
            )}
          </div>

          {/* 텍스트 영역 */}
          <div className="bg-white rounded-[0.75rem] p-[1rem] shadow-sm">
            <div className="space-y-[0.75rem]">
              {(() => {
                const lines = content.split("\n");
                const processedLines: string[] = [];
                const maxCharsPerLine = 22;

                lines.forEach((line) => {
                  if (line.length <= maxCharsPerLine) {
                    processedLines.push(line);
                  } else {
                    for (let i = 0; i < line.length; i += maxCharsPerLine) {
                      processedLines.push(line.slice(i, i + maxCharsPerLine));
                    }
                  }
                });

                return processedLines.slice(0, 6).map((line, index) => (
                  <div key={index} className="min-h-[1.5rem] flex items-center">
                    <span className="text-body2 text-slate-700 font-['Noto_Sans_KR'] leading-relaxed">
                      {line}
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 주황색 노트북 스타일 (첫 번째 이미지)
  if (templateStyle === "orange_notebook") {
    return (
      <div className="relative mx-[1.25rem] mb-[1.25rem]">
        {/* 주황색 배경 */}
        <div className="bg-orange-400 rounded-[1rem] shadow-lg p-[0.75rem]">
          {/* 흰색 노트북 페이지 */}
          <div className="bg-white rounded-[0.75rem] shadow-md overflow-hidden border-2 border-black">
            {/* 좌측 바인딩 홀 */}
            <div className="absolute left-[1.5rem] top-[3rem] flex flex-col gap-[2.5rem] z-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[0.75rem] h-[0.75rem] bg-white border-2 border-black rounded-full"
                />
              ))}
            </div>

            <div className="pl-[3.5rem] pr-[1.5rem] py-[1.5rem]">
              {/* 상단 날씨 아이콘들 */}
              <div className="flex justify-center gap-[1.5rem] text-[2rem] mb-[1.5rem] border-b-2 border-black pb-[1rem]">
                <span>☀️</span>
                <span>☁️</span>
                <span>🌂</span>
                <span>⛄</span>
              </div>

              {/* 큰 이미지 영역 */}
              <div className="border-2 border-black rounded-[0.5rem] h-[16rem] mb-[1.5rem] flex items-center justify-center bg-white">
                {illustration ? (
                  <img
                    src={illustration}
                    alt="그림일기 이미지"
                    className="w-full h-full object-cover rounded-[0.375rem]"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <div className="text-[4rem] mb-[0.5rem]">🖼️</div>
                    <div className="text-body3">그림을 그려보세요</div>
                  </div>
                )}
              </div>

              {/* 텍스트 라인들 */}
              <div className="space-y-[1rem]">
                {(() => {
                  const lines = content.split("\n");
                  const processedLines: string[] = [];
                  const maxCharsPerLine = 20;

                  lines.forEach((line) => {
                    if (line.length <= maxCharsPerLine) {
                      processedLines.push(line);
                    } else {
                      for (let i = 0; i < line.length; i += maxCharsPerLine) {
                        processedLines.push(line.slice(i, i + maxCharsPerLine));
                      }
                    }
                  });

                  return processedLines.slice(0, 6).map((line, index) => (
                    <div
                      key={index}
                      className="border-b-2 border-black min-h-[2rem] flex items-end pb-[0.25rem]"
                    >
                      <span className="text-body2 text-black font-['Noto_Sans_KR'] leading-relaxed">
                        {line}
                      </span>
                    </div>
                  ));
                })()}

                {/* 빈 라인들 */}
                {Array.from({
                  length: Math.max(
                    0,
                    6 - Math.min(Math.ceil(content.length / 20), 6)
                  ),
                }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="border-b-2 border-black h-[2rem]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 노란색 격자 스타일 (두 번째 이미지)
  if (templateStyle === "yellow_grid") {
    return (
      <div className="relative mx-[1.25rem] mb-[1.25rem]">
        {/* 노란색 배경 */}
        <div className="bg-yellow-200 rounded-[1rem] shadow-lg p-[0.75rem] relative">
          {/* 장식 요소들 */}
          <div className="absolute top-[1rem] left-[1rem] text-[1.5rem]">
            🌈
          </div>
          <div className="absolute top-[1rem] right-[1rem] text-[1.5rem]">
            🌸
          </div>
          <div className="absolute bottom-[1rem] left-[1rem] text-[1.5rem]">
            🎈
          </div>
          <div className="absolute bottom-[1rem] right-[1rem] text-[1.5rem]">
            🌺
          </div>

          {/* 흰색 페이지 */}
          <div className="bg-white rounded-[0.75rem] shadow-md overflow-hidden border-2 border-black p-[1.5rem]">
            {/* 제목 입력 칸 */}
            <div className="flex items-center mb-[1rem]">
              <div className="border-2 border-black rounded-[0.5rem] px-[1rem] py-[0.5rem] bg-white mr-[0.5rem]">
                <span className="text-body2 text-black">우리 가족</span>
              </div>
              <span className="text-h3 font-bold text-black">의 그림일기</span>
            </div>

            {/* 날짜와 정보 칸 */}
            <div className="border-2 border-black rounded-[0.5rem] p-[1rem] mb-[1.5rem] bg-white">
              <div className="grid grid-cols-4 gap-[1rem] text-body2 text-black mb-[0.75rem]">
                <div className="flex items-center gap-[0.25rem]">
                  <span>년</span>
                  <div className="border-b-2 border-black flex-1 text-center pb-[0.125rem]">
                    <span>2025</span>
                  </div>
                </div>
                <div className="flex items-center gap-[0.25rem]">
                  <span>월</span>
                  <div className="border-b-2 border-black flex-1 text-center pb-[0.125rem]">
                    <span>08</span>
                  </div>
                </div>
                <div className="flex items-center gap-[0.25rem]">
                  <span>일</span>
                  <div className="border-b-2 border-black flex-1 text-center pb-[0.125rem]">
                    <span>05</span>
                  </div>
                </div>
                <div className="flex items-center gap-[0.25rem]">
                  <span>날씨:</span>
                  <span className="text-[1.25rem]">
                    {getWeatherIcon(weather)}
                  </span>
                </div>
              </div>
            </div>

            {/* 이미지 영역 */}
            <div className="border-2 border-black rounded-[0.5rem] h-[12rem] mb-[1rem] flex items-center justify-center bg-white">
              {illustration ? (
                <img
                  src={illustration}
                  alt="그림일기 이미지"
                  className="w-full h-full object-cover rounded-[0.375rem]"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-[3rem] mb-[0.25rem]">👨‍👩‍👧‍👦</div>
                  <div className="text-body3">가족 그림</div>
                </div>
              )}
            </div>

            {/* 제목 라인 */}
            <div className="mb-[1rem]">
              <div className="flex items-center gap-[0.5rem]">
                <span className="text-body2 text-black font-bold">제목:</span>
                <div className="border-b-2 border-black flex-1 min-h-[1.5rem] flex items-end pb-[0.125rem]">
                  <span className="text-body2 text-black">{title}</span>
                </div>
              </div>
            </div>

            {/* 격자 텍스트 영역 */}
            <div className="border-2 border-black rounded-[0.5rem] bg-white overflow-hidden">
              <div className="grid grid-cols-10 gap-0">
                {(() => {
                  const gridContent = content.padEnd(80, " ");
                  return Array.from({ length: 80 }).map((_, index) => {
                    const char = gridContent[index];
                    const row = Math.floor(index / 10);
                    const col = index % 10;
                    return (
                      <div
                        key={index}
                        className={`
                          w-[2rem] h-[2rem] flex items-center justify-center text-body4 text-black
                          ${col < 9 ? "border-r border-gray-300" : ""}
                          ${row < 7 ? "border-b border-gray-300" : ""}
                        `}
                      >
                        {char !== " " ? char : ""}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>

          {/* 우측 하단 토끼 캐릭터 */}
          <div className="absolute bottom-[2rem] right-[2rem] text-[2rem]">
            🐰
          </div>
        </div>
      </div>
    );
  }

  // 기본 템플릿 (기존 코드)
  return (
    <div className="bg-white rounded-[1rem] shadow-lg mx-[1.25rem] mb-[1.25rem] overflow-hidden h-[26.75rem] b">
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
        <div className=" border-1 border-black h-[10.375rem] min-w-[14.175rem] mb-[1rem] flex items-center justify-center relative overflow-hidden">
          {illustration ? (
            <img
              src={illustration}
              alt="가족 그림"
              className="w-full h-full object-contain "
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
            lines.forEach((line) => {
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
