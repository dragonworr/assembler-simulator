import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

const ControlButton = ({ children, onClick }: Props): JSX.Element => (
  <button
    className="flex space-x-2 py-1 px-2 items-center hover:bg-gray-200 focus:outline-none "
    onClick={onClick}>
    {children}
  </button>
)

export default ControlButton