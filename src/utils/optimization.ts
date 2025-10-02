/**
 * Modern image optimization utilities
 */

export class ImageOptimizer {
  private lazyImages: NodeListOf<HTMLImageElement> | null = null
  private imageObserver: IntersectionObserver | null = null

  constructor() {
    this.init()
  }

  init(): void {
    this.setupLazyLoading()
    this.optimizeExistingImages()
  }

  private setupLazyLoading(): void {
    this.lazyImages = document.querySelectorAll('img[data-src]')
    
    if ('IntersectionObserver' in window && this.lazyImages.length > 0) {
      this.imageObserver = new IntersectionObserver(
        this.handleImageIntersection.bind(this),
        {
          rootMargin: '50px'
        }
      )

      this.lazyImages.forEach(img => {
        if (this.imageObserver) {
          this.imageObserver.observe(img)
        }
      })
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadAllImages()
    }
  }

  private handleImageIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        this.loadImage(img)
        if (this.imageObserver) {
          this.imageObserver.unobserve(img)
        }
      }
    })
  }

  private loadImage(img: HTMLImageElement): void {
    const src = img.getAttribute('data-src')
    if (src) {
      img.src = src
      img.removeAttribute('data-src')
      img.classList.add('loaded')
    }
  }

  private loadAllImages(): void {
    if (this.lazyImages) {
      this.lazyImages.forEach(img => this.loadImage(img))
    }
  }

  private optimizeExistingImages(): void {
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      // Add loading attribute for native lazy loading
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy')
      }
      
      // Add decoding attribute for better performance
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async')
      }
    })
  }

  disconnect(): void {
    if (this.imageObserver) {
      this.imageObserver.disconnect()
    }
  }
}

/**
 * Code splitting utility for dynamic imports
 */
export class CodeSplitter {
  private loadedModules: Set<string> = new Set()

  async loadModule(modulePath: string): Promise<any> {
    if (this.loadedModules.has(modulePath)) {
      return Promise.resolve()
    }

    try {
      const module = await import(modulePath)
      this.loadedModules.add(modulePath)
      return module
    } catch (error) {
      console.error(`Failed to load module: ${modulePath}`, error)
      throw error
    }
  }

  async loadComponentOnDemand(
    trigger: Element,
    componentPath: string,
    initFunction?: string
  ): Promise<void> {
    const observer = new IntersectionObserver(
      async (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            try {
              const module = await this.loadModule(componentPath)
              if (initFunction && module[initFunction]) {
                module[initFunction]()
              }
              observer.unobserve(entry.target)
            } catch (error) {
              console.error('Failed to load component on demand:', error)
            }
          }
        })
      },
      { rootMargin: '100px' }
    )

    observer.observe(trigger)
  }
}