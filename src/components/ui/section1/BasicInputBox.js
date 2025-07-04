import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function BasicInputBox({ fullWidth = false, className = "", onValueChange, onChange, placeholder, ...props }) {
    // 입력값 변경 핸들러
    const handleChange = (e) => {
        onChange?.(e);
        onValueChange?.(e.target.value);
    };
    // 컨테이너 너비 스타일
    const containerWidth = fullWidth ? "w-full" : "w-auto";
    return (_jsxs("div", { className: `flex flex-col ${containerWidth} ${className}`, children: [_jsx("input", { className: `
          border
          px-[clamp(0.5rem,3.2vw,1.25rem)]
          py-[clamp(0.25rem,2.4vw,0.9375rem)]
          ${fullWidth ? "w-full" : "w-[clamp(12.5rem,56.41vw,21.875rem)]"}
          border-gray-300
          rounded-[0.88rem]
          bg-bg-2
          placeholder:text-gray-4
          placeholder:text-body2         
          focus:outline-none
          text-gray-2
      
          disabled:text-gray-4
        `, placeholder: placeholder, onChange: handleChange, ...props }), _jsx("span", { className: `
            text-caption2 
            mt-[clamp(0.125rem,0.48vw,0.1875rem)]
          ` })] }));
}
