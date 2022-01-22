import Menu from './Menu'
import MenuButton from './MenuButton'
import MenuItems from './MenuItems'
import MenuItem from './MenuItem'
import { View, CheckMark } from '@/common/components/icons'
import { dispatch } from '@/app/store'
import { useSelector } from '@/app/hooks'
import { memoryViewOptions, selectMemoryView, setMemoryView } from '@/features/memory/memorySlice'
import { selectIoDeviceViewOptions } from '@/features/io/ioSlice'

const MemoryMenu = (): JSX.Element => {
  const memoryView = useSelector(selectMemoryView)

  return (
    <MenuItem.Expandable>
      {(isHovered, menuItemsRef) => (
        <>
          <MenuButton>
            <span className="w-4" />
            <span>Memory</span>
          </MenuButton>
          {isHovered && (
            <MenuItems.Expanded className="top-8" innerRef={menuItemsRef}>
              {memoryViewOptions.map((memoryViewOption, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    dispatch(setMemoryView(memoryViewOption))
                  }}>
                  <MenuButton>
                    {memoryView === memoryViewOption ? <CheckMark /> : <span className="w-4" />}
                    <span>{memoryViewOption}</span>
                  </MenuButton>
                </MenuItem>
              ))}
            </MenuItems.Expanded>
          )}
        </>
      )}
    </MenuItem.Expandable>
  )
}

const IoMenu = (): JSX.Element => {
  const ioDeviceViewOptions = useSelector(selectIoDeviceViewOptions)

  return (
    <MenuItem.Expandable>
      {(isHovered, menuItemsRef) => (
        <>
          <MenuButton>
            <span className="w-4" />
            <span>I/O Devices</span>
          </MenuButton>
          {isHovered && (
            <MenuItems.Expanded className="mt-1px top-16" innerRef={menuItemsRef}>
              {ioDeviceViewOptions.map(({ name, isActive, toggleActive }, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    dispatch(toggleActive())
                  }}>
                  <MenuButton>
                    {isActive ? <CheckMark /> : <span className="w-4" />}
                    <span>{name}</span>
                  </MenuButton>
                </MenuItem>
              ))}
            </MenuItems.Expanded>
          )}
        </>
      )}
    </MenuItem.Expandable>
  )
}

const ViewMenu = (): JSX.Element => (
  <Menu>
    {isOpen => (
      <>
        <MenuButton.Main>
          <View />
          <span>View</span>
        </MenuButton.Main>
        {isOpen && (
          <MenuItems>
            <MemoryMenu />
            <IoMenu />
          </MenuItems>
        )}
      </>
    )}
  </Menu>
)

export default ViewMenu
