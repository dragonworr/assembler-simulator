import Menu from './Menu'
import MenuButton from './MenuButton'
import MenuItems from './MenuItems'
import MenuItem from './MenuItem'
import { CheckMark, Wrench } from '@/common/components/icons'
import { dispatch } from '@/app/store'
import { useSelector } from '@/app/hooks'
import {
  ClockSpeed,
  clockSpeedOptionNames,
  TimerInterval,
  timerIntervalOptionNames,
  selectAutoAssemble,
  selectClockSpeed,
  selectTimerInterval,
  setAutoAssemble,
  setClockSpeed,
  setTimerInterval
} from './controllerSlice'

const AutoAssembleSwitch = (): JSX.Element => {
  const autoAssemble = useSelector(selectAutoAssemble)

  const toggleAutoAssemble = (): void => {
    dispatch(setAutoAssemble(!autoAssemble))
  }

  return (
    <MenuItem onClick={toggleAutoAssemble}>
      <MenuButton>
        {autoAssemble ? <CheckMark /> : <span className="w-4" />}
        <span>Auto Assemble</span>
      </MenuButton>
    </MenuItem>
  )
}

const ClockSpeedMenu = (): JSX.Element => {
  const clockSpeed = useSelector(selectClockSpeed)

  return (
    <MenuItem.Expandable>
      {(isHovered, menuItemsRef, menuItem) => (
        <>
          <MenuButton>
            <span className="w-4" />
            <span>Clock Speed</span>
          </MenuButton>
          {isHovered && (
            <MenuItems.Expanded innerRef={menuItemsRef} menuItem={menuItem}>
              {clockSpeedOptionNames.map((clockSpeedOptionName, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    dispatch(setClockSpeed(ClockSpeed[clockSpeedOptionName]))
                  }}>
                  <MenuButton>
                    {clockSpeed === ClockSpeed[clockSpeedOptionName] ? (
                      <CheckMark />
                    ) : (
                      <span className="w-4" />
                    )}
                    <span>{clockSpeedOptionName}</span>
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

const TimerIntervalMenu = (): JSX.Element => {
  const timerInterval = useSelector(selectTimerInterval)

  return (
    <MenuItem.Expandable>
      {(isHovered, menuItemsRef, menuItem) => (
        <>
          <MenuButton>
            <span className="w-4" />
            <span>Timer Interval</span>
          </MenuButton>
          {isHovered && (
            <MenuItems.Expanded innerRef={menuItemsRef} menuItem={menuItem}>
              {timerIntervalOptionNames.map((timerIntervalOptionName, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    dispatch(setTimerInterval(TimerInterval[timerIntervalOptionName]))
                  }}>
                  <MenuButton>
                    {timerInterval === TimerInterval[timerIntervalOptionName] ? (
                      <CheckMark />
                    ) : (
                      <span className="w-4" />
                    )}
                    <span>{timerIntervalOptionName}</span>
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

const ConfigurationMenu = (): JSX.Element => (
  <Menu>
    {isOpen => (
      <>
        <MenuButton.Main>
          <Wrench />
          <span>Configuration</span>
        </MenuButton.Main>
        {isOpen && (
          <MenuItems>
            <AutoAssembleSwitch />
            <ClockSpeedMenu />
            <TimerIntervalMenu />
          </MenuItems>
        )}
      </>
    )}
  </Menu>
)

export default ConfigurationMenu
