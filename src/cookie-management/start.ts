import { getDomElements } from '../utilities/dom'
import { getCookieObject } from './getCookieObject'
import { haveAllCookiesBeenAccepted } from './haveAllCookiesBeenAccepted'

/**
 * Start function which is called from the page, accepts a callback to initiate the analytics payload(s) and an optional callback to clean up analytics
 * @param callback
 */
export function start (startCallback: () => void, stopCallback?: () => void): void {
  const { acceptOrRejectMessage, cookieBanner } = getDomElements()
  const { userHasAllowedCookies, cookiesAllowed } = getCookieObject()

  const acceptedAnalytics = userHasAllowedCookies === 'yes' && haveAllCookiesBeenAccepted(cookiesAllowed)
  const showCookieBanner = (userHasAllowedCookies === 'yes' && !haveAllCookiesBeenAccepted(cookiesAllowed)) || userHasAllowedCookies === 'unset'
  const rejectedAnalytics = userHasAllowedCookies === 'no'

  if (acceptedAnalytics) {
    try {
      startCallback()
    } catch (e) {
      console.error(e)
    }
  } else if (showCookieBanner) {
    cookieBanner?.removeAttribute('hidden')
    acceptOrRejectMessage?.removeAttribute('hidden')
  } else if (rejectedAnalytics) {
    if (typeof stopCallback === 'function') {
      try {
        stopCallback()
      } catch (e) {
        console.error(e)
      }
    }
  }
}
