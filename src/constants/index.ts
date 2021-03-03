import { CHCookie } from '../types'

export const COOKIE_NAME = 'ch_cookie_consent'
export const COOKIES = ['piwik', 'google']
export const PUBLIC_SUFFIX_URLS = ['.service.gov.uk', '.gov.uk']
export const ACCEPTED_COOKIE: CHCookie = {
  userHasAllowedCookies: 'yes',
  cookiesAllowed: COOKIES
}
export const REJECTED_COOKIE: CHCookie = {
  userHasAllowedCookies: 'no',
  cookiesAllowed: []
}
