import { COOKIE_NAME } from '../constants'
import { CHCookie } from '../types'
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
