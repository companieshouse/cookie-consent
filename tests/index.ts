// Inspired by https://github.com/modosc/global-jsdom/blob/master/esm/index.mjs
import { JSDOM } from 'jsdom'

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

const KEYS: any[] = []

export function defaultJSDOM (html = defaultHTML, options = { url: defaultURL }): () => void {
  if (!('url' in options)) { Object.assign(options, { url: defaultURL }) }

  const jsdom = new JSDOM(html, options)
  const { window } = jsdom
  const { document } = window

  if (KEYS.length === 0) {
    KEYS.push(...Object.getOwnPropertyNames(window).filter((k) => !k.startsWith('_')).filter((k) => !(k in global)))
    KEYS.push('$jsdom')
  }

  // @ts-expect-error
  KEYS.forEach((key) => { global[key] = window[key] })

  global.document = document
  // @ts-expect-error
  global.window = window
  window.console = global.console

  // @ts-expect-error
  // eslint-disable-next-line
  return (): void => { KEYS.forEach((key) => delete global[key]) }
}
