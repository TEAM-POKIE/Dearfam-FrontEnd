import { jsx as _jsx } from "react/jsx-runtime";
export const BasicToast = ({ message }) => {
    return (_jsx("div", { className: "inline-flex py-[0.625rem] px-[1.25rem] justify-center items-center bg-main-1 rounded-[1.25rem]", children: _jsx("div", { className: "text-body3 text-gray-7", children: message }) }));
};
