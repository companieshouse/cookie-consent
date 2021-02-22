import { COOKIES, URLS } from '../constants'
import { CHCookie } from '../types'

function createCookie (name: string, value: string, days: number): void {
  const date = new Date()
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
  const expires = `; expires=${date.toUTCString()}`
  document.cookie = name + '=' + value + expires + '; path=/; domain=' + setDomain()
}

export function acceptCookies (callback: () => void): void {
  const cookieBanner = document.getElementById('cookie-banner')
  const cookieBannerAlert = document.getElementById('govuk-cookie-banner__message')
  callback()
  createCookie('ch_cookie_consent', `{"allow_cookies": "yes", "cookies": ${JSON.stringify(COOKIES)}}`, 365)
  if (cookieBanner !== null && cookieBannerAlert !== null) {
    cookieBanner.hidden = true
    cookieBannerAlert.removeAttribute('hidden')
  }
}

export function rejectCookies (): void {
  const cookieBanner = document.getElementById('cookie-banner')
  const cookieBannerAlert = document.getElementById('govuk-cookie-banner__message')
  createCookie('ch_cookie_consent', '{"allow_cookies": "no"}', 365)
  if (cookieBanner !== null && cookieBannerAlert !== null) {
    cookieBanner.hidden = true
    cookieBannerAlert.removeAttribute('hidden')
  }
}

export function checkCookieIsSet (): string {
  const nameEQ = 'ch_cookie_consent='
  var cookieArray = document.cookie.split(';')
  for (const cookie of cookieArray) {
    if (cookie.includes(nameEQ)) {
      const cookieTuple = cookie.split('=')
      const cookieConsent: CHCookie = JSON.parse(cookieTuple[1])
      return cookieConsent.allow_cookies
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
  } else if (checkCookieIsSet() !== 'no') {
    const cookieBanner = document.getElementById('cookie-banner')
    if (cookieBanner !== null) {
      cookieBanner.removeAttribute('hidden')
    }
  }
}

function setDomain (): string {
  for (const url of URLS) {
    if (window.location.host.includes(url)) {
      return url
    }
  }
  return window.location.host
}
