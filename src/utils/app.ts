/**
 * Application initialization and global utilities
 */

import { HeaderComponent } from '../components/Header'
import { ServiceCard } from '../components/ServiceCard'

export function initializeApp(): void {
  console.log('SmokeSim website initialized')
  
  // Initialize components
  new HeaderComponent()
  new ServiceCard()
  
  // Initialize smooth scrolling for navigation links
  initializeSmoothScrolling()
  
  // Add accessibility improvements
  enhanceAccessibility()
}

function initializeSmoothScrolling(): void {
  const links = document.querySelectorAll('a[href^="#"]')
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const targetId = (link as HTMLAnchorElement).getAttribute('href')
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
    })
  })
}

function enhanceAccessibility(): void {
  // Add skip link functionality
  const skipLink = document.querySelector('.skip-link') as HTMLAnchorElement
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.querySelector('#main-content') as HTMLElement
      if (target) {
        target.focus()
      }
    })
  }
  
  // Improve keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation')
    }
  })
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation')
  })
}