import type { Extension } from '@codemirror/state'
import { EditorView, keymap, drawSelection } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'
import { history, historyKeymap } from '@codemirror/history'
import { lineNumbers } from '@codemirror/gutter'
import { defaultHighlightStyle } from '@codemirror/highlight'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets'
import { breakpointGutter } from './breakpointGutter'
import { highlightActiveRange } from './highlightActiveRange'
import { Asm } from './lang-asm'
import { indentWithTab } from './indentWithTab'

const theme = EditorView.theme({
  '&': {
    height: '100%',
    width: '50vw'
  },
  '&.cm-focused': {
    outline: '0'
  },
  '.cm-scroller': {
    fontFamily: "'Jetbrains Mono', monospace"
  },
  '.cm-breakpoints': {
    fontSize: '0.875em'
  },
  '.cm-lineNumbers': {
    paddingRight: '6px'
  }
})

export const setup: Extension = [
  drawSelection(),
  highlightActiveRange(),
  history(),
  breakpointGutter(),
  lineNumbers(),
  closeBrackets(),
  Asm(),
  theme,
  EditorView.lineWrapping,
  defaultHighlightStyle,
  keymap.of([...defaultKeymap, ...historyKeymap, ...closeBracketsKeymap, indentWithTab])
]
