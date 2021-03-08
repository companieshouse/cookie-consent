import { REJECTED_COOKIE } from '../constants'
import { getDomElements, hideCookieBanners } from '../utilities/dom'
import { createCookie } from './createCookie'

/**
 * Handles the logic when Cookies are rejected
 * @param callback
 * @param mode
 */
export function rejectCookies (callback: () => void, mode: 'full-journey' | 'reject-only' = 'full-journey'): void {
  try {
    callback()
  } catch (e) {
    console.error(e)
  }

  const { acceptOrRejectMessage, cookiesRejectedMessage } = getDomElements()

  createCookie(REJECTED_COOKIE)

  if (mode === 'reject-only') {
    hideCookieBanners()
  } else if (mode === 'full-journey') {
    if (acceptOrRejectMessage !== null) {
      acceptOrRejectMessage.hidden = true
    }
    if (cookiesRejectedMessage !== null) {
      cookiesRejectedMessage.removeAttribute('hidden')
    }
  } else {
    console.error('Please choose an appropriate mode from: "full-journey" or "reject-only"')
  }
}
