import { COOKIES, URLS } from '../constants'
import { CHCookie } from '../types'

/**
 * Creates the Companies House cookie tracking cookie
 * @param value
 */
function createCookie (value: CHCookie): void {
  const days = 365
  const name = 'ch_cookie_consent'
  const date = new Date()
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
  const expiryDate = date.toUTCString()
  document.cookie = name + '=' + JSON.stringify(value) + '; expires=' + expiryDate + '; path=/; domain=' + setDomain()
}

/**
 * Handles the logic when Cookies are accepted
 * @param callback
 */
export function acceptCookies (callback: () => void): void {
  callback()
  const cookieBanner = document.getElementById('cookie-banner')
  const cookieBannerAlert = document.getElementById('govuk-cookie-banner__message')

  const cookie: CHCookie = {
    userHasAllowedCookies: 'yes',
    cookiesAllowed: COOKIES
  }

  createCookie(cookie)

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

  const cookie: CHCookie = {
    userHasAllowedCookies: 'no',
    cookiesAllowed: []
  }

  createCookie(cookie)

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

  const cookie: CHCookie = {
    userHasAllowedCookies: 'unset',
    cookiesAllowed: []
  }

  return cookie
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
 * @param callback
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
 * @param cookieArray
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
