import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backButtonIcon from "../../assets/image/backbutton.svg";
import exitIcon from "../../assets/image/section1/icon_exit_20.svg";
import dropdownIcon from "../../assets/image/section1/dropdown_default.svg";
import { BasicButton } from "../../components/BasicButton";
export const WriteView = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("제목을 입력했어요");
    const [content, setContent] = useState("이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문장입니다. 이것은 500자 텍스트 예시 문");
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
    const handleImageRemove = (index) => {
        // 이미지 삭제 로직
        console.log(`이미지 ${index} 삭제`);
    };
    return (_jsxs("div", { className: " bg-[#E5E1D7] flex flex-col", children: [_jsx("div", { className: "w-full bg-[#E5E1D7] flex justify-center", children: _jsxs("div", { className: "w-[390px] h-[50px] flex items-center justify-between px-[10px]", children: [_jsx("button", { onClick: handleBackClick, className: "w-6 h-6", children: _jsx("img", { src: backButtonIcon, alt: "\uB4A4\uB85C\uAC00\uAE30", className: "w-6 h-6" }) }), _jsx("h1", { className: "text-[#1F1F1F] font-bold text-[20px]", children: "\uAC8C\uC2DC\uAE00 \uC791\uC131" }), _jsx("button", { onClick: handleExitClick, className: "w-6 h-6", children: _jsx("img", { src: exitIcon, alt: "\uB098\uAC00\uAE30", className: "w-6 h-6" }) })] }) }), _jsx("div", { className: "flex-1 flex justify-center px-[10px] pt-[20px]", children: _jsxs("div", { className: "w-[370px] max-w-full", children: [_jsxs("div", { className: "bg-[#F3F3F3] rounded-[10px] p-[10px] mb-[20px] relative", children: [_jsx("div", { className: "absolute left-0 top-[17px] w-[27px] h-full flex flex-col space-y-[17px]", children: Array(16)
                                        .fill(null)
                                        .map((_, index) => (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-[12px] h-[10px] bg-[#E5E1D7]" }), _jsx("div", { className: "w-[18px] h-[18px] bg-[#E5E1D7] rounded-full ml-[-6px]" })] }, index))) }), _jsxs("div", { className: "ml-[47px] pr-[20px]", children: [_jsxs("div", { className: "flex items-center justify-between mb-[6px]", children: [_jsxs("button", { onClick: handleDateClick, className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-black font-bold text-[16px]", children: selectedDate }), _jsx("img", { src: dropdownIcon, alt: "\uB4DC\uB86D\uB2E4\uC6B4", className: "w-6 h-6" })] }), _jsxs("button", { className: "bg-[#DDD5BF] rounded-[16px] px-3 py-1 flex items-center space-x-2", children: [_jsx("div", { className: "w-3 h-3 relative", children: _jsx("div", { className: "absolute inset-0 text-[#9A7A50] text-xs", children: "+" }) }), _jsxs("div", { className: "w-[15px] h-[15px] relative", children: [_jsx("div", { className: "w-full h-[7px] bg-[#9A7A50] absolute bottom-0 rounded-sm" }), _jsx("div", { className: "w-[7px] h-[7px] bg-[#9A7A50] rounded-full absolute top-0 left-1/2 transform -translate-x-1/2" })] })] })] }), _jsxs("div", { className: "mb-2", children: [_jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), className: "w-full text-[#1F1F1F] font-bold text-[16px] bg-transparent border-none outline-none placeholder-gray-500", placeholder: "\uC81C\uBAA9\uC744 \uC785\uB825\uD558\uC138\uC694" }), _jsx("div", { className: "w-full h-px bg-[#9A7A50] mt-1" })] }), _jsxs("div", { className: "h-[450px] relative", children: [_jsx("textarea", { value: content, onChange: (e) => {
                                                        if (e.target.value.length <= 500) {
                                                            setContent(e.target.value);
                                                        }
                                                    }, className: "w-full h-[410px] text-[#1F1F1F] text-[16px] leading-[19px] bg-transparent border-none outline-none resize-none placeholder-gray-500", placeholder: "\uB0B4\uC6A9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694." }), _jsxs("div", { className: "absolute bottom-0 right-0 text-[#828282] text-[16px]", children: ["(", content.length, "/500)"] })] })] })] }), _jsxs("div", { className: "mb-[38px]", children: [_jsx("h3", { className: "text-black text-[14px] mb-[10px]", children: "\uC120\uD0DD\uD55C \uC0AC\uC9C4 (10/10)" }), _jsx("div", { className: "flex space-x-[3px] overflow-x-auto scrollbar-hide", children: images.map((_, index) => (_jsx("div", { className: "relative flex-shrink-0", children: _jsx("div", { className: "w-[70px] h-[70px] bg-[#D3D3D3] rounded relative", children: _jsx("button", { onClick: () => handleImageRemove(index), className: "absolute top-1 right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-gray-600 text-xs", children: "\u00D7" }) }) }) }, index))) })] }), _jsx("div", { className: "pb-[20px]", children: _jsx(BasicButton, { text: "\uC218\uC815\uD558\uAE30", onClick: handleSaveClick, color: "main_1", size: 350, textStyle: "text_body3" }) })] }) })] }));
};
