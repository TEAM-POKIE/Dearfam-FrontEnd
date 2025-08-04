// Performance monitoring utilities
import React from 'react';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Core Web Vitals observer
    if ('PerformanceObserver' in window) {
      try {
        // LCP (Largest Contentful Paint)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { 
            element?: { tagName: string }; 
            startTime: number; 
          };
          if (lastEntry) {
            this.recordMetric('LCP', lastEntry.startTime, {
              element: lastEntry.element?.tagName || 'unknown'
            });
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);

        // FID (First Input Delay)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: PerformanceEntry & { 
            processingStart: number; 
            startTime: number; 
            name: string; 
          }) => {
            this.recordMetric('FID', entry.processingStart - entry.startTime, {
              eventType: entry.name
            });
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);

        // CLS (Cumulative Layout Shift)
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: PerformanceEntry & { 
            hadRecentInput: boolean; 
            value: number; 
          }) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          if (clsValue > 0) {
            this.recordMetric('CLS', clsValue);
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);

        // Long tasks observer
        const longTaskObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.recordMetric('LongTask', entry.duration, {
              startTime: entry.startTime.toString()
            });
          });
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);

      } catch (error) {
        console.warn('Performance observer initialization failed:', error);
      }
    }
  }

  recordMetric(name: string, value: number, tags?: Record<string, string>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      tags
    };

    this.metrics.push(metric);

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`📊 Performance: ${name} = ${value.toFixed(2)}ms`, tags);
    }

    // Send to analytics service (implement as needed)
    this.sendToAnalytics(metric);
  }

  private sendToAnalytics(metric: PerformanceMetric) {
    // Implement analytics integration here
    // For example: Google Analytics, DataDog, etc.
    if (import.meta.env.PROD && (window as unknown as { gtag?: unknown }).gtag) {
      const gtag = (window as unknown as { gtag: (command: string, action: string, parameters: Record<string, unknown>) => void }).gtag;
      gtag('event', 'performance_metric', {
        metric_name: metric.name,
        metric_value: metric.value,
        custom_map: metric.tags
      });
    }
  }

  getMetrics(name?: string): PerformanceMetric[] {
    return name 
      ? this.metrics.filter(m => m.name === name)
      : this.metrics;
  }

  getAverageMetric(name: string): number | null {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return null;
    
    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  cleanup() {
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (error) {
        console.warn('Error disconnecting performance observer:', error);
      }
    });
    this.observers = [];
    this.metrics = [];
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  return {
    recordMetric: performanceMonitor.recordMetric.bind(performanceMonitor),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    getAverageMetric: performanceMonitor.getAverageMetric.bind(performanceMonitor),
  };
};

// Performance timing utilities
export const measureFunction = <T extends unknown[], R>(
  fn: (...args: T) => R,
  name: string
) => {
  return (...args: T): R => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    
    performanceMonitor.recordMetric(`Function_${name}`, end - start);
    return result;
  };
};

export const measureAsyncFunction = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  name: string
) => {
  return async (...args: T): Promise<R> => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    
    performanceMonitor.recordMetric(`AsyncFunction_${name}`, end - start);
    return result;
  };
};

// React component performance decorator
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return React.forwardRef<unknown, P>((props, ref) => {
    React.useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        performanceMonitor.recordMetric(
          `Component_${componentName}_Mount`,
          endTime - startTime
        );
      };
    }, []);

    return React.createElement(Component, { ...props, ref });
  });
};

// Memory usage tracking
export const trackMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as unknown as { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    performanceMonitor.recordMetric('MemoryUsed', memory.usedJSHeapSize);
    performanceMonitor.recordMetric('MemoryTotal', memory.totalJSHeapSize);
    performanceMonitor.recordMetric('MemoryLimit', memory.jsHeapSizeLimit);
  }
};

// Bundle size analyzer (for build time)
export const analyzeBundleSize = async () => {
  if (import.meta.env.PROD) {
    const modules = await import.meta.glob('/src/**/*.{ts,tsx,js,jsx}');
    const moduleCount = Object.keys(modules).length;
    
    performanceMonitor.recordMetric('BundleModuleCount', moduleCount);
    
    // Track chunk sizes if available
    if ('performance' in window && performance.getEntriesByType) {
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const entry = navigationEntries[0] as PerformanceNavigationTiming;
        performanceMonitor.recordMetric('BundleLoadTime', entry.loadEventEnd - entry.loadEventStart);
      }
    }
  }
};

// Image loading performance
export const trackImageLoading = (src: string, loadTime: number) => {
  performanceMonitor.recordMetric('ImageLoadTime', loadTime, {
    src: src.substring(src.lastIndexOf('/') + 1), // filename only for privacy
  });
};

// Cleanup function for app unmount
export const cleanupPerformanceMonitoring = () => {
  performanceMonitor.cleanup();
};

export default performanceMonitor;