import {
  getDomElements,
  hideCookieBanners
} from '../../src/utilities/dom'
import { JSDOM } from 'jsdom'
import { expect, use } from 'chai'
import chaiDom = require('chai-dom')

use(chaiDom)

describe('Get DOM Element tests', () => {
  it('should return an object of DOM elements when all DOM elements are present', () => {
    const dom = new JSDOM(`
      <html lang="en">
        <body>
          <div id="cookie-banner" hidden>
            <div id="accept-or-reject-message" hidden></div>
            <div id="accepted-cookies-message" hidden></div>
            <div id="rejected-cookies-message" hidden></div>
          </div>
        </body>
      </html>
    `)
    // @ts-expect-error
    global.window = dom?.window
    global.document = dom?.window?.document

    const mockAcceptOrRejectMessage = document.getElementById('accept-or-reject-message')
    const mockCookieBanner = document.getElementById('cookie-banner')
    const mockCookiesAcceptedMessage = document.getElementById('accepted-cookies-message')
    const mockCookiesRejectedMessage = document.getElementById('rejected-cookies-message')

    const {
      acceptOrRejectMessage,
      cookieBanner,
      cookiesAcceptedMessage,
      cookiesRejectedMessage
    } = getDomElements()

    expect(acceptOrRejectMessage).to.equal(mockAcceptOrRejectMessage)
    expect(cookieBanner).to.equal(mockCookieBanner)
    expect(cookiesAcceptedMessage).to.equal(mockCookiesAcceptedMessage)
    expect(cookiesRejectedMessage).to.equal(mockCookiesRejectedMessage)
  })

  it('should return an object of null values when no DOM elements are present', () => {
    const dom = new JSDOM(`
      <html lang="en">
        <body>
        </body>
      </html>
    `)
    // @ts-expect-error
    global.window = dom?.window
    global.document = dom?.window?.document

    const {
      acceptOrRejectMessage,
      cookieBanner,
      cookiesAcceptedMessage,
      cookiesRejectedMessage
    } = getDomElements()

    expect(acceptOrRejectMessage).to.equal(null)
    expect(cookieBanner).to.equal(null)
    expect(cookiesAcceptedMessage).to.equal(null)
    expect(cookiesRejectedMessage).to.equal(null)
  })

  it('should return a mixture of null and DOM elements when some elements are present', () => {
    const dom = new JSDOM(`
      <html lang="en">
        <body>
          <div id="cookie-banner" hidden>
            <div id="accept-or-reject-message" hidden></div>
          </div>
        </body>
      </html>
    `)
    // @ts-expect-error
    global.window = dom?.window
    global.document = dom?.window?.document

    const mockAcceptOrRejectMessage = document.getElementById('accept-or-reject-message')
    const mockCookieBanner = document.getElementById('cookie-banner')

    const {
      acceptOrRejectMessage,
      cookieBanner,
      cookiesAcceptedMessage,
      cookiesRejectedMessage
    } = getDomElements()

    expect(acceptOrRejectMessage).to.equal(mockAcceptOrRejectMessage)
    expect(cookieBanner).to.equal(mockCookieBanner)
    expect(cookiesAcceptedMessage).to.equal(null)
    expect(cookiesRejectedMessage).to.equal(null)
  })
})

describe('Hide Cookie Banner test', () => {
  it('should set a hide the cookie banner and accepted message if they are visible', () => {
    const dom = new JSDOM(`
      <html lang="en">
        <body>
          <div id="cookie-banner">
            <div id="accept-or-reject-message" hidden></div>
            <div id="accepted-cookies-message"></div>
            <div id="rejected-cookies-message" hidden></div>
          </div>
        </body>
      </html>
    `)
    // @ts-expect-error
    global.window = dom?.window
    global.document = dom?.window?.document

    hideCookieBanners()

    const mockCookieBanner = document.getElementById('cookie-banner')
    const mockCookiesAcceptedMessage = document.getElementById('accepted-cookies-message')

    expect(mockCookieBanner).to.have.attribute('hidden')
    expect(mockCookiesAcceptedMessage).to.have.attribute('hidden')
  })

  it('should set a hide the cookie banner and rejected message if they are visible', () => {
    const dom = new JSDOM(`
      <html lang="en">
        <body>
          <div id="cookie-banner">
            <div id="accept-or-reject-message" hidden></div>
            <div id="accepted-cookies-message" hidden></div>
            <div id="rejected-cookies-message"></div>
          </div>
        </body>
      </html>
    `)
    // @ts-expect-error
    global.window = dom?.window
    global.document = dom?.window?.document

    hideCookieBanners()

    const mockCookieBanner = document.getElementById('cookie-banner')
    const mockCookiesRejectedMessage = document.getElementById('rejected-cookies-message')

    expect(mockCookieBanner).to.have.attribute('hidden')
    expect(mockCookiesRejectedMessage).to.have.attribute('hidden')
  })
})
