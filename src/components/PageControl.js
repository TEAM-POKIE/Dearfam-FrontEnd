import { jsx as _jsx } from "react/jsx-runtime";
export function PageControl({ currentStep, totalSteps }) {
    return (_jsx("div", { className: "flex flex-col justify-center items-center w-[390px] p-[10px]", children: _jsx("div", { className: "flex justify-center items-center gap-2", children: Array.from({ length: totalSteps }).map((_, index) => (_jsx("div", { className: `w-[10px] h-[10px] rounded-full ${index + 1 === currentStep ? 'bg-main-1' : 'bg-gray-300'}` }, index))) }) }));
}
