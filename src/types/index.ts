export interface CHCookie {
  userHasAllowedCookies: 'yes' | 'no' | 'unset'
  cookiesAllowed: string[]
}

type DOMElement = HTMLElement | null

export interface CookieConsentDOMElements {
  acceptOrRejectMessage: DOMElement
  cookieBanner: DOMElement
  cookiesAcceptedMessage: DOMElement
  cookiesRejectedMessage: DOMElement
}
