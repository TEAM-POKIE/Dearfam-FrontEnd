import "@testing-library/jest-dom";

// MSW는 개발/테스트 환경에서만 사용
if (process.env.NODE_ENV !== 'production') {
  try {
    // 동적 import로 MSW 서버 로드
    import("@/mocks/server").then(({ server }) => {
      // beforeAll(() => server.listen());
      // afterEach(() => server.resetHandlers());
      // afterAll(() => server.close());
    }).catch(() => {
      // MSW 로드 실패시 무시
      console.warn('MSW server could not be loaded');
    });
  } catch (error) {
    // MSW 초기화 실패시 무시
    console.warn('MSW setup failed:', error);
  }
}
