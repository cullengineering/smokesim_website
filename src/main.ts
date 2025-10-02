/**
 * Modern TypeScript main entry point
 * Implements ES6 modules and modern JavaScript patterns
 */

import './styles/main.css'
import { initializeApp } from './utils/app'
import { IntersectionObserverManager } from './utils/observers'
import { PerformanceMonitor } from './utils/performance'
import { ImageOptimizer } from './utils/optimization'

// Force scroll to top on page load/refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0)
})

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor()
performanceMonitor.start()

// Initialize intersection observer for animations
const observerManager = new IntersectionObserverManager()

// Initialize image optimization
const imageOptimizer = new ImageOptimizer()

// DOM Content Loaded handler
document.addEventListener('DOMContentLoaded', () => {
  // Ensure page starts at top
  window.scrollTo(0, 0)
  
  initializeApp()
  observerManager.init()
  imageOptimizer.init()
  
  // Mark page as fully loaded
  performanceMonitor.markPageLoaded()
})

// Service Worker registration (for PWA functionality)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Ensure scroll to top after everything loads
    window.scrollTo(0, 0)
    
    navigator.serviceWorker.register('/smokesim_website/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}

// Critical resource hints for better performance
const criticalResourceHints = [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
]

criticalResourceHints.forEach(hint => {
  const link = document.createElement('link')
  link.rel = hint.rel
  link.href = hint.href
  if (hint.crossorigin) {
    link.crossOrigin = 'anonymous'
  }
  document.head.appendChild(link)
})