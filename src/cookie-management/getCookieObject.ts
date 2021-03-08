import { COOKIE_NAME } from '../constants'
import { CHCookie } from '../types'

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
