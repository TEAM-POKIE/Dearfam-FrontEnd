import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
// MSW 초기화 (개발 환경에서만)
if (import.meta.env.DEV) {
    import("./mocks/browser").then(({ worker }) => {
        worker
            .start({
            onUnhandledRequest: "bypass", // 처리되지 않은 요청은 그대로 통과
        })
            .then(() => {
            console.log("🚀 MSW가 시작되었습니다!");
        });
    });
}
createRoot(document.getElementById("root")).render(_jsx(StrictMode, { children: _jsx(App, {}) }));
