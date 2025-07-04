import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { BasicButton } from "../../components/BasicButton";
import { BasicInputBox } from "../../components/ui/section1/BasicInputBox";
import { BasicAlert } from "../../components/ui/section1/BasicAlert";
import { BasicPopup } from "../../components/BasicPopup";
import { useNavigate } from "react-router-dom";
export function LinkInPage() {
    const [link, setLink] = React.useState("");
    const [showPopup, setShowPopup] = React.useState(false);
    const navigate = useNavigate();
    const isValid = link.includes("링크"); // 임시로 "링크" 텍스트 포함 여부로만 판단 중
    // 임시 테스트용 데이터 (추후 백엔드 API 연동 시 대체 예정)
    const userName = "${유저}"; // 현재 접속한 사용자 이름
    const managerName = "${방장}"; // 가족 페이지 생성한 방장 이름
    const familyName = "${가족이름}"; // 임시 샘플 데이터
    const handleNext = () => {
        if (isValid) {
            setShowPopup(true);
        }
    };
    const handleJoin = () => {
        navigate('/MakeConfirmPage', { state: { fromLink: true, familyName: familyName, managerName } });
    };
    return (_jsx("div", { className: "flex justify-center items-center h-app bg-bg-1 select-none", children: _jsxs("div", { className: "mobile-container flex flex-col items-center relative", children: [_jsxs("div", { className: "flex flex-col w-[350px] px-[10px] mx-[20px] mt-[6.25rem]", children: [_jsx("h2", { className: "text-h3 mb-[0.63rem]", children: "\uB9C1\uD06C\uB85C \uAC00\uC871 \uD398\uC774\uC9C0 \uC785\uC7A5" }), _jsxs("div", { children: [_jsx("p", { className: "text-body2 text-gray-3", children: "\uBC29\uC7A5\uC5D0\uAC8C \uB9C1\uD06C\uB97C \uACF5\uC720\uBC1B\uC544," }), _jsx("p", { className: "text-body2 text-gray-3", children: "\uAC00\uC871 \uD398\uC774\uC9C0\uC5D0 \uC785\uC7A5\uD574\uBCF4\uC138\uC694" })] })] }), _jsxs("div", { className: "mx-[20px] mt-[5.56rem]", children: [_jsx(BasicInputBox, { placeholder: "\uB9C1\uD06C\uB97C \uC791\uC131\uD574\uC8FC\uC138\uC694", value: link, onChange: (e) => setLink(e.target.value) }), _jsx("div", { className: "h-[3.75rem] flex items-center justify-center", children: !isValid && link && (_jsx(BasicAlert, { message: "\uC62C\uBC14\uB974\uC9C0 \uC54A\uC740 \uCC38\uC5EC \uB9C1\uD06C \uC785\uB2C8\uB2E4." })) })] }), _jsx("div", { className: "w-full flex justify-center mt-[17.06rem]", children: _jsx("div", { className: "mx-[1.25rem]", children: _jsx(BasicButton, { text: "\uC785\uC7A5\uD558\uAE30", color: isValid ? "main_1" : "gray_3", size: 350, onClick: handleNext, disabled: !isValid, textStyle: "text-h4" }) }) }), _jsx(BasicPopup, { isOpen: showPopup, onClose: () => setShowPopup(false), title: `${managerName}님의\n${familyName}에 입장하시겠습니까?`, content: `참여를 원하는 가족 페이지인지\n다시 한번 확인해주세요.`, buttonText: "\uC785\uC7A5\uD558\uAE30", onButtonClick: handleJoin })] }) }));
}
