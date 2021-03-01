import { expect } from 'chai'
import { createJSDOM, defaultHTML } from '../test-utilities'
import { setDomain } from '../../src/utilities/domains'

const cleanup = createJSDOM()

describe('setDomain tests', () => {
  afterEach(cleanup)

  it('should return the full hostname if the length is less than or equal to 2', () => {
    createJSDOM(defaultHTML, { url: 'http://foo.bar' })
    const domain = setDomain()
    expect(domain).to.equal('foo.bar')
  })

  it('should return the hostname without the first section if the length is greater than 2', () => {
    createJSDOM(defaultHTML, { url: 'http://foo.bar.baz' })
    const twoLengthDomain = setDomain()
    expect(twoLengthDomain).to.equal('.bar.baz')
  })

  it('should return the hostname without the first section if the length is greater than 3', () => {
    createJSDOM(defaultHTML, { url: 'http://foo.bar.baz.foobar' })
    const threeLengthDomain = setDomain()
    expect(threeLengthDomain).to.equal('.bar.baz.foobar')
  })

  it('should return the full hostname if truncating the hostname by one matches a public suffix url', () => {
    createJSDOM(defaultHTML, { url: 'http://foo.service.gov.uk' })
    const domain = setDomain()
    expect(domain).to.equal('foo.service.gov.uk')
  })

  it('should return the correct hostname if given a lowercase url', () => {
    createJSDOM(defaultHTML, { url: 'http://foo.bar.baz' })
    const domain = setDomain()
    expect(domain).to.equal('.bar.baz')
  })

  it('should return the correct hostname if given an uppercase url', () => {
    createJSDOM(defaultHTML, { url: 'http://FOO.GOV.UK' })
    const domain = setDomain()
    expect(domain).to.equal('foo.gov.uk')
  })

  it('should return the correct hostname if given a randomly cased url', () => {
    createJSDOM(defaultHTML, { url: 'http://FoO.sErviCe.gOV.Uk' })
    const domain = setDomain()
    expect(domain).to.equal('foo.service.gov.uk')
  })
})
