import { COOKIES } from '../constants'

/**
 * Checks the array of cookies a user consented to on their last visit
 * @param cookieArray
 */
export function haveAllCookiesBeenAccepted (cookieArray: string[]): boolean {
  if (cookieArray.length !== COOKIES.length) {
    return false
  }

  for (let i = 0; i < COOKIES.length; i++) {
    if (COOKIES[i] !== cookieArray[i]) {
      return false
    }
  }

  return true
}
