import { jsx as _jsx } from "react/jsx-runtime";
export function BasicAlert({ message }) {
    return (_jsx("div", { className: `
        text-body3
        text-utils-alert
      `, children: message }));
}
