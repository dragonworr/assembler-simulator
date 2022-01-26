import { MEMORY_SIZE } from '@/features/memory/core'
import { decToHex, chunk } from '@/common/utils'

const SEPARATOR = ', '

const isArrayOf =
  <T = unknown>(...types: string[]) =>
  (val: unknown): val is T[] =>
    Array.isArray(val) && val.every(el => types.includes(typeof el))

export const shortArraySerializer: jest.SnapshotSerializerPlugin = {
  test: val => isArrayOf('number', 'boolean')(val) && val.length <= 4,
  serialize: (val: Array<number | boolean>) =>
    `Array [${val.join(SEPARATOR)}${val.length > 0 ? ',' : ''}]`
}

export const memorySerializer: jest.SnapshotSerializerPlugin = {
  test: val => isArrayOf('number', 'string')(val) && val.length === MEMORY_SIZE,
  serialize: (val: Array<number | string>, _config, indentation) => `Array [
${chunk(0x10, val)
  .map(
    row =>
      `${indentation}${' '.repeat(2)}${row
        .map(value => (typeof value === 'number' ? decToHex(value) : value))
        .join(SEPARATOR)}`
  )
  .join(',\n')},
${indentation}]`
}
