import { useState, useEffect } from 'react'
import { Transaction, StateEffect } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { useGetState, useSelector, useDispatch } from '../../app/hooks'
import { addActionListener } from '../../app/actionListener'
import {
  selectEditortInput,
  selectEditorBreakpoints,
  selectEditorActiveLinePos,
  setEditorInput,
  setBreakpoints,
  addBreakpoint,
  removeBreakpoint
} from './editorSlice'
import { ViewUpdateListener, useCodeMirror as __useCodeMirror } from './codemirror/hooks'
import { setup } from './codemirror/setup'
import { breakpointEffect, getBreakpoints, breakpointsChanged } from './codemirror/breakpoints'
import { highlightLineEffect } from './codemirror/highlightLine'
import { wavyUnderlineEffect } from './codemirror/wavyUnderline'
import { StringAnnotation } from './codemirror/annotations'
import { lineRangeAt, lineRangesEqual } from './codemirror/line'
import { mapRangeSetToArray } from './codemirror/rangeSet'
import { useAssembler } from '../assembler/hooks'
import { selectAssemblerErrorRange } from '../assembler/assemblerSlice'
import { selectAutoAssemble } from '../controller/controllerSlice'

enum AnnotationValue {
  ChangedFromState = 'ChangedFromState'
}

const isChangedFromState = (transation: Transaction): boolean =>
  transation.annotation(StringAnnotation) === AnnotationValue.ChangedFromState

let syncStateTimeoutId: number | undefined

export const useCodeMirror = (): ReturnType<typeof __useCodeMirror> => {
  const getState = useGetState()
  const [defaultInput] = useState(() => selectEditortInput(getState()))
  const dispatch = useDispatch()
  const assemble = useAssembler(dispatch)

  const { view, editorRef } = __useCodeMirror<HTMLDivElement>(
    {
      doc: defaultInput,
      extensions: setup
    },
    viewUpdate => {
      if (viewUpdate.docChanged) {
        // doc changes must be caused by at least one transaction
        const firstTransaction = viewUpdate.transactions[0]
        const input = viewUpdate.state.doc.sliceString(0)
        window.clearTimeout(syncStateTimeoutId)
        syncStateTimeoutId = window.setTimeout(() => {
          // only one transaction is dispatched if input is set from file
          if (!isChangedFromState(firstTransaction)) {
            dispatch(setEditorInput({ value: input }))
          }
          if (selectAutoAssemble(getState())) {
            assemble(input)
          }
        }, 200)
      }
    }
  )

  useEffect(() => {
    if (view === undefined) {
      return
    }
    if (selectAutoAssemble(getState())) {
      assemble(defaultInput)
    }
    return addActionListener(setEditorInput, ({ value, isFromFile = false }) => {
      if (isFromFile) {
        view.dispatch({
          changes: {
            from: 0,
            to: view.state.doc.sliceString(0).length,
            insert: value
          },
          annotations: StringAnnotation.of(AnnotationValue.ChangedFromState)
        })
      }
    })
  }, [view])

  return { view, editorRef }
}

export const useBreakpoints = (view: EditorView | undefined): void => {
  const getState = useGetState()
  const dispatch = useDispatch()

  useEffect(() => {
    if (view === undefined) {
      return
    }
    const viewUpdateListener: ViewUpdateListener = viewUpdate => {
      if (viewUpdate.docChanged) {
        if (breakpointsChanged(viewUpdate)) {
          const breakpointRangeSet = getBreakpoints(viewUpdate.state)
          const breakpoints = mapRangeSetToArray(breakpointRangeSet, (_, from) =>
            lineRangeAt(viewUpdate.state.doc, from)
          )
          dispatch(setBreakpoints(breakpoints))
        }
      } else {
        const transaction = viewUpdate.transactions[0] as Transaction | undefined
        if (transaction === undefined || isChangedFromState(transaction)) {
          return
        }
        transaction.effects.forEach(effect => {
          if (effect.is(breakpointEffect)) {
            const actionCreator = effect.value.on ? addBreakpoint : removeBreakpoint
            const lineRange = lineRangeAt(viewUpdate.state.doc, effect.value.pos)
            dispatch(actionCreator(lineRange))
          }
        })
      }
    }
    view.dispatch({
      effects: StateEffect.appendConfig.of(EditorView.updateListener.of(viewUpdateListener))
    })
    const breakpoints = selectEditorBreakpoints(getState())
    // persisted state might not be in sync with codemirror
    const validBreakpoints = breakpoints.filter(
      lineRange =>
        lineRange.to <= view.state.doc.length &&
        lineRangesEqual(lineRange, lineRangeAt(view.state.doc, lineRange.from))
    )
    if (validBreakpoints.length < breakpoints.length) {
      dispatch(setBreakpoints(validBreakpoints))
    }
    view.dispatch({
      effects: validBreakpoints.map(lineRange =>
        breakpointEffect.of({
          pos: lineRange.from,
          on: true
        })
      ),
      annotations: StringAnnotation.of(AnnotationValue.ChangedFromState)
    })
  }, [view])
}

export const useHighlightActiveLine = (view: EditorView | undefined): void => {
  const activeLinePos = useSelector(selectEditorActiveLinePos(view))

  useEffect(() => {
    view?.dispatch({
      effects: highlightLineEffect.of({ addPos: activeLinePos }),
      ...(view.hasFocus || activeLinePos === undefined
        ? undefined
        : {
            selection: { anchor: activeLinePos[0] },
            scrollIntoView: true
          })
    })
  }, [view, activeLinePos])
}

export const useUnderlineAssemblerError = (view: EditorView | undefined): void => {
  const assemblerErrorRange = useSelector(selectAssemblerErrorRange)

  useEffect(() => {
    view?.dispatch({
      effects: wavyUnderlineEffect.of({ add: assemblerErrorRange })
    })
  }, [view, assemblerErrorRange])
}