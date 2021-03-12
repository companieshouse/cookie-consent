import { expect, use } from 'chai'
import { CookieJar } from 'jsdom'
import { spy, stub } from 'sinon'
import { start } from '../../src/cookie-management'
import { base64Encode, createJSDOM, defaultAcceptedCookie, defaultHTML, defaultRejectedCookie, defaultURL } from '../test-utilities'
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
  it('should show the cookie banner, accept or reject message, and not call the start callback if the user has not made a choice yet', () => {
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

  it('should show the cookie banner, accept or reject message, and not call the start callback if new cookies have been added', () => {
    const cookie: CHCookie = {
      userHasAllowedCookies: 'yes',
      cookiesAllowed: [...COOKIES, 'newCookie']
    }
    const cookieJar = new CookieJar()
    cookieJar.setCookie(`${COOKIE_NAME}=${base64Encode(JSON.stringify(cookie))}`, defaultURL, (x) => console.log)
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
    expect(mockAcceptOrRejectMessage).to.not.have.attribute('hidden')
    expect(mockCookieBanner).to.not.have.attribute('hidden')
    expect(mockCookiesAcceptedMessage).to.have.attribute('hidden')
    expect(mockCookiesRejectedMessage).to.have.attribute('hidden')
  })

  it('should call the start callback if the user has allowed cookies but not show any dom elements', () => {
    const cookieJar = new CookieJar()
    cookieJar.setCookie(defaultAcceptedCookie, defaultURL, (x) => console.log)
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

  it('should call the start callback, but not the stop callback, if the user has allowed cookies and passed in the optional stop callback but not show any dom elements', () => {
    const cookieJar = new CookieJar()
    cookieJar.setCookie(defaultAcceptedCookie, defaultURL, (x) => console.log)
    createJSDOM(defaultHTML, {
      url: defaultURL,
      cookieJar
    })

    const mockAcceptOrRejectMessage = document.getElementById('accept-or-reject-message')
    const mockCookieBanner = document.getElementById('cookie-banner')
    const mockCookiesAcceptedMessage = document.getElementById('accepted-cookies-message')
    const mockCookiesRejectedMessage = document.getElementById('rejected-cookies-message')

    const startCallback = spy()
    const stopCallback = spy()

    start(startCallback)

    expect(startCallback).to.have.been.called()
    expect(stopCallback).not.to.have.been.called()
    expect(mockAcceptOrRejectMessage).to.have.attribute('hidden')
    expect(mockCookieBanner).to.have.attribute('hidden')
    expect(mockCookiesAcceptedMessage).to.have.attribute('hidden')
    expect(mockCookiesRejectedMessage).to.have.attribute('hidden')
  })

  it('should not call the start callback, or show any DOM elements if the user has rejected cookies and not passed in a reject callback', () => {
    const cookieJar = new CookieJar()
    cookieJar.setCookie(defaultRejectedCookie, defaultURL, (x) => console.log)
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

  it('should not call the start callback, not show any DOM elements and call the stop callback if the user has rejected cookies and passed in a stop callback', () => {
    const cookieJar = new CookieJar()
    cookieJar.setCookie(defaultRejectedCookie, defaultURL, (x) => console.log)
    createJSDOM(defaultHTML, {
      url: defaultURL,
      cookieJar
    })

    const mockAcceptOrRejectMessage = document.getElementById('accept-or-reject-message')
    const mockCookieBanner = document.getElementById('cookie-banner')
    const mockCookiesAcceptedMessage = document.getElementById('accepted-cookies-message')
    const mockCookiesRejectedMessage = document.getElementById('rejected-cookies-message')

    const startCallback = spy()
    const stopCallback = spy()

    start(startCallback, stopCallback)

    expect(startCallback).to.not.have.been.called()
    expect(stopCallback).to.have.been.called()
    expect(mockAcceptOrRejectMessage).to.have.attribute('hidden')
    expect(mockCookieBanner).to.have.attribute('hidden')
    expect(mockCookiesAcceptedMessage).to.have.attribute('hidden')
    expect(mockCookiesRejectedMessage).to.have.attribute('hidden')
  })

  it('should log an error if the start callback throws and not show any dom elements', () => {
    const cookieJar = new CookieJar()
    cookieJar.setCookie(defaultAcceptedCookie, defaultURL, (x) => console.log)

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

it('should log an error if the stop callback throws and not show any dom elements', () => {
  const cookieJar = new CookieJar()
  cookieJar.setCookie(defaultRejectedCookie, defaultURL, (x) => console.log)

  createJSDOM(defaultHTML, {
    url: defaultURL,
    cookieJar
  })

  const mockAcceptOrRejectMessage = document.getElementById('accept-or-reject-message')
  const mockCookieBanner = document.getElementById('cookie-banner')
  const mockCookiesAcceptedMessage = document.getElementById('accepted-cookies-message')
  const mockCookiesRejectedMessage = document.getElementById('rejected-cookies-message')

  const consoleSpy = spy()
  const startCallback = spy()
  const stopCallback = stub().throws()
  global.window.console.error = consoleSpy

  start(startCallback, stopCallback)

  expect(startCallback).not.to.have.been.called()
  expect(stopCallback).to.have.been.called()
  expect(consoleSpy).to.have.been.called()
  expect(mockAcceptOrRejectMessage).to.have.attribute('hidden')
  expect(mockCookieBanner).to.have.attribute('hidden')
  expect(mockCookiesAcceptedMessage).to.have.attribute('hidden')
  expect(mockCookiesRejectedMessage).to.have.attribute('hidden')
})
