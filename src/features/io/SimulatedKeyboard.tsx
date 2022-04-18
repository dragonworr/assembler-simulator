import { useRef } from 'react'
import Modal from '@/common/components/Modal'
import { useStore, useSelector } from '@/app/hooks'
import { selectIsSuspended, setSuspended } from '@/features/controller/controllerSlice'
import {
  selectIsWaitingForKeyboardInput,
  setWaitingForKeyboardInput,
  setInputData
} from './ioSlice'
import { InputPort } from './core'

const SimulatedKeyboard = (): JSX.Element | null => {
  const store = useStore()
  const isSuspended = useSelector(selectIsSuspended)
  const isWaitingForKeyboardInput = useSelector(selectIsWaitingForKeyboardInput)

  const inputRef = useRef<HTMLInputElement>(null)

  const focusInput: React.FocusEventHandler<HTMLInputElement> = () => {
    inputRef.current?.focus()
  }

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const key = target.value
    store.dispatch(
      setInputData({
        content: key.charCodeAt(0),
        port: InputPort.SimulatedKeyboard
      })
    )
    store.dispatch(setSuspended(false))
    store.dispatch(setWaitingForKeyboardInput(false))
  }

  return (
    <Modal
      className="bg-black flex bg-opacity-80 inset-0 fixed items-center justify-center"
      isOpen={isSuspended && isWaitingForKeyboardInput}>
      <div className="border rounded bg-light-100 py-2 px-4">Waiting for keyboard input</div>
      <input
        ref={inputRef}
        autoFocus
        className="-z-1 absolute"
        onBlur={focusInput}
        onChange={handleInputChange}
      />
    </Modal>
  )
}

export default SimulatedKeyboard
