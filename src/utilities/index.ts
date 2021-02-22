import { DOMAIN } from '../constants'

function createCookie (name: string, value: string, days: number): void {
  const date = new Date()

  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))

  const expires = `; expires=${date.toUTCString()}`

  document.cookie = name + '=' + value + expires + '; path=/; domain=' + DOMAIN
}

export function acceptCookies (callback: () => void): void {
  const cookieBanner = document.getElementById('cookie-banner')
  const cookieBannerAlert = document.getElementById('govuk-cookie-banner__message')
  callback()
  createCookie('allow_cookies', 'yes,[piwik,google]', 365)
  if (cookieBanner !== null && cookieBannerAlert !== null) {
    cookieBanner.hidden = true
    cookieBannerAlert.removeAttribute('hidden')
  }
}

export function rejectCookies (): void {
  const cookieBanner = document.getElementById('cookie-banner')
  const cookieBannerAlert = document.getElementById('govuk-cookie-banner__message')
  createCookie('allow_cookies', 'no', 365)
  if (cookieBanner !== null && cookieBannerAlert !== null) {
    cookieBanner.hidden = true
    cookieBannerAlert.removeAttribute('hidden')
  }
}

export function checkCookieIsSet (): string {
  const nameEQ = 'allow_cookies='
  var cookieArray = document.cookie.split(';')
  for (const cookie of cookieArray) {
    if (cookie.includes(nameEQ)) {
      return 'yes'
    }
  }
  return ''
}

export function hideBannerAlert (): void {
  const cookieBannerAlert = document.getElementById('govuk-cookie-banner__message')
  if (cookieBannerAlert !== null) {
    cookieBannerAlert.hidden = true
  }
}

export function start (callback: () => void): void {
  if (checkCookieIsSet() === 'yes') {
    callback()
    const cookieBanner = document.getElementById('cookie-banner')
    if (cookieBanner !== null) {
      cookieBanner.hidden = true
    }
  }
}
