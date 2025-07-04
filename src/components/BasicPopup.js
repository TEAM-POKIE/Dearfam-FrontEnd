import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from "lucide-react";
import { BasicButton } from "./BasicButton";
/**
 * 재사용 가능한 팝업 컴포넌트
 * @param {boolean} isOpen - 팝업 표시 여부
 * @param {Function} onClose - 닫기 버튼 클릭 시 호출될 함수
 * @param {string} title - 팝업 제목
 * @param {string|ReactNode} content - 팝업 내용 (문자열 또는 React 컴포넌트)
 * @param {string} buttonText - 버튼 텍스트
 * @param {Function} onButtonClick - 버튼 클릭 시 호출될 함수
 */
export const BasicPopup = ({ isOpen, onClose, title = "title", content = "this is content. this is content. this is content. this is content. this is content. this is content. this is content. this is content. this is content. ", buttonText = "buttonText", onButtonClick, }) => {
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 flex items-center justify-center z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black opacity-60", onClick: onClose }), _jsxs("div", { className: "flex justify-center bg-white relative z-10 rounded-[clamp(0.75rem,1.92vw,1.25rem)] w-[clamp(15.625rem,70vw,21.875rem)] p-[clamp(0.75rem,2.88vw,1.875rem)]", children: [_jsx("button", { onClick: onClose, className: "absolute top-[clamp(0.75rem,1.92vw,1.25rem)] right-[clamp(0.75rem,1.92vw,1.25rem)] text-main-3 hover:text-neutral-600", "aria-label": "Close", children: _jsx(X, { className: "w-[clamp(1rem,1.54vw,1.5rem)] h-[clamp(1rem,1.54vw,1.5rem)]" }) }), _jsxs("div", { className: "w-full flex flex-col items-center gap-[clamp(1rem,2.88vw,1.875rem)]", children: [_jsx("h4", { className: "text-h4 text-center whitespace-pre-line", children: title }), _jsx("div", { children: _jsx("div", { className: "text-neutral-600 text-center", children: typeof content === "string" ? (_jsx("p", { className: "text-body3 whitespace-pre-line", children: content })) : (content) }) }), _jsx(BasicButton, { text: buttonText, onClick: onButtonClick || onClose, color: "main_1", size: 290, textStyle: "text-h4" })] })] })] }));
};
export default BasicPopup;
