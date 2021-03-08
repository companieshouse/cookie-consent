import { getDomElements } from '../utilities/dom'
import { getCookieObject } from './getCookieObject'
import { haveAllCookiesBeenAccepted } from './haveAllCookiesBeenAccepted'

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
