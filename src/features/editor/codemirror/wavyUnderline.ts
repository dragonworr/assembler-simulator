import { StateEffect, StateField, Extension } from '@codemirror/state'
import { EditorView, Decoration, DecorationSet } from '@codemirror/view'
import type { RangeSetUpdateFilter } from './rangeSet'
import { maybeNullable } from '@/common/utils'

export const WavyUnderlineEffect = StateEffect.define<{
  add?: { from: number; to: number }
  filter?: RangeSetUpdateFilter<Decoration>
}>({
  map({ add, filter }, mapping) {
    return {
      add: maybeNullable(add)
        .map(({ from, to }) => ({
          from: mapping.mapPos(from),
          to: mapping.mapPos(to)
        }))
        .extract(),
      filter
    }
  }
})

const markDecoration = Decoration.mark({ class: 'cm-wavyUnderline' })

const wavyUnderlineField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none
  },
  update(decorationSet, transaction) {
    return transaction.effects.reduce(
      (resultSet, effect) =>
        effect.is(WavyUnderlineEffect)
          ? resultSet.update({
              add: maybeNullable(effect.value.add)
                .map(({ from, to }) => [markDecoration.range(from, to)])
                .extract(),
              filter: effect.value.filter
            })
          : resultSet,
      decorationSet.map(transaction.changes)
    )
  },
  provide: thisField => EditorView.decorations.from(thisField)
})

const WAVY_UNDERLINE_IMAGE = `url('data:image/svg+xml;base64,${window.btoa(
  `<svg height="4" width="6" xmlns="http://www.w3.org/2000/svg">
  <path fill="none" stroke="red" d="m0 3 l2 -2 l1 0 l2 2 l1 0" />
</svg>`
)}')`

export const wavyUnderline = (): Extension => {
  return [
    wavyUnderlineField,
    EditorView.baseTheme({
      '.cm-wavyUnderline': {
        background: `${WAVY_UNDERLINE_IMAGE} left bottom repeat-x`,
        paddingBottom: '2px'
      }
    })
  ]
}
