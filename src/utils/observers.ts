/**
 * Modern Intersection Observer implementation for scroll animations
 */

export class IntersectionObserverManager {
  private observer: IntersectionObserver | null = null
  private options: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  }

  constructor() {
    this.handleIntersection = this.handleIntersection.bind(this)
  }

  init(): void {
    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers
      this.fallbackAnimation()
      return
    }

    this.observer = new IntersectionObserver(this.handleIntersection, this.options)
    this.observeElements()
  }

  private observeElements(): void {
    const elements = document.querySelectorAll('.fade-in-section, .hero-image-fade')
    elements.forEach(element => {
      if (this.observer) {
        this.observer.observe(element)
      }
    })
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        // Unobserve the element after animation to improve performance
        if (this.observer) {
          this.observer.unobserve(entry.target)
        }
      }
    })
  }

  private fallbackAnimation(): void {
    // Simple fallback for browsers without IntersectionObserver
    const elements = document.querySelectorAll('.fade-in-section, .hero-image-fade')
    elements.forEach(element => {
      element.classList.add('is-visible')
    })
  }

  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}