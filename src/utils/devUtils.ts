// Development utilities

// Safe console logging - only logs in development
export const devLog = (...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};

export const devWarn = (...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.warn(...args);
  }
};

export const devError = (...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.error(...args);
  }
};

// Debug helper for component props
export const debugProps = <T extends Record<string, unknown>>(componentName: string, props: T): T => {
  if (import.meta.env.DEV) {
    console.group(`🔍 ${componentName} Props`);
    console.table(props);
    console.groupEnd();
  }
  return props;
};

// Performance timer utility
export const createPerformanceTimer = (label: string) => {
  if (!import.meta.env.DEV) {
    return { start: () => {}, end: () => {} };
  }

  const startTime = performance.now();
  
  return {
    start: () => {
      console.time(label);
    },
    end: () => {
      const endTime = performance.now();
      console.timeEnd(label);
      console.log(`⏱️ ${label}: ${(endTime - startTime).toFixed(2)}ms`);
    }
  };
};

// Type-safe environment variable checker
export const isDev = import.meta.env.DEV;
export const isProd = import.meta.env.PROD;
export const isTest = import.meta.env.MODE === 'test';

// Feature flag utility
export const featureFlag = (flag: string, defaultValue = false): boolean => {
  if (!import.meta.env.DEV) return defaultValue;
  
  const envValue = import.meta.env[`VITE_FEATURE_${flag.toUpperCase()}`];
  if (envValue === undefined) return defaultValue;
  
  return envValue === 'true' || envValue === '1';
};

export default {
  devLog,
  devWarn,
  devError,
  debugProps,
  createPerformanceTimer,
  isDev,
  isProd,
  isTest,
  featureFlag,
};