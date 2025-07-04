import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backButtonIcon from "../../assets/image/backbutton.svg";
import exitIcon from "../../assets/image/section1/icon_exit_20.svg";
import dropdownIcon from "../../assets/image/section1/dropdown_default.svg";
import { BasicButton } from "../../components/BasicButton";

export const WriteView: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("제목을 입력했어요");
  const [content, setContent] = useState(
    "이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문"
  );
  const [selectedDate, setSelectedDate] = useState("0000년 00월 00일 월요일");
  const [images] = useState(Array(10).fill(null)); // 10개의 이미지 플레이스홀더

  const handleDateClick = () => {
    // 날짜 선택 모달 또는 드롭다운 로직
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const weekdays = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    const weekday = weekdays[today.getDay()];

    setSelectedDate(`${year}년 ${month}월 ${day}일 ${weekday}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleExitClick = () => {
    navigate("/");
  };

  const handleSaveClick = () => {
    // 수정 저장 로직
    console.log("게시글 수정 저장");
    navigate(-1);
  };

  const handleImageRemove = (index: number) => {
    // 이미지 삭제 로직
    console.log(`이미지 ${index} 삭제`);
  };

  return (
    <div className=" bg-[#E5E1D7] flex flex-col">
      {/* Header */}
      <div className="w-full bg-[#E5E1D7] flex justify-center">
        <div className="w-[390px] h-[50px] flex items-center justify-between px-[10px]">
          <button onClick={handleBackClick} className="w-6 h-6">
            <img src={backButtonIcon} alt="뒤로가기" className="w-6 h-6" />
          </button>
          <h1 className="text-[#1F1F1F] font-bold text-[20px]">게시글 작성</h1>
          <button onClick={handleExitClick} className="w-6 h-6">
            <img src={exitIcon} alt="나가기" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center px-[10px] pt-[20px]">
        <div className="w-[370px] max-w-full">
          {/* Paper Container */}
          <div className="bg-[#F3F3F3] rounded-[10px] p-[10px] mb-[20px] relative">
            {/* Left Paper Holes */}
            <div className="absolute left-0 top-[17px] w-[27px] h-full flex flex-col space-y-[17px]">
              {Array(16)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-[12px] h-[10px] bg-[#E5E1D7]"></div>
                    <div className="w-[18px] h-[18px] bg-[#E5E1D7] rounded-full ml-[-6px]"></div>
                  </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="ml-[47px] pr-[20px]">
              {/* Date Section */}
              <div className="flex items-center justify-between mb-[6px]">
                <button
                  onClick={handleDateClick}
                  className="flex items-center space-x-2"
                >
                  <span className="text-black font-bold text-[16px]">
                    {selectedDate}
                  </span>
                  <img src={dropdownIcon} alt="드롭다운" className="w-6 h-6" />
                </button>
                <button className="bg-[#DDD5BF] rounded-[16px] px-3 py-1 flex items-center space-x-2">
                  <div className="w-3 h-3 relative">
                    <div className="absolute inset-0 text-[#9A7A50] text-xs">
                      +
                    </div>
                  </div>
                  <div className="w-[15px] h-[15px] relative">
                    <div className="w-full h-[7px] bg-[#9A7A50] absolute bottom-0 rounded-sm"></div>
                    <div className="w-[7px] h-[7px] bg-[#9A7A50] rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </button>
              </div>

              {/* Title Input */}
              <div className="mb-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-[#1F1F1F] font-bold text-[16px] bg-transparent border-none outline-none placeholder-gray-500"
                  placeholder="제목을 입력하세요"
                />
                <div className="w-full h-px bg-[#9A7A50] mt-1"></div>
              </div>

              {/* Content Input */}
              <div className="h-[450px] relative">
                <textarea
                  value={content}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setContent(e.target.value);
                    }
                  }}
                  className="w-full h-[410px] text-[#1F1F1F] text-[16px] leading-[19px] bg-transparent border-none outline-none resize-none placeholder-gray-500"
                  placeholder="내용을 입력해주세요."
                />
                <div className="absolute bottom-0 right-0 text-[#828282] text-[16px]">
                  ({content.length}/500)
                </div>
              </div>
            </div>
          </div>

          {/* Photo Section */}
          <div className="mb-[38px]">
            <h3 className="text-black text-[14px] mb-[10px]">
              선택한 사진 (10/10)
            </h3>
            <div className="flex space-x-[3px] overflow-x-auto scrollbar-hide">
              {images.map((_, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <div className="w-[70px] h-[70px] bg-[#D3D3D3] rounded relative">
                    <button
                      onClick={() => handleImageRemove(index)}
                      className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center"
                    >
                      <span className="text-gray-600 text-xs">×</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="pb-[20px]">
            <BasicButton
              text="수정하기"
              onClick={handleSaveClick}
              color="main_1"
              size={350}
              textStyle="text_body3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
