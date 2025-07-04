import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { BasicButton } from "../../components/BasicButton";
import { BasicInputBox } from "../../components/ui/section1/BasicInputBox";
import { useNavigate } from "react-router-dom";
import { BasicAlert } from "../../components/ui/section1/BasicAlert";
import { BasicPopup } from "../../components/BasicPopup";
export function FirstMakePage() {
    const [familyName, setFamilyName] = useState("");
    const [isNameValid, setIsNameValid] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const handleNext = () => {
        if (familyName.length > 10) {
            setIsNameValid(false);
            return;
        }
        setIsNameValid(true);
        setShowPopup(true);
    };
    const handleConfirm = () => {
        // 가족 이름을 state로 전달하면서 MakeConfirmPage로 이동
        navigate('/MakeConfirmPage', { state: { familyName } });
    };
    return (_jsx("div", { className: "flex justify-center items-center h-app bg-bg-1 select-none", children: _jsxs("div", { className: "mobile-container flex flex-col items-center relative", children: [_jsxs("div", { className: "flex flex-col w-[350px] px-[10px] mx-[20px] mt-[6.25rem]", children: [_jsx("h2", { className: "text-h3 mb-[0.63rem]", children: "\uAC00\uC871 \uC774\uB984 \uC791\uC131" }), _jsxs("div", { children: [_jsx("p", { className: "text-body2 text-gray-3", children: "\uC6B0\uB9AC \uAC00\uC871\uC758 \uC774\uB984\uC744 \uC791\uC131\uD574\uC8FC\uC138\uC694." }), _jsx("p", { className: "text-body2 text-gray-3", children: "ex. (\uC720\uAE30\uB18D \uD328\uBC00\uB9AC)" })] })] }), _jsxs("div", { className: "mx-[20px] mt-[5.56rem]", children: [_jsx(BasicInputBox, { placeholder: "\uAC00\uC871\uC758 \uC774\uB984\uC744 \uC791\uC131\uD574\uC8FC\uC138\uC694", value: familyName, onChange: (e) => setFamilyName(e.target.value) }), _jsx("div", { className: "h-[3.75rem] flex items-center justify-center", children: !isNameValid && (_jsx(BasicAlert, { message: "\uAC00\uC871\uBA85\uC740 10\uC790 \uC774\uB0B4\uB85C \uC791\uC131\uD574\uC8FC\uC138\uC694." })) })] }), _jsx("div", { className: "w-full flex justify-center mt-[17.06rem]", children: _jsx("div", { className: "mx-[1.25rem]", children: _jsx(BasicButton, { text: "\uB2E4\uC74C", color: familyName ? "main_1" : "gray_3", size: 350, onClick: handleNext, disabled: !familyName, textStyle: "text-h4" }) }) }), _jsx(BasicPopup, { isOpen: showPopup, onClose: () => setShowPopup(false), title: "\uAC00\uC871 \uC0DD\uC131", content: `${familyName}의 방장으로서\n가족 페이지를 만드시겠습니까?`, buttonText: "\uB9CC\uB4E4\uAE30", onButtonClick: handleConfirm })] }) }));
}
