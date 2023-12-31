import CardHeader from '@/common/components/CardHeader'
import RegisterTableRow from './RegisterTableRow'
import { useSelector } from '@/app/hooks'
import {
  selectCpuGeneralPurposeRegisters,
  selectCpuPointerRegisters,
  selectStatusRegister
} from './cpuSlice'
import {
  GeneralPurposeRegister,
  GeneralPurposeRegisterName,
  SpecialPurposeRegisterName
} from './core'
import { arrayShallowEqual } from '@/common/utils'

const CpuRegisters = (): JSX.Element => {
  const gpr = useSelector(selectCpuGeneralPurposeRegisters, arrayShallowEqual)
  const { ip, sp } = useSelector(selectCpuPointerRegisters)
  const sr = useSelector(selectStatusRegister)

  return (
    <div className="border-b">
      <CardHeader title="Registers" />
      <div className="divide-x flex">
        <table className="flex-1">
          <tbody className="divide-y">
            {gpr.map((registerValue, indexAsMachineCode) => {
              const registerName = GeneralPurposeRegister[indexAsMachineCode]
              return (
                <RegisterTableRow
                  key={indexAsMachineCode}
                  name={registerName as GeneralPurposeRegisterName}
                  value={registerValue}
                />
              )
            })}
          </tbody>
        </table>
        <table className="flex-1">
          <tbody className="divide-y">
            <RegisterTableRow
              name={SpecialPurposeRegisterName.IP}
              value={ip}
              valueClassName="bg-green-100"
            />
            <RegisterTableRow
              name={SpecialPurposeRegisterName.SP}
              value={sp}
              valueClassName="bg-blue-100"
            />
            <RegisterTableRow name={SpecialPurposeRegisterName.SR} value={sr} />
            <RegisterTableRow.FlagIndicator />
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CpuRegisters
