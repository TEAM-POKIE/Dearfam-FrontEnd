import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import backButton from "../../../assets/image/backbutton.svg";
import { useNavigate } from "react-router-dom";
export const HeaderNav = () => {
    const navigate = useNavigate();
    const backClick = () => {
        navigate("/");
    };
    return (_jsxs("div", { className: "h-[3.125rem] relative flex items-center py-[0.81rem] pl-[0.625rem]", children: [_jsx("img", { src: backButton, alt: "\uB4A4\uB85C\uAC00\uAE30", onClick: backClick, className: "w-[1.5rem]" }), _jsx("div", { className: "absolute left-1/2 transform -translate-x-1/2 text-h4 text-gray-2", children: "eventTitle" })] }));
};
