import { exampleFunction } from '../src/examples'
import { expect } from 'chai'
import 'mocha'

describe('Example test - delete me',
  () => {
    it('should return true', () => {
      const result = exampleFunction()
      expect(result).to.equal(true)
    })
  }
)
