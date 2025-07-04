import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../utils/utils";
const Slider = React.forwardRef(({ className, ...props }, ref) => (_jsxs(SliderPrimitive.Root, { ref: ref, className: cn("relative flex w-full touch-none select-none items-center", className), ...props, children: [_jsx(SliderPrimitive.Track, { className: " h-[1px] w-full  bg-gray-3" }), _jsx(SliderPrimitive.Thumb, { className: "block h-[0.5rem] w-[3.125rem] rounded-[1.25rem] bg-main-1 focus:outline-none focus:ring-0" })] })));
Slider.displayName = SliderPrimitive.Root.displayName;
export { Slider };
