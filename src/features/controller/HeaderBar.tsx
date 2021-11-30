import React from 'react'
import FileMenu from './FileMenu'
import ConfigurationMenu from './ConfigurationMenu'
import ControlButton from './ControlButton'
import { Arrow, Play, Stop, Forward, Undo, Github } from '../../common/components/icons'
import { useSelector } from '../../app/hooks'
import { selectIsRunning } from './controllerSlice'
import { useController } from './hooks'
import { NO_BREAK_SPACE } from '../../common/constants'

interface Props {
  className?: string
}

const HeaderBar = ({ className }: Props): JSX.Element => {
  const { assemble, run, step, reset } = useController()

  const RunButton = (): JSX.Element => {
    const isRunning = useSelector(selectIsRunning)

    return (
      <ControlButton onClick={run}>
        {isRunning ? (
          <>
            <Stop />
            <span>Stop</span>
          </>
        ) : (
          <>
            <Play />
            <span>Run{NO_BREAK_SPACE}</span>
          </>
        )}
      </ControlButton>
    )
  }

  return (
    <header
      className={`border-b flex bg-gray-100 h-8 w-full z-2 fixed items-center justify-between ${className}`}>
      <div className="divide-x flex">
        <FileMenu />
        <ConfigurationMenu />
        <ControlButton onClick={assemble}>
          <Arrow />
          <span>Assemble</span>
        </ControlButton>
        <RunButton />
        <ControlButton onClick={step}>
          <Forward />
          <span>Step</span>
        </ControlButton>
        <ControlButton onClick={reset}>
          <Undo />
          <span>Reset</span>
        </ControlButton>
      </div>
      <div className="flex space-x-2 px-2 items-center">
        <span className="min-w-max">Assembler Simulator</span>
        <a
          href="https://github.com/exuanbo/assembler-simulator"
          rel="noopener noreferrer"
          target="_blank">
          <Github className="h-1.2rem" />
        </a>
      </div>
    </header>
  )
}

export default HeaderBar
