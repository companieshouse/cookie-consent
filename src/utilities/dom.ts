import { CookieConsentDOMElements } from '../types'

/**
 * Utility method to get relevant DOM elements
 */
export function getDomElements (): CookieConsentDOMElements {
  return {
    acceptOrRejectMessage: document.getElementById('accept-or-reject-message'),
    cookieBanner: document.getElementById('cookie-banner'),
    cookiesAcceptedMessage: document.getElementById('accepted-cookies-message'),
    cookiesRejectedMessage: document.getElementById('rejected-cookies-message')
  }
}

/**
 * Hides the banner alert shown after cookie consent is accepted or rejected
 */
export function hideCookieBanners (): void {
  const {
    cookieBanner,
    cookiesAcceptedMessage,
    cookiesRejectedMessage
  } = getDomElements()

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
