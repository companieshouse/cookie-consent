import { COOKIES, URLS } from '../constants'
import { CHCookie } from '../types'

/**
 * Creates the Companies House cookie tracking cookie
 * @param name string
 * @param value string
 * @param days number
 */
function createCookie (name: string, value: string, days: number): void {
  const date = new Date()
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
  const expires = `; expires=${date.toUTCString()}`
  document.cookie = name + '=' + value + expires + '; path=/; domain=' + setDomain()
}

/**
 * Handles the logic when Cookies are accepted
 * @param callback () => void
 */
export function acceptCookies (callback: () => void): void {
  const cookieBanner = document.getElementById('cookie-banner')
  const cookieBannerAlert = document.getElementById('govuk-cookie-banner__message')
  callback()
  createCookie('ch_cookie_consent', `{"userHasAllowedCookies": "yes", "cookiesAllowed": ${JSON.stringify(COOKIES)}}`, 365)
  if (cookieBanner !== null && cookieBannerAlert !== null) {
    cookieBanner.hidden = true
    cookieBannerAlert.removeAttribute('hidden')
  }
}

/**
 * Handles the logic when Cookies are rejected
 */
export function rejectCookies (): void {
  const cookieBanner = document.getElementById('cookie-banner')
  const cookieBannerAlert = document.getElementById('govuk-cookie-banner__message')

  createCookie('ch_cookie_consent', '{"userHasAllowedCookies": "no", "cookiesAllowed": []}', 365)

  if (cookieBanner !== null && cookieBannerAlert !== null) {
    cookieBanner.hidden = true
    cookieBannerAlert.removeAttribute('hidden')
  }
}

/**
 * Returns a cookie object if one exists, otherwise returns a default object
 */
export function getCookieObject (): CHCookie {
  const nameEQ = 'ch_cookie_consent='
  var cookieArray = document.cookie.split(';')

  for (const cookie of cookieArray) {
    if (cookie.includes(nameEQ)) {
      const cookieTuple = cookie.split('=')
      return JSON.parse(cookieTuple[1]) as CHCookie
    }
  }

  return {
    userHasAllowedCookies: 'unset',
    cookiesAllowed: []
  }
}

/**
 * Hides the banner alert shown after cookie consent is accepted or rejected
 */
export function hideBannerAlert (): void {
  const cookieBannerAlert = document.getElementById('govuk-cookie-banner__message')
  if (cookieBannerAlert !== null) {
    cookieBannerAlert.hidden = true
  }
}

/**
 * Start function which is called from the page, accepts a callback to initiate the analytics payload(s)
 * @param callback () => void
 */
export function start (callback: () => void): void {
  const { userHasAllowedCookies, cookiesAllowed } = getCookieObject()
  const cookieBanner = document.getElementById('cookie-banner')

  if (userHasAllowedCookies === 'yes' && haveAllCookiesBeenAccepted(cookiesAllowed)) {
    callback()
  } else if (
    (userHasAllowedCookies === 'yes' && !haveAllCookiesBeenAccepted(cookiesAllowed)) ||
    userHasAllowedCookies === 'unset'
  ) {
    if (cookieBanner !== null) {
      cookieBanner.removeAttribute('hidden')
    }
  }
}

/**
 * Returns the highest level CH domain possible based on the Public Suffix List (https://publicsuffix.org/).
 */
function setDomain (): string {
  for (const url of URLS) {
    if (window.location.host.includes(url)) {
      return url
    }
  }
  return window.location.host
}

/**
 * Checks the array of cookies a user consented to on their last visit
 * @param cookieArray string[]
 */
function haveAllCookiesBeenAccepted (cookieArray: string[]): boolean {
  if (cookieArray.length !== COOKIES.length) {
    return false
  }

  for (let i = 0; i < COOKIES.length; i++) {
    if (COOKIES[i] !== cookieArray[i]) {
      return false
    }
  }

  return true
}
