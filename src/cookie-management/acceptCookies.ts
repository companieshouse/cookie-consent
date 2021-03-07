import { createCookie } from './createCookie'
import { getDomElements, hideCookieBanners } from '../utilities/dom'
import { ACCEPTED_COOKIE } from '../constants'

/**
 * Handles the logic when Cookies are accepted
 * @param callback
 * @param mode
 */
export function acceptCookies (callback: () => void, mode: 'accept-only' | 'full-journey' = 'full-journey'): void {
  const { acceptOrRejectMessage, cookiesAcceptedMessage } = getDomElements()

  createCookie(ACCEPTED_COOKIE)

  if (mode === 'accept-only') {
    hideCookieBanners()
  } else if (mode === 'full-journey') {
    if (acceptOrRejectMessage !== null) {
      acceptOrRejectMessage.hidden = true
    }
    if (cookiesAcceptedMessage !== null) {
      cookiesAcceptedMessage.removeAttribute('hidden')
    }
  } else {
    console.error('Please choose an appropriate mode from: "accept-only" or "full-journey"')
  }

  try {
    callback()
  } catch (e) {
    console.error(e)
  }
}
