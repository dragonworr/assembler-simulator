import { memo } from 'react'
import Card from '@/common/components/Card'
import { useSelector } from '@/app/hooks'
import {
  MemoryView,
  selectMemoryDataRowsLazily,
  selectMemorySourceRowsLazily,
  selectMemoryView
} from './memorySlice'
import { MAX_SP } from '@/features/cpu/core'
import { selectCpuPointerRegisters } from '@/features/cpu/cpuSlice'
import { decToHex, range } from '@/common/utils'

const ColumIndicatorTableRow = memo(() => (
  <tr className="divide-x bg-gray-50 text-gray-400">
    <td />
    {range(0x10).map(colIndex => (
      <td key={colIndex} className="text-center">
        {decToHex(colIndex)[1]}
      </td>
    ))}
  </tr>
))

const Memory = (): JSX.Element => {
  const memoryView = useSelector(selectMemoryView)

  const getDataRows = useSelector(selectMemoryDataRowsLazily)
  const getSourceRows = useSelector(selectMemorySourceRowsLazily)

  const rows = memoryView === MemoryView.Source ? getSourceRows() : getDataRows()

  let address = 0
  const { ip, sp } = useSelector(selectCpuPointerRegisters)

  return (
    <Card title="Memory">
      <table className="text-sm w-full">
        <tbody className="divide-y">
          <ColumIndicatorTableRow />
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="divide-x">
              <td className="bg-gray-50 text-center text-gray-400">
                <span className="px-1">{decToHex(rowIndex)[1]}</span>
              </td>
              {row.map((value, colIndex) => {
                const tdClassName = sp < address && address <= MAX_SP ? 'bg-blue-50' : ''
                const spanClassName =
                  address === ip
                    ? 'rounded bg-green-100'
                    : address === sp
                    ? 'rounded bg-blue-100'
                    : ''
                address += 1
                return (
                  <td key={colIndex} className={`text-center ${tdClassName}`}>
                    <span className={`px-1 ${spanClassName}`}>
                      {memoryView === MemoryView.Hexadecimal ? decToHex(value as number) : value}
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

export default Memory
