import { PayloadAction, createSlice, createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import type { UnionToTuple } from '@/common/utils'

export enum MemoryView {
  Hexadecimal = 'Hexadecimal',
  Decimal = 'Decimal',
  Source = 'Source'
}

interface View {
  memory: MemoryView
}

export enum ClockSpeed {
  '2 Hz' = 2,
  '4 Hz' = 4,
  '8 Hz' = 8,
  '16 Hz' = 16,
  '32 Hz' = 32,
  '64 Hz' = 64
}

export const CLOCK_SPEED_OPTION_NAMES: Readonly<UnionToTuple<keyof typeof ClockSpeed>> = [
  '2 Hz',
  '4 Hz',
  '8 Hz',
  '16 Hz',
  '32 Hz',
  '64 Hz'
]

export enum TimerInterval {
  '1 second' = 1000,
  '2 seconds' = 2000,
  '4 seconds' = 4000,
  '8 seconds' = 8000
}

export const TIMER_INTERVAL_OPTION_NAMES: Readonly<UnionToTuple<keyof typeof TimerInterval>> = [
  '1 second',
  '2 seconds',
  '4 seconds',
  '8 seconds'
]

interface Configuration {
  autoAssemble: boolean
  clockSpeed: ClockSpeed
  timerInterval: TimerInterval
}

interface ControllerState {
  view: View
  configuration: Configuration
  isRunning: boolean
  isSuspended: boolean
}

const initialState: ControllerState = {
  view: {
    memory: MemoryView.Hexadecimal
  },
  configuration: {
    autoAssemble: true,
    clockSpeed: ClockSpeed['4 Hz'],
    timerInterval: TimerInterval['2 seconds']
  },
  isRunning: false,
  isSuspended: false
}

export const controllerSlice = createSlice({
  name: 'controller',
  initialState,
  reducers: {
    setMemoryView: (state, action: PayloadAction<MemoryView>) => {
      state.view.memory = action.payload
    },
    setAutoAssemble: (state, action: PayloadAction<boolean>) => {
      state.configuration.autoAssemble = action.payload
    },
    setClockSpeed: (state, action: PayloadAction<ClockSpeed>) => {
      state.configuration.clockSpeed = action.payload
    },
    setTimerInterval: (state, action: PayloadAction<TimerInterval>) => {
      state.configuration.timerInterval = action.payload
    },
    setRunning: (state, action: PayloadAction<boolean>) => {
      state.isRunning = action.payload
    },
    setSuspended: (state, action: PayloadAction<boolean>) => {
      state.isSuspended = action.payload
    }
  }
})

const selectView = (state: RootState): View => state.controller.view

export const selectMemoryView = (state: RootState): MemoryView => state.controller.view.memory

const selectConfiguration = (state: RootState): Configuration => state.controller.configuration

export const selectAutoAssemble = (state: RootState): boolean =>
  state.controller.configuration.autoAssemble

export const selectClockSpeed = (state: RootState): ClockSpeed =>
  state.controller.configuration.clockSpeed

export const selectTimerInterval = (state: RootState): TimerInterval =>
  state.controller.configuration.timerInterval

export const selectRuntimeConfiguration = createSelector(
  selectClockSpeed,
  selectTimerInterval,
  (clockSpeed, timerInterval) => ({ clockSpeed, timerInterval })
)

export const selectIsRunning = (state: RootState): boolean => state.controller.isRunning

export const selectIsSuspended = (state: RootState): boolean => state.controller.isSuspended

export const selectControllerStateToPersist = createSelector(
  selectView,
  selectConfiguration,
  (view, configuration) => ({ view, configuration })
)

export const {
  setMemoryView,
  setAutoAssemble,
  setClockSpeed,
  setTimerInterval,
  setRunning,
  setSuspended
} = controllerSlice.actions

export default controllerSlice.reducer
