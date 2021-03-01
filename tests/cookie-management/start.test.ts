import { JSDOM, CookieJar } from 'jsdom'
import { spy } from 'sinon'
import { start } from '../../src/cookie-management'
import { expect, use } from 'chai'
import { CHCookie } from '../../src/types'
import { COOKIES, COOKIE_NAME } from '../../src/constants'
import chaiDom = require('chai-dom')
import dirtyChai = require('dirty-chai')
import sinonChai = require('sinon-chai')

use(chaiDom)
use(dirtyChai)
use(sinonChai)

const HTML = `
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

const URL = 'http://cookies.companieshouse.gov.uk'

describe('Start function tests', () => {
  it('should show the cookie banner, accept or reject message, and not call the callback if the user has not made a choice yet', () => {
    const dom = new JSDOM(HTML)
    // @ts-expect-error
    global.window = dom?.window
    global.document = dom?.window?.document

    const mockAcceptOrRejectMessage = document.getElementById('accept-or-reject-message')
    const mockCookieBanner = document.getElementById('cookie-banner')
    const mockCookiesAcceptedMessage = document.getElementById('accepted-cookies-message')
    const mockCookiesRejectedMessage = document.getElementById('rejected-cookies-message')

    const callback = spy()

    start(callback)

    expect(callback).to.not.have.been.called()
    expect(mockAcceptOrRejectMessage).to.not.have.attribute('hidden')
    expect(mockCookieBanner).to.not.have.attribute('hidden')
    expect(mockCookiesAcceptedMessage).to.have.attribute('hidden')
    expect(mockCookiesRejectedMessage).to.have.attribute('hidden')
  })

  it('Should call the callback if the user has allowed cookies', () => {
    const cookie: CHCookie = {
      userHasAllowedCookies: 'yes',
      cookiesAllowed: COOKIES
    }

    const cookieJar = new CookieJar()
    cookieJar.setCookie(`${COOKIE_NAME}=${JSON.stringify(cookie)}`, URL, (x) => console.log)
    const dom = new JSDOM(HTML, {
      url: URL,
      cookieJar
    })

    // @ts-expect-error
    global.window = dom?.window
    global.document = dom?.window?.document

    const mockAcceptOrRejectMessage = document.getElementById('accept-or-reject-message')
    const mockCookieBanner = document.getElementById('cookie-banner')
    const mockCookiesAcceptedMessage = document.getElementById('accepted-cookies-message')
    const mockCookiesRejectedMessage = document.getElementById('rejected-cookies-message')

    const callback = spy()

    start(callback)

    expect(callback).to.have.been.called()
    expect(mockAcceptOrRejectMessage).to.have.attribute('hidden')
    expect(mockCookieBanner).to.have.attribute('hidden')
    expect(mockCookiesAcceptedMessage).to.have.attribute('hidden')
    expect(mockCookiesRejectedMessage).to.have.attribute('hidden')
  })

  it('Should not call the callback, or show any DOM elements if the user has rejected cookies', () => {
    const cookie: CHCookie = {
      userHasAllowedCookies: 'no',
      cookiesAllowed: []
    }

    const cookieJar = new CookieJar()
    cookieJar.setCookie(`${COOKIE_NAME}=${JSON.stringify(cookie)}`, URL, (x) => console.log)
    const dom = new JSDOM(HTML, {
      url: URL,
      cookieJar
    })

    // @ts-expect-error
    global.window = dom?.window
    global.document = dom?.window?.document

    const mockAcceptOrRejectMessage = document.getElementById('accept-or-reject-message')
    const mockCookieBanner = document.getElementById('cookie-banner')
    const mockCookiesAcceptedMessage = document.getElementById('accepted-cookies-message')
    const mockCookiesRejectedMessage = document.getElementById('rejected-cookies-message')

    const callback = spy()

    start(callback)

    expect(callback).to.not.have.been.called()
    expect(mockAcceptOrRejectMessage).to.have.attribute('hidden')
    expect(mockCookieBanner).to.have.attribute('hidden')
    expect(mockCookiesAcceptedMessage).to.have.attribute('hidden')
    expect(mockCookiesRejectedMessage).to.have.attribute('hidden')
  })
})
