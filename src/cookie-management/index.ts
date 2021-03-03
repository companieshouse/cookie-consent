import {
  ACCEPTED_COOKIE,
  COOKIES,
  COOKIE_NAME,
  REJECTED_COOKIE
} from '../constants'
import { CHCookie } from '../types'
import { getDomElements } from '../utilities/dom'
import { setDomain } from '../utilities/domains'

/**
 * Creates the Companies House cookie tracking cookie
 * @param value
 */
export function createCookie (value: CHCookie): void {
  const days = 365
  const date = new Date()
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
  const expiryDate = date.toUTCString()
  const cookieValue = JSON.stringify(value)
  const base64CookieValue = btoa(cookieValue)
  document.cookie = COOKIE_NAME + '=' + base64CookieValue + '; expires=' + expiryDate + '; path=/; domain=' + setDomain()
}

/**
 * Handles the logic when Cookies are accepted
 * @param callback
 */
export function acceptCookies (callback: () => void): void {
  const { acceptOrRejectMessage, cookiesAcceptedMessage } = getDomElements()

  createCookie(ACCEPTED_COOKIE)

  if (acceptOrRejectMessage !== null) {
    acceptOrRejectMessage.hidden = true
  }
  if (cookiesAcceptedMessage !== null) {
    cookiesAcceptedMessage.removeAttribute('hidden')
  }

  try {
    callback()
  } catch (e) {
    console.error(e)
  }
}

/**
 * Handles the logic when Cookies are rejected
 */
export function rejectCookies (callback: () => void): void {
  try {
    callback()
  } catch (e) {
    console.error(e)
  }

  const { acceptOrRejectMessage, cookiesRejectedMessage } = getDomElements()

  createCookie(REJECTED_COOKIE)

  if (acceptOrRejectMessage !== null) {
    acceptOrRejectMessage.hidden = true
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
      const decodedCookieValue = atob(cookieTuple[1])
      return JSON.parse(decodedCookieValue) as CHCookie
    }
  }

  const cookie: CHCookie = {
    userHasAllowedCookies: 'unset',
    cookiesAllowed: []
  }

  return cookie
}

/**
 * Start function which is called from the page, accepts a callback to initiate the analytics payload(s)
 * @param callback
 */
export function start (callback: () => void): void {
  const { acceptOrRejectMessage, cookieBanner } = getDomElements()
  const { userHasAllowedCookies, cookiesAllowed } = getCookieObject()

  if (userHasAllowedCookies === 'yes' && haveAllCookiesBeenAccepted(cookiesAllowed)) {
    try {
      callback()
    } catch (e) {
      console.error(e)
    }
  } else if (
    (userHasAllowedCookies === 'yes' && !haveAllCookiesBeenAccepted(cookiesAllowed)) ||
    userHasAllowedCookies === 'unset'
  ) {
    cookieBanner?.removeAttribute('hidden')
    acceptOrRejectMessage?.removeAttribute('hidden')
  }
}

/**
 * Checks the array of cookies a user consented to on their last visit
 * @param cookieArray
 */
export function haveAllCookiesBeenAccepted (cookieArray: string[]): boolean {
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
