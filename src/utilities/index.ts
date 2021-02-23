import { COOKIES, COOKIE_NAME, PUBLIC_SUFFIX_URLS } from '../constants'
import { CHCookie } from '../types'

/**
 * Creates the Companies House cookie tracking cookie
 * @param value
 */
function createCookie (value: CHCookie): void {
  const days = 365
  const date = new Date()
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
  const expiryDate = date.toUTCString()
  document.cookie = COOKIE_NAME + '=' + JSON.stringify(value) + '; expires=' + expiryDate + '; path=/; domain=' + setDomain()
}

/**
 * Handles the logic when Cookies are accepted
 * @param callback
 */
export function acceptCookies (callback: () => void): void {
  const cookiesAcceptOrRejectMessage: HTMLElement | null = document.querySelector('[cookie-message="accept-or-reject"]')
  const cookiesAcceptedMessage: HTMLElement | null = document.querySelector('[cookie-message="accepted"]')

  const cookie: CHCookie = {
    userHasAllowedCookies: 'yes',
    cookiesAllowed: COOKIES
  }

  createCookie(cookie)

  if (cookiesAcceptOrRejectMessage !== null) {
    cookiesAcceptOrRejectMessage.hidden = true
  }
  if (cookiesAcceptedMessage !== null) {
    cookiesAcceptedMessage.removeAttribute('hidden')
  }
  callback()
}

/**
 * Handles the logic when Cookies are rejected
 */
export function rejectCookies (): void {
  const cookiesAcceptOrRejectMessage: HTMLElement | null = document.querySelector('[cookie-message="accept-or-reject"]')
  const cookiesRejectedMessage: HTMLElement | null = document.querySelector('[cookie-message="rejected"]')

  const cookie: CHCookie = {
    userHasAllowedCookies: 'no',
    cookiesAllowed: []
  }

  createCookie(cookie)

  if (cookiesAcceptOrRejectMessage !== null) {
    cookiesAcceptOrRejectMessage.hidden = true
  }
  if (cookiesRejectedMessage !== null) {
    cookiesRejectedMessage.removeAttribute('hidden')
  }
}

/**
 * Returns a cookie object if one exists, otherwise returns a default object
 */
export function getCookieObject (): CHCookie {
  const cookieArray = document.cookie.split(';')

  for (const cookie of cookieArray) {
    if (cookie.includes(COOKIE_NAME)) {
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
export function hideCookieBanners (): void {
  const cookieBanner: HTMLElement | null = document.querySelector('[cookie-banner]')
  const cookiesAcceptedMessage: HTMLElement | null = document.querySelector('[cookie-message="accepted"]')
  const cookiesRejectedMessage: HTMLElement | null = document.querySelector('[cookie-message="rejected"]')
  if (cookieBanner !== null) {
    cookieBanner.hidden = true
  }
  if (cookiesAcceptedMessage !== null) {
    cookiesAcceptedMessage.hidden = true
  }
  if (cookiesRejectedMessage !== null) {
    cookiesRejectedMessage.hidden = true
  }
}

/**
 * Start function which is called from the page, accepts a callback to initiate the analytics payload(s)
 * @param callback
 */
export function start (callback: () => void): void {
  const { userHasAllowedCookies, cookiesAllowed } = getCookieObject()
  const cookieBanner = document.querySelector('[cookie-banner]')
  const cookiesAcceptOrRejectMessage = document.querySelector('[cookie-message="accept-or-reject"]')

  if (userHasAllowedCookies === 'yes' && haveAllCookiesBeenAccepted(cookiesAllowed)) {
    callback()
  } else if (
    (userHasAllowedCookies === 'yes' && !haveAllCookiesBeenAccepted(cookiesAllowed)) ||
    userHasAllowedCookies === 'unset'
  ) {
    cookieBanner?.removeAttribute('hidden')
    cookiesAcceptOrRejectMessage?.removeAttribute('hidden')
  }
}

/**
 * Returns the highest level CH domain possible based on the Public Suffix List (https://publicsuffix.org/).
 */
function setDomain (): string {
  const hostname = window.location.hostname

  const hostnameParts = hostname.split('.')

  if (hostnameParts.length <= 2) {
    return hostname
  }

  const strippedHostname = `.${hostnameParts.slice(1, hostnameParts.length).join('.')}`

  for (const publicSuffixUrl of PUBLIC_SUFFIX_URLS) {
    if (strippedHostname === publicSuffixUrl) {
      return hostname
    }
  }

  return strippedHostname
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
