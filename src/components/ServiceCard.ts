/**
 * Service card component with enhanced interactions
 */

export class ServiceCard {
  private cards: NodeListOf<Element> | null = null

  constructor() {
    this.init()
  }

  private init(): void {
    this.cards = document.querySelectorAll('.service-card')
    this.setupInteractions()
  }

  private setupInteractions(): void {
    if (!this.cards) return

    this.cards.forEach((card, index) => {
      // Add staggered animation delays
      const delay = index * 100
      card.setAttribute('style', `animation-delay: ${delay}ms`)

      // Enhanced hover effects
      card.addEventListener('mouseenter', this.handleCardHover.bind(this))
      card.addEventListener('mouseleave', this.handleCardLeave.bind(this))
      
      // Keyboard accessibility
      card.addEventListener('focus', this.handleCardFocus.bind(this))
      card.addEventListener('blur', this.handleCardBlur.bind(this))
    })
  }

  private handleCardHover(event: Event): void {
    const card = event.currentTarget as HTMLElement
    card.classList.add('card-hovered')
  }

  private handleCardLeave(event: Event): void {
    const card = event.currentTarget as HTMLElement
    card.classList.remove('card-hovered')
  }

  private handleCardFocus(event: Event): void {
    const card = event.currentTarget as HTMLElement
    card.classList.add('card-focused')
  }

  private handleCardBlur(event: Event): void {
    const card = event.currentTarget as HTMLElement
    card.classList.remove('card-focused')
  }
}