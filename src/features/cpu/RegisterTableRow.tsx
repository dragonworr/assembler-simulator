import { memo } from 'react'
import RegisterValueTableCell, { RadixLabel } from './RegisterValueTableCell'
import type { RegisterName } from './core'
import { sign8, decToBin, decToHex, classNames } from '@/common/utils'
import { NO_BREAK_SPACE } from '@/common/constants'

interface Props {
  name: RegisterName
  value: number
  valueClassName?: string
}

const RegisterTableRow = memo(({ name, value, valueClassName }: Props) => {
  const hexValue = decToHex(value)
  const binValue = decToBin(value)

  const signedValue = sign8(value)
  const decValue = `${signedValue >= 0 ? '+' : '-'}${`${Math.abs(signedValue)}`.padStart(3, '0')}`

  return (
    <tr className="divide-x">
      <td className="bg-gray-50 text-center px-2">{name}</td>
      <RegisterValueTableCell radixLabel={RadixLabel.Hex}>
        <span className={classNames('rounded text-sm px-1', valueClassName)}>{hexValue}</span>
      </RegisterValueTableCell>
      <RegisterValueTableCell radixLabel={RadixLabel.Bin}>
        <span className="rounded text-sm px-1">{binValue}</span>
      </RegisterValueTableCell>
      <RegisterValueTableCell radixLabel={RadixLabel.Dec}>
        <span className="rounded text-sm px-1">{decValue}</span>
      </RegisterValueTableCell>
    </tr>
  )
})

if (import.meta.env.DEV) {
  RegisterTableRow.displayName = 'RegisterTableRow'
}

const FlagIndicator = memo(() => (
  <tr>
    <td>{NO_BREAK_SPACE}</td>
    <td />
    <RegisterValueTableCell>
      <span className="text-sm px-1">{`${NO_BREAK_SPACE.repeat(3)}ISOZ${NO_BREAK_SPACE}`}</span>
    </RegisterValueTableCell>
    <td />
  </tr>
))

if (import.meta.env.DEV) {
  FlagIndicator.displayName = 'RegisterTableRow.FlagIndicator'
}

export default Object.assign(RegisterTableRow, { FlagIndicator })
