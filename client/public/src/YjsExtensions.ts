import { Extension } from '@tiptap/core';
import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from 'y-prosemirror';
import * as Y from 'yjs';
import { Awareness } from 'y-protocols/awareness';

export const YjsExtension = (yXmlFragment: Y.XmlFragment, awareness: Awareness) => {
  return Extension.create({
    name: 'yjs',

    addProseMirrorPlugins() {
      return [
        ySyncPlugin(yXmlFragment),
        yCursorPlugin(awareness),
        yUndoPlugin(),
      ];
    },
  });
};