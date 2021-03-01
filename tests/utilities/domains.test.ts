import { expect } from 'chai'
import { defaultJSDOM } from '../index'
import { setDomain } from '../../src/utilities/domains'

function setHostname (hostname: string): void {
  global.window = Object.create(window)
  Object.defineProperty(window, 'location', {
    value: {
      hostname: hostname
    },
    writable: true
  })
}

describe('setDomain tests', () => {
  before(() => {
    defaultJSDOM()
  })

  after(() => {
    const cleanup = defaultJSDOM()
    cleanup()
  })

  it('should return the full hostname if the length is less than or equal to 2', () => {
    const mockHostname = 'foo.bar'
    setHostname(mockHostname)
    const domain = setDomain()
    expect(domain).to.equal(mockHostname)
  })

  it('should return the hostname without the first section if the length is greater than 2', () => {
    setHostname('foo.bar.baz')
    const twoLengthDomain = setDomain()
    expect(twoLengthDomain).to.equal('.bar.baz')

    setHostname('foo.bar.baz.foobar')
    const threeLengthDomain = setDomain()
    expect(threeLengthDomain).to.equal('.bar.baz.foobar')
  })

  it('should return the full hostname if truncating the hostname by one matches a public suffix url', () => {
    const mockLowercaseHostname = 'foo.service.gov.uk'
    setHostname(mockLowercaseHostname)
    const firstTestDomain = setDomain()
    expect(firstTestDomain).to.equal(mockLowercaseHostname)
  })

  it('should return the correct hostname no matter what case is used', () => {
    const mockLowercaseHostname = 'foo.bar.baz'
    setHostname(mockLowercaseHostname)
    const firstTestDomain = setDomain()
    expect(firstTestDomain).to.equal('.bar.baz')

    const mockUppercaseHostname = 'FOO.GOV.UK'
    setHostname(mockUppercaseHostname)
    const secondTestDomain = setDomain()
    expect(secondTestDomain).to.equal(mockUppercaseHostname.toLowerCase())

    const mockRandomcaseHostname = 'FoO.sErviCe.gOV.Uk'
    setHostname(mockRandomcaseHostname)
    const thirdTestDomain = setDomain()
    expect(thirdTestDomain).to.equal(mockRandomcaseHostname.toLowerCase())
  })
})
