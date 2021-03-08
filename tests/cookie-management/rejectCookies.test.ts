import { spy, stub } from 'sinon'
import { use, expect } from 'chai'
import { createJSDOM, defaultRejectedCookie } from '../test-utilities'
import { rejectCookies } from '../../src'
import dirtyChai = require('dirty-chai')
import sinonChai = require('sinon-chai')
import chaiDom = require ('chai-dom')

use(dirtyChai)
use(sinonChai)
use(chaiDom)

const cleanup = createJSDOM()

describe('Reject Cookies tests', () => {
  afterEach(cleanup)

  it('should create a cookie and unhide the cookies rejected message', () => {
    const html = `
    <html lang="en">
      <body>
        <div id="cookie-banner">
          <div id="accept-or-reject-message"></div>
          <div id="accepted-cookies-message" hidden></div>
          <div id="rejected-cookies-message" hidden></div>
        </div>
      </body>
    </html>`
    createJSDOM(html)
    const callback = spy()

    rejectCookies(callback)

    const mockAcceptOrRejectMessage = document.getElementById('accept-or-reject-message')
    const mockCookiesRejectedMessage = document.getElementById('rejected-cookies-message')

    expect(document.cookie).to.equal(defaultRejectedCookie)
    expect(mockAcceptOrRejectMessage).to.have.attribute('hidden')
    expect(mockCookiesRejectedMessage).to.not.have.attribute('hidden')
  })

  it('should not error and still set a cookie if the dom is improperly formatted', () => {
    const html = `
    <html lang="en">
      <body>
      </body>
    </html>`
    createJSDOM(html)
    const callback = spy()

    rejectCookies(callback)

    expect(document.cookie).to.equal(defaultRejectedCookie)
  })

  it('should create a cookie and hide all banners when using reject-only mode', () => {
    const html = `
    <html lang="en">
      <body>
        <div id="cookie-banner">
          <div id="accept-or-reject-message"></div>
          <div id="accepted-cookies-message" hidden></div>
          <div id="rejected-cookies-message" hidden></div>
        </div>
      </body>
    </html>`
    createJSDOM(html)
    const callback = spy()

    rejectCookies(callback, 'reject-only')

    const mockAcceptOrRejectMessage = document.getElementById('accept-or-reject-message')
    const mockCookieBanner = document.getElementById('cookie-banner')
    const mockCookiesAcceptedMessage = document.getElementById('accepted-cookies-message')
    const mockCookiesRejectedMessage = document.getElementById('rejected-cookies-message')

    expect(mockAcceptOrRejectMessage).to.have.attribute('hidden')
    expect(mockCookieBanner).to.have.attribute('hidden')
    expect(mockCookiesAcceptedMessage).to.have.attribute('hidden')
    expect(mockCookiesRejectedMessage).to.have.attribute('hidden')
    expect(document.cookie).to.equal(defaultRejectedCookie)
  })

  it('should create a cookie and log an error if an incorrect mode is passed in', () => {
    const html = `
    <html lang="en">
      <body>
        <div id="cookie-banner">
          <div id="accept-or-reject-message"></div>
          <div id="accepted-cookies-message" hidden></div>
          <div id="rejected-cookies-message" hidden></div>
        </div>
      </body>
    </html>`
    createJSDOM(html)
    const consoleSpy = spy()
    window.console.error = consoleSpy
    const callback = spy()

    // @ts-expect-error
    rejectCookies(callback, 'error-mode')

    const mockAcceptOrRejectMessage = document.getElementById('accept-or-reject-message')
    const mockCookieBanner = document.getElementById('cookie-banner')
    const mockCookiesAcceptedMessage = document.getElementById('accepted-cookies-message')
    const mockCookiesRejectedMessage = document.getElementById('rejected-cookies-message')

    expect(mockAcceptOrRejectMessage).not.to.have.attribute('hidden')
    expect(mockCookieBanner).not.to.have.attribute('hidden')
    expect(mockCookiesAcceptedMessage).to.have.attribute('hidden')
    expect(mockCookiesRejectedMessage).to.have.attribute('hidden')
    expect(consoleSpy).to.have.been.called()
    expect(document.cookie).to.equal(defaultRejectedCookie)
  })

  it('should set a cookie, hide the accept or reject message, show the rejected message and log an error if the callback throws', () => {
    const html = `
    <html lang="en">
      <body>
        <div id="cookie-banner">
          <div id="accept-or-reject-message"></div>
          <div id="accepted-cookies-message" hidden></div>
          <div id="rejected-cookies-message" hidden></div>
        </div>
      </body>
    </html>`
    createJSDOM(html)

    const consoleSpy = spy()
    const badCallback = stub().throws()
    window.console.error = consoleSpy
    rejectCookies(badCallback)

    const mockAcceptOrRejectMessage = document.getElementById('accept-or-reject-message')
    const mockCookiesRejectedMessage = document.getElementById('rejected-cookies-message')

    expect(document.cookie).to.equal(defaultRejectedCookie)
    expect(consoleSpy).to.have.been.called()
    expect(mockAcceptOrRejectMessage).to.have.attribute('hidden')
    expect(mockCookiesRejectedMessage).to.not.have.attribute('hidden')
  })
})
