import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
// TanStack Query 클라이언트 생성
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5분
            refetchOnWindowFocus: false,
        },
    },
});
function App() {
    return (_jsxs(QueryClientProvider, { client: queryClient, children: [_jsx(BrowserRouter, { children: _jsx(AppRoutes, {}) }), _jsx(ReactQueryDevtools, { initialIsOpen: false })] }));
}
export default App;
