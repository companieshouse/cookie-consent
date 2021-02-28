import {
  PUBLIC_SUFFIX_URLS
} from '../constants'

/**
 * Returns the highest level CH domain possible based on the Public Suffix List (https://publicsuffix.org/).
 */
export function setDomain (): string {
  const hostname = window.location.hostname.toLowerCase()

  const hostnameParts = hostname.split('.')

  if (hostnameParts.length <= 2) {
    return hostname
  }

  const strippedHostname = `.${hostnameParts.slice(1, hostnameParts.length).join('.')}`

  for (const publicSuffixUrl of PUBLIC_SUFFIX_URLS) {
    if (strippedHostname === publicSuffixUrl) {
      return hostname
    }
  }
  return strippedHostname
}
