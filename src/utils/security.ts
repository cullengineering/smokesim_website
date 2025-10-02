/**
 * Security utilities and Content Security Policy helpers
 */

export class SecurityManager {
  private nonce: string

  constructor() {
    this.nonce = this.generateNonce()
    this.initializeCSP()
    this.setupSecurityHeaders()
  }

  private generateNonce(): string {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return btoa(String.fromCharCode(...array))
  }

  private initializeCSP(): void {
    // Add CSP meta tag if not already present
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const csp = this.buildCSPDirectives()
      const meta = document.createElement('meta')
      meta.httpEquiv = 'Content-Security-Policy'
      meta.content = csp
      document.head.appendChild(meta)
    }
  }

  private buildCSPDirectives(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ')
  }

  private setupSecurityHeaders(): void {
    // Add security-related meta tags
    this.addSecurityMeta('X-Content-Type-Options', 'nosniff')
    this.addSecurityMeta('X-Frame-Options', 'DENY')
    this.addSecurityMeta('X-XSS-Protection', '1; mode=block')
    this.addSecurityMeta('Referrer-Policy', 'strict-origin-when-cross-origin')
  }

  private addSecurityMeta(name: string, content: string): void {
    if (!document.querySelector(`meta[http-equiv="${name}"]`)) {
      const meta = document.createElement('meta')
      meta.httpEquiv = name
      meta.content = content
      document.head.appendChild(meta)
    }
  }

  sanitizeHTML(html: string): string {
    const div = document.createElement('div')
    div.textContent = html
    return div.innerHTML
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  }

  getNonce(): string {
    return this.nonce
  }
}