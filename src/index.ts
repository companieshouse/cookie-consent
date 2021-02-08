import { checkCookieIsSet } from './utilities'

if (checkCookieIsSet() === 'yes') {
  const cookieBanner = document.getElementById('cookie-banner')
  if (cookieBanner?.style.display === 'none') {
    cookieBanner.style.display = 'block'
  } else if (cookieBanner != null) {
    cookieBanner.style.display = 'none'
  }
}

export { acceptCookies } from './utilities'
export { rejectCookies } from './utilities'
