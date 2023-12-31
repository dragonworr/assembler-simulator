import { just, nothing, maybeNullable } from '@/common/utils'

describe('Maybe', () => {
  describe('maybeNullable', () => {
    it('should create a Maybe with a value', () => {
      const result = maybeNullable(1)
      expect(result.extract()).toBe(1)
      expect(result.extractNullable()).toBe(1)
    })

    it('should create a Maybe with a nullable value', () => {
      const result = maybeNullable<number>(null)
      expect(result.extract()).toBe(undefined)
      expect(result.extractNullable()).toBe(null)
    })
  })

  describe('just', () => {
    it('should create a Maybe with a value', () => {
      const result = just(1)
      expect(result.isJust()).toBeTruthy()
      expect(result.isNothing()).toBeFalsy()
    })
  })

  describe('nothing', () => {
    it('should create a Maybe with a nullable value', () => {
      const result = nothing<number>()
      expect(result.isJust()).toBeFalsy()
      expect(result.isNothing()).toBeTruthy()
    })
  })

  describe('map', () => {
    it('should map a value', () => {
      const result = maybeNullable(1).map(x => x + 1)
      expect(result.extract()).toBe(2)
    })

    it('should map a nullable value', () => {
      const result = maybeNullable<number>(null).map(x => x + 1)
      expect(result.extract()).toBe(undefined)
    })
  })

  describe('chain', () => {
    it('should chain a value', () => {
      const result = maybeNullable(1).chain(x => just(x + 1))
      expect(result.extract()).toBe(2)
    })

    it('should chain a nullable value', () => {
      const result = maybeNullable<number>(null).chain(x => just(x + 1))
      expect(result.extract()).toBe(undefined)
    })
  })

  describe('orDefault', () => {
    it('should return a value', () => {
      const result = maybeNullable(1).orDefault(2)
      expect(result).toBe(1)
    })

    it('should return a default value', () => {
      const result = maybeNullable<number>(null).orDefault(2)
      expect(result).toBe(2)
    })
  })
})
