import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../../utils/utils";
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (_jsx("input", { type: type, className: cn("w-full h-full bg-gray-6 border-[2px] border-utils-stroke rounded-[1rem] px-2  ", className), ref: ref, ...props }));
});
Input.displayName = "Input";
export { Input };
