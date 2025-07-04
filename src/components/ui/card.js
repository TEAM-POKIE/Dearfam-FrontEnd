import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../utils/utils";
function Card({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card", className: cn("rounded-[0.875rem] border shadow-sm", className), ...props }));
}
function CardHeader({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-header", className: cn("flex flex-col ", className), ...props }));
}
function CardTitle({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-title", className: cn("leading-none font-semibold", className), ...props }));
}
function CardDescription({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-description", className: cn("text-muted-foreground text-sm", className), ...props }));
}
function CardContent({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-content", className: cn("p-0", className), ...props }));
}
function CardFooter({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-footer", className: cn("flex items-center px-6", className), ...props }));
}
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, };
