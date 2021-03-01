// Inspired by https://github.com/modosc/global-jsdom/blob/master/esm/index.mjs
import { ConstructorOptions, JSDOM } from 'jsdom'

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
