
import { Extension } from '@tiptap/core'
import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from 'y-prosemirror'

export const YjsExtension = (yXmlFragment, awareness) =>
  Extension.create({
    name: 'yjs',

    addProseMirrorPlugins() {
      return [
        ySyncPlugin(yXmlFragment),
        yCursorPlugin(awareness),
        yUndoPlugin(),
      ]
    },
  })
