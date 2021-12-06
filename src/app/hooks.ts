import {
  TypedUseSelectorHook,
  useSelector as __useSelector,
  shallowEqual,
  useDispatch as __useDispatch,
  useStore as __useStore
} from 'react-redux'
import type { RootState, Dispatch, Store } from './store'

export const useSelector: TypedUseSelectorHook<RootState> = __useSelector

export const useShallowEqualSelector = <TSelected>(
  selector: (state: RootState) => TSelected
): TSelected => __useSelector(selector, shallowEqual)

export const useDispatch = () => __useDispatch<Dispatch>() // eslint-disable-line

export const useStore = (): Store => __useStore()
