import type { Extension } from '@codemirror/state'
import { EditorView, keymap, drawSelection } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'
import { history, historyKeymap } from '@codemirror/history'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets'
import { theme } from './theme'
import { wavyUnderline } from './wavyUnderline'
import { highlightLine } from './highlightLine'
import { asm } from './lang-asm'
import { breakpoints } from './breakpoints'
import { lineNumbers } from './lineNumbers'
import { indentWithTab } from './indentWithTab'

export const setup: Extension = [
  theme(),
  EditorView.lineWrapping,
  drawSelection(),
  wavyUnderline(),
  highlightLine(),
  asm(),
  history(),
  breakpoints(),
  lineNumbers(),
  closeBrackets(),
  keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab])
]
