import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// 두 가지 상태의 이미지 가져오기
import dropdownDefaultIcon from "../../../assets/image/section1/dropdown_default.svg";
import dropdownActiveIcon from "../../../assets/image/section1/dropdown_active.svg";
export function BasicDropDown({ value, onChange, options, placeholder }) {
    const isSelected = value === options[0];
    return (_jsxs("div", { className: `
        flex
        items-center
        w-[clamp(12.5rem,56.41vw,21.875rem)]
        h-[clamp(2.5rem,8vw,3.125rem)]
        px-[clamp(0.5rem,3.2vw,1.25rem)]
        py-[clamp(0.25rem,1.6vw,0.625rem)]
        rounded-[1rem]
        bg-bg-2
        cursor-pointer
        focus:outline-none
      `, onClick: () => onChange(options[0]), children: [_jsx("img", { src: isSelected ? dropdownActiveIcon : dropdownDefaultIcon, alt: "\uC120\uD0DD \uC544\uC774\uCF58", className: "mr-[1.25rem]" }), _jsx("span", { className: "text-body3 text-[#000000]", children: placeholder || options[0] })] }));
}
