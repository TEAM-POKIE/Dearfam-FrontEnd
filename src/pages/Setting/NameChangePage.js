import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { BasicInputBox } from "@/components/ui/section1/BasicInputBox";
import BasicButton from "@/components/BasicButton";
import { BasicAlert } from "@/components/ui/section1/BasicAlert";
import BasicPopup from "@/components/BasicPopup";
export function NameChangePage() {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isWithdrawPopupOpen, setIsWithdrawPopupOpen] = useState(false);
    // 닉네임 변경 처리
    const handleNameChange = () => {
        if (!nickname.trim()) {
            setIsValid(false);
            setErrorMessage("닉네임을 입력해주세요.");
            return;
        }
        if (nickname.length < 2) {
            setIsValid(false);
            setErrorMessage("닉네임은 2자 이상이어야 합니다.");
            return;
        }
        if (nickname.length > 5) {
            setIsValid(false);
            setErrorMessage("닉네임은 5자 이내여야 합니다.");
            return;
        }
        // 한글, 영문, 숫자만 허용하는 정규식
        const nameRegex = /^[가-힣a-zA-Z0-9]+$/;
        if (!nameRegex.test(nickname)) {
            setIsValid(false);
            setErrorMessage("닉네임은 한글, 영문, 숫자만 사용 가능합니다.");
            return;
        }
        // 닉네임 변경 성공 시 팝업 표시
        setIsWithdrawPopupOpen(true);
    };
    // 닉네임 변경 완료 후 처리
    const handleChangeComplete = () => {
        setIsWithdrawPopupOpen(false);
        navigate(-1); // 이전 페이지로 돌아가기
    };
    // 닉네임 입력값 변경 핸들러
    const handleNicknameChange = (value) => {
        setNickname(value);
        if (!value.trim()) {
            setIsValid(false);
            setErrorMessage("닉네임을 입력해주세요.");
            return;
        }
        if (value.length < 2) {
            setIsValid(false);
            setErrorMessage("닉네임은 2자 이상이어야 합니다.");
            return;
        }
        if (value.length > 5) {
            setIsValid(false);
            setErrorMessage("닉네임은 5자 이내여야 합니다.");
            return;
        }
        // 한글, 영문, 숫자만 허용하는 정규식
        const nameRegex = /^[가-힣a-zA-Z0-9]+$/;
        if (!nameRegex.test(value)) {
            setIsValid(false);
            setErrorMessage("닉네임은 한글, 영문, 숫자만 사용 가능합니다.");
            return;
        }
        setIsValid(true);
        setErrorMessage("");
    };
    return (_jsx("div", { className: "flex justify-center items-center h-app bg-bg-1", children: _jsxs("div", { className: "mobile-container flex flex-col items-center overflow-hidden relative", children: [_jsxs("div", { className: "w-full flex items-center justify-center relative py-4", children: [_jsx("button", { className: "absolute left-4", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { size: 24, color: "#000000" }) }), _jsx("h1", { className: "text-h4 font-bold", children: "\uB2C9\uB124\uC784 \uBCC0\uACBD" })] }), _jsx("div", { className: "w-full flex flex-col items-center px-6 mt-10", children: _jsxs("div", { className: "w-full", children: [_jsx(BasicInputBox, { placeholder: "\uC0C8\uB85C\uC6B4 \uB2C9\uB124\uC784", fullWidth: true, value: nickname, onValueChange: handleNicknameChange }), _jsxs("p", { className: "text-body3 text-gray-3 mt-2 text-center", children: ["\uB2C9\uB124\uC784\uC740", " ", _jsx("span", { className: "text-alert", children: "5\uC790 \uC774\uB0B4\uC758 \uD55C\uAE00, \uC601\uBB38, \uC22B\uC790 \uC870\uD569" }), "\uC73C\uB85C", _jsx("br", {}), "\uC124\uC815\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."] }), !isValid && (_jsx("div", { className: "mt-2", children: _jsx(BasicAlert, { message: errorMessage }) }))] }) }), _jsx("div", { className: "absolute bottom-[3.5rem] w-full flex justify-center", children: _jsx("div", { className: "mx-[1.25rem]", children: _jsx(BasicButton, { text: "\uB2C9\uB124\uC784 \uBCC0\uACBD\uD558\uAE30", color: isValid && nickname.trim() ? "main_1" : "gray_3", size: 350, onClick: handleNameChange, disabled: !isValid || !nickname.trim() }) }) }), _jsx(BasicPopup, { isOpen: isWithdrawPopupOpen, onClose: () => setIsWithdrawPopupOpen(false), title: "\uB2C9\uB124\uC784 \uBCC0\uACBD \uC644\uB8CC", content: _jsx("div", { className: "text-center text-body3 text-gray-3", children: "\uB2C9\uB124\uC784\uC774 \uC131\uACF5\uC801\uC73C\uB85C \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4." }), buttonText: "\uD655\uC778", onButtonClick: handleChangeComplete })] }) }));
}
