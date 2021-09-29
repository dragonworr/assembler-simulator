import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const MenuButton = ({ children }: Props): JSX.Element => (
  <div className="flex space-x-2 items-center">{children}</div>
)

export default MenuButton