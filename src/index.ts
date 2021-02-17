import { checkCookieIsSet } from './utilities'

if (checkCookieIsSet() === 'yes') {
  const cookieBanner = document.getElementById('cookie-banner')
  if (cookieBanner !== null) {
    cookieBanner.hidden = true
  }
}

export { acceptCookies } from './utilities'
export { rejectCookies } from './utilities'
export { hideBannerAlert } from './utilities'
