import { spy, stub } from 'sinon'
import { use, expect } from 'chai'
import { createJSDOM } from '../test-utilities'
import { acceptCookies } from '../../src'
import { COOKIES, COOKIE_NAME } from '../../src/constants'
import dirtyChai = require('dirty-chai')
import sinonChai = require('sinon-chai')
import chaiDom = require ('chai-dom')

use(dirtyChai)
use(sinonChai)
use(chaiDom)

const cleanup = createJSDOM()

const defaultAcceptedCookie = `${COOKIE_NAME}={"userHasAllowedCookies":"yes","cookiesAllowed":${JSON.stringify(COOKIES)}}`

describe('Accept Cookies tests', () => {
  afterEach(cleanup)

  it('should create a cookie and unhide the cookies accepted message', () => {
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

    acceptCookies(callback)

    const mockAcceptOrRejectMessage = document.getElementById('accept-or-reject-message')
    const mockCookiesAcceptedMessage = document.getElementById('accepted-cookies-message')

    expect(document.cookie).to.equal(defaultAcceptedCookie)
    expect(mockAcceptOrRejectMessage).to.have.attribute('hidden')
    expect(mockCookiesAcceptedMessage).to.not.have.attribute('hidden')
  })

  it('should not error and still set a cookie if the dom is improperly formatted', () => {
    const html = `
    <html lang="en">
      <body>
      </body>
    </html>`
    createJSDOM(html)
    const callback = spy()

    acceptCookies(callback)

    expect(document.cookie).to.equal(defaultAcceptedCookie)
  })

  it('should set a cookie, hide the accept or reject message, show the accepted message and log an error if the callback throws', () => {
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
    acceptCookies(badCallback)

    const mockAcceptOrRejectMessage = document.getElementById('accept-or-reject-message')
    const mockCookiesAcceptedMessage = document.getElementById('accepted-cookies-message')

    expect(document.cookie).to.equal(defaultAcceptedCookie)
    expect(consoleSpy).to.have.been.called()
    expect(mockAcceptOrRejectMessage).to.have.attribute('hidden')
    expect(mockCookiesAcceptedMessage).to.not.have.attribute('hidden')
  })
})
