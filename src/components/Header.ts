/**
 * Header component with modern features
 */

export class HeaderComponent {
  private header: HTMLElement | null = null
  private lastScrollY: number = 0

  constructor() {
    this.init()
  }

  private init(): void {
    this.header = document.querySelector('header')
    if (this.header) {
      this.setupScrollBehavior()
      this.setupMobileMenu()
    }
  }

  private setupScrollBehavior(): void {
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true })
  }

  private handleScroll(): void {
    if (!this.header) return

    const currentScrollY = window.scrollY
    
    // Add/remove scrolled class for styling
    if (currentScrollY > 50) {
      this.header.classList.add('scrolled')
    } else {
      this.header.classList.remove('scrolled')
    }

    // Hide/show header on scroll (optional)
    if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
      this.header.classList.add('header-hidden')
    } else {
      this.header.classList.remove('header-hidden')
    }

    this.lastScrollY = currentScrollY
  }

  private setupMobileMenu(): void {
    // Mobile menu implementation would go here
    // For now, this is a placeholder since the current design doesn't have a mobile menu
    console.log('Mobile menu setup placeholder')
  }
}