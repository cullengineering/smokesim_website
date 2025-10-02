/**
 * Performance monitoring utilities
 */

export class PerformanceMonitor {
  private startTime: number = 0
  private metrics: Record<string, number> = {}

  start(): void {
    this.startTime = performance.now()
    
    // Monitor Core Web Vitals
    this.observeLCP()
    this.observeFID()
    this.observeCLS()
  }

  markPageLoaded(): void {
    const loadTime = performance.now() - this.startTime
    this.metrics.pageLoadTime = loadTime
    
    // Only log in development mode
    if (import.meta.env?.DEV) {
      console.log(`Page loaded in ${loadTime.toFixed(2)}ms`)
    }
  }

  private observeLCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        this.metrics.lcp = lastEntry.startTime
      })
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        // LCP not supported in this browser
      }
    }
  }

  private observeFID(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime
        })
      })
      
      try {
        observer.observe({ entryTypes: ['first-input'] })
      } catch (e) {
        // FID not supported in this browser
      }
    }
  }

  private observeCLS(): void {
    if ('PerformanceObserver' in window) {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            this.metrics.cls = clsValue
          }
        })
      })
      
      try {
        observer.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        // CLS not supported in this browser
      }
    }
  }

  getMetrics(): Record<string, number> {
    return { ...this.metrics }
  }
}