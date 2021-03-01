import { expect, use } from 'chai'
import { CookieJar } from 'jsdom'
import { spy, stub } from 'sinon'
import { start } from '../../src/cookie-management'
import { createJSDOM, defaultHTML, defaultURL } from '../test-utilities'
import { CHCookie } from '../../src/types'
import { COOKIES, COOKIE_NAME } from '../../src/constants'
import chaiDom = require('chai-dom')
import dirtyChai = require('dirty-chai')
import sinonChai = require('sinon-chai')

use(chaiDom)
use(dirtyChai)
use(sinonChai)

const cleanup = createJSDOM()

describe('Start function tests', () => {
  afterEach(cleanup)
  it('should show the cookie banner, accept or reject message, and not call the callback if the user has not made a choice yet', () => {
    createJSDOM()
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

  it('should call the callback if the user has allowed cookies but not show any dom elements', () => {
    const cookie: CHCookie = {
      userHasAllowedCookies: 'yes',
      cookiesAllowed: COOKIES
    }
    const cookieJar = new CookieJar()
    cookieJar.setCookie(`${COOKIE_NAME}=${JSON.stringify(cookie)}`, defaultURL, (x) => console.log)

    createJSDOM(defaultHTML, {
      url: defaultURL,
      cookieJar
    })

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

  it('should not call the callback, or show any DOM elements if the user has rejected cookies', () => {
    const cookie: CHCookie = {
      userHasAllowedCookies: 'no',
      cookiesAllowed: []
    }

    const cookieJar = new CookieJar()
    cookieJar.setCookie(`${COOKIE_NAME}=${JSON.stringify(cookie)}`, defaultURL, (x) => console.log)
    createJSDOM(defaultHTML, {
      url: defaultURL,
      cookieJar
    })

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

  it('should log an error if the callback throws and not show any dom elements', () => {
    const cookie: CHCookie = {
      userHasAllowedCookies: 'yes',
      cookiesAllowed: COOKIES
    }
    const cookieJar = new CookieJar()
    cookieJar.setCookie(`${COOKIE_NAME}=${JSON.stringify(cookie)}`, defaultURL, (x) => console.log)

    createJSDOM(defaultHTML, {
      url: defaultURL,
      cookieJar
    })

    const mockAcceptOrRejectMessage = document.getElementById('accept-or-reject-message')
    const mockCookieBanner = document.getElementById('cookie-banner')
    const mockCookiesAcceptedMessage = document.getElementById('accepted-cookies-message')
    const mockCookiesRejectedMessage = document.getElementById('rejected-cookies-message')

    const consoleSpy = spy()
    const callback = stub().throws()
    global.window.console.error = consoleSpy

    start(callback)

    expect(callback).to.have.been.called()
    expect(consoleSpy).to.have.been.called()
    expect(mockAcceptOrRejectMessage).to.have.attribute('hidden')
    expect(mockCookieBanner).to.have.attribute('hidden')
    expect(mockCookiesAcceptedMessage).to.have.attribute('hidden')
    expect(mockCookiesRejectedMessage).to.have.attribute('hidden')
  })
})
