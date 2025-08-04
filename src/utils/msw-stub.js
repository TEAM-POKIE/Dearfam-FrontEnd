// MSW 스텁 파일 - 프로덕션 빌드시 MSW 모듈을 대체합니다

export const http = {
  get: () => {},
  post: () => {},
  put: () => {},
  delete: () => {},
  patch: () => {},
};

export const HttpResponse = {
  json: () => {},
  text: () => {},
  xml: () => {},
  html: () => {},
};

export const setupWorker = () => ({
  start: () => Promise.resolve(),
  stop: () => Promise.resolve(),
  resetHandlers: () => {},
});

export const setupServer = () => ({
  listen: () => {},
  close: () => {},
  resetHandlers: () => {},
});

export default {};