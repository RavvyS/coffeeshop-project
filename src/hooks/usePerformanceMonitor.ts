'use client';

import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  connectionType?: string;
  isSlowConnection: boolean;
}

interface WebVitals {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
}

/**
 * Performance Monitoring Hook
 * Tracks page performance, web vitals, and connection speed
 */
export function usePerformanceMonitor(componentName?: string) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    isSlowConnection: false,
  });
  const [webVitals, setWebVitals] = useState<WebVitals>({});
  const renderStartTime = useRef<number>(performance.now());

  // Detect connection speed
  const getConnectionInfo = () => {
    // @ts-ignore - navigator.connection is experimental
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };
    }
    
    return null;
  };

  // Check if connection is slow
  const isSlowConnection = () => {
    const connection = getConnectionInfo();
    if (!connection) return false;
    
    return (
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      connection.downlink < 1.5 ||
      connection.rtt > 300
    );
  };

  // Measure component render time
  useEffect(() => {
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    setMetrics(prev => ({
      ...prev,
      renderTime,
      isSlowConnection: isSlowConnection(),
      connectionType: getConnectionInfo()?.effectiveType,
    }));

    // Log performance metrics
    if (componentName) {
      console.log(`Performance: ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
    }
  }, [componentName]);

  // Measure page load performance
  useEffect(() => {
    const measureLoadTime = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        setMetrics(prev => ({ ...prev, loadTime }));
      }
    };

    // Measure memory usage (if available)
    const measureMemory = () => {
      // @ts-ignore - performance.memory is non-standard
      if (performance.memory) {
        // @ts-ignore
        const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
        setMetrics(prev => ({ ...prev, memoryUsage }));
      }
    };

    if (document.readyState === 'complete') {
      measureLoadTime();
      measureMemory();
    } else {
      window.addEventListener('load', () => {
        measureLoadTime();
        measureMemory();
      });
    }

    // Measure Web Vitals
    const measureWebVitals = () => {
      // FCP - First Contentful Paint
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcpEntry) {
        setWebVitals(prev => ({ ...prev, FCP: fcpEntry.startTime }));
      }

      // LCP - Largest Contentful Paint
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setWebVitals(prev => ({ ...prev, LCP: lastEntry.startTime }));
      });
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // LCP not supported
      }

      return () => observer.disconnect();
    };

    const cleanup = measureWebVitals();
    return cleanup;
  }, []);

  // Report performance issues
  const reportPerformanceIssue = (issue: string, data?: any) => {
    const report = {
      issue,
      data,
      metrics,
      webVitals,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    console.warn('Performance Issue:', report);
    
    // In production, send to monitoring service
    // analytics.track('performance_issue', report);
  };

  // Performance recommendations
  const getPerformanceRecommendations = () => {
    const recommendations = [];

    if (metrics.loadTime > 3000) {
      recommendations.push('Page load time is slow (>3s). Consider code splitting and lazy loading.');
    }

    if (metrics.renderTime > 100) {
      recommendations.push('Component render time is slow (>100ms). Consider memoization.');
    }

    if (metrics.memoryUsage && metrics.memoryUsage > 50) {
      recommendations.push('High memory usage detected (>50MB). Check for memory leaks.');
    }

    if (webVitals.LCP && webVitals.LCP > 2500) {
      recommendations.push('Largest Contentful Paint is slow (>2.5s). Optimize images and critical resources.');
    }

    if (webVitals.CLS && webVitals.CLS > 0.1) {
      recommendations.push('Cumulative Layout Shift is high (>0.1). Avoid layout shifts.');
    }

    return recommendations;
  };

  return {
    metrics,
    webVitals,
    reportPerformanceIssue,
    getPerformanceRecommendations,
    isSlowConnection: metrics.isSlowConnection,
  };
}