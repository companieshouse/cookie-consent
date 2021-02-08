import { DOMAIN } from '../constants'

function createCookie (name: string, value: string, days: number): void {
  const date = new Date()

  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))

  const expires = `; expires=${date.toUTCString()}`

  document.cookie = name + '=' + value + expires + '; path=/; domain=' + DOMAIN
}

export function acceptCookies (): void {
  const cookieBanner = document.getElementById('cookie-banner')
  startPiwik()
  createCookie('allow_cookies', 'yes', 1)
  if (cookieBanner?.style.display === 'block') {
    cookieBanner.style.display = 'none'
  }
}

export function rejectCookies (): void {
  const cookieBanner = document.getElementById('cookie-banner')
  createCookie('allow_cookies', 'no', 1)
  if (cookieBanner?.style.display === 'none') {
    cookieBanner.style.display = 'block'
  }
}

export function checkCookieIsSet (): string {
  const nameEQ = 'allow_cookies='
  var cookieArray = document.cookie.split(';')
  for (const cookie of cookieArray) {
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length)
    }
  }
  return ''
}
