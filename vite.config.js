/// <reference types="vitest" />
import * as path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
export default defineConfig({
    plugins: [react()],
    server: {
        port: 8080,
        host: true,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/utils/setupTests.ts", // MSW 및 jest-dom 설정 위치
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
        },
    },
});
