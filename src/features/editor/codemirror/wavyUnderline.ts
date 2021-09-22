import { StateField, StateEffect, Extension } from '@codemirror/state'
import { EditorView, Decoration, DecorationSet } from '@codemirror/view'

export const wavyUnderlineEffect = StateEffect.define<{
  add?:
    | {
        from: number
        to: number
      }
    | undefined
  filter?: ((from: number, to: number) => boolean) | undefined
}>({
  map({ add, filter }, mapping) {
    return {
      add:
        add === undefined
          ? undefined
          : {
              from: mapping.mapPos(add.from),
              to: mapping.mapPos(add.to)
            },
      filter
    }
  }
})

const wavyUnderlineMark = Decoration.mark({ class: 'cm-wavyUnderline' })

const wavyUnderlineField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none
  },
  update(decorationSet, transaction) {
    return transaction.effects.reduce<DecorationSet>((resultSet, effect) => {
      if (!effect.is(wavyUnderlineEffect)) {
        return resultSet
      }
      const { add, filter } = effect.value
      return resultSet.update({
        add: add === undefined ? [] : [wavyUnderlineMark.range(add.from, add.to)],
        ...(filter === undefined ? undefined : { filter })
      })
    }, decorationSet.map(transaction.changes))
  },
  provide: field => EditorView.decorations.from(field)
})

const wavyUnderlineImage = `url('data:image/svg+xml;base64,${window.btoa(
  `<svg height="4" width="6" xmlns="http://www.w3.org/2000/svg">
  <path d="m0 3 l2 -2 l1 0 l2 2 l1 0" fill="none" stroke="red" />
</svg>`
)}')`

export const wavyUnderline = (): Extension => [
  wavyUnderlineField,
  EditorView.baseTheme({
    '.cm-wavyUnderline': {
      background: `${wavyUnderlineImage} left bottom repeat-x`,
      paddingBottom: '2px'
    }
  })
]