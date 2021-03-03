// Inspired by https://github.com/modosc/global-jsdom/blob/master/esm/index.mjs
import { ConstructorOptions, JSDOM } from 'jsdom'
import { ACCEPTED_COOKIE, COOKIE_NAME, REJECTED_COOKIE } from '../src/constants'

export const defaultHTML = `
<html lang="en">
  <body>
    <div id="cookie-banner" hidden>
      <div id="accept-or-reject-message" hidden></div>
      <div id="accepted-cookies-message" hidden></div>
      <div id="rejected-cookies-message" hidden></div>
    </div>
  </body>
</html>
`
export const defaultURL = 'http://cookies.companieshouse.gov.uk'

const KEYS: string[] = []

export function createJSDOM (html = defaultHTML, options: ConstructorOptions = { url: defaultURL }): () => void {
  const jsdom = new JSDOM(html, options)
  const { window } = jsdom
  const { document } = window

  if (KEYS.length === 0) {
    KEYS.push(...Object.getOwnPropertyNames(window).filter((k) => !k.startsWith('_')).filter((k) => !(k in global)))
  }

  for (const key of KEYS) {
    // @ts-expect-error
    global[key] = window[key]
  }

  global.document = document
  // @ts-expect-error
  global.window = window
  window.console = global.console

  return (): void => {
    for (const key of KEYS) {
      // @ts-expect-error
      // eslint-disable-next-line
      delete global[key]
    }
  }
}

// These are needed as btoa and atob are not available in node
export function base64Encode (value: string): string {
  return Buffer.from(value, 'binary').toString('base64')
}

export function base64Decode (value: string): string {
  return Buffer.from(value, 'base64').toString('binary')
}

const acceptedCookieJson = JSON.stringify(ACCEPTED_COOKIE)

export const defaultAcceptedCookie = `${COOKIE_NAME}=${base64Encode(acceptedCookieJson)}`

const rejectedCookieJson = JSON.stringify(REJECTED_COOKIE)

export const defaultRejectedCookie = `${COOKIE_NAME}=${base64Encode(rejectedCookieJson)}`
