/// <reference types="vitest" />
import * as path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, type ViteDevServer } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import type { IncomingMessage, ServerResponse } from "http";

// 터미널에 브라우저 콘솔을 출력하는 커스텀 플러그인
function consoleLogPlugin() {
  return {
    name: "console-log",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(
        "/api/console",
        (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (req.method === "POST") {
            let body = "";
            req.on("data", (chunk: Buffer) => {
              body += chunk.toString();
            });
            req.on("end", () => {
              try {
                const { level, args } = JSON.parse(body);
                const timestamp = new Date().toLocaleTimeString();
                const prefix =
                  level === "error"
                    ? "❌"
                    : level === "warn"
                    ? "⚠️"
                    : level === "info"
                    ? "ℹ️"
                    : "🔍";
                console.log(
                  `\n${prefix} [${timestamp}] Browser Console:`,
                  ...args
                );
              } catch (e) {
                console.error("Error parsing console log:", e);
              }
            });
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end('{"status":"ok"}');
          } else {
            next();
          }
        }
      );
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    // 개발 환경에서만 콘솔 로그 플러그인 활성화
    ...(process.env.NODE_ENV === "development" ? [consoleLogPlugin()] : []),
    // 번들 분석 도구 (빌드 시에만)
    ...(process.env.ANALYZE
      ? [
          visualizer({
            filename: "bundle-analysis.html",
            open: true,
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // 개발 서버 설정
    host: true,
    port: 5173,
    open: false, // 자동으로 브라우저 열지 않음
    // HMR 설정
    hmr: {
      overlay: true, // 에러 오버레이 표시
    },
    // 프록시 설정이 필요한 경우
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 백엔드 서버 주소로 변경
        changeOrigin: true,
        secure: false,
      },
    },
  },
  esbuild: {
    target: "es2020",
    jsxInject: `import React from 'react'`,
  },
  build: {
    target: "es2020",
    sourcemap: true,
    rollupOptions: {
      output: {
        // 벤더 라이브러리 분리를 통한 청크 최적화
        manualChunks: {
          // React 코어
          "react-vendor": ["react", "react-dom"],
          // 라우팅
          router: ["react-router-dom"],
          // 상태 관리
          state: ["zustand", "@tanstack/react-query"],
          // UI 라이브러리
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-popover",
          ],
          // 유틸리티
          utils: ["clsx", "tailwind-merge", "zod"],
          // 폼 관련
          form: ["react-hook-form", "@hookform/resolvers"],
          // 이미지/미디어
          media: ["react-window"],
        },
        // 청크 파일명 설정
        chunkFileNames: () => {
          return `assets/[name]-[hash].js`;
        },
      },
    },
    // 청크 크기 경고 임계값 조정 (기본 500KB에서 300KB로)
    chunkSizeWarningLimit: 300,
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
