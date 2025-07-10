/// <reference types="vitest" />
import * as path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
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
