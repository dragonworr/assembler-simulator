import { useState, useEffect, useCallback, useMemo } from 'react'
import { MenuContext } from './Menu'
import MenuButton from './MenuButton'
import FileMenu from './FileMenu'
import ViewMenu from './ViewMenu'
import ConfigurationMenu from './ConfigurationMenu'
import ControlButtons from './ControlButtons'
import HelpMenu from './HelpMenu'
import { Github } from '@/common/components/icons'
import { useOutsideClick } from '@/common/hooks'

const ToolBar = (): JSX.Element => {
  const [openMenu, setOpenMenu] = useState<HTMLDivElement | null>(null)

  const menuContextValue = useMemo(() => {
    return {
      currentOpen: openMenu,
      setCurrentOpen: setOpenMenu
    }
  }, [openMenu])

  const handleOutsideClick = useCallback(() => {
    if (openMenu !== null) {
      setOpenMenu(null)
    }
  }, [openMenu])

  const outsideClickRef = useOutsideClick(handleOutsideClick)

  useEffect(() => {
    outsideClickRef(openMenu)
  }, [openMenu])

  return (
    <div className="border-y flex flex-row-reverse min-w-max bg-gray-100 h-8 w-full z-10 fixed items-center justify-between">
      <MenuButton.Main>
        <h1>Assembler Simulator</h1>
        <a
          href="https://github.com/exuanbo/assembler-simulator"
          rel="noopener noreferrer"
          target="_blank">
          <Github className="w-4.5" />
        </a>
      </MenuButton.Main>
      <div className="divide-x border-r flex">
        <MenuContext.Provider value={menuContextValue}>
          <FileMenu />
          <ViewMenu />
          <ConfigurationMenu />
          <ControlButtons />
          <HelpMenu />
        </MenuContext.Provider>
      </div>
    </div>
  )
}

export default ToolBar
