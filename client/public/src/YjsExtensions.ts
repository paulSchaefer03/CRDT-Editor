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
        yCursorPlugin(awareness, {
          cursorBuilder: (user: any, clientID: number) => {

            const wrapper = document.createElement('div');
            wrapper.className = 'ivisible-user-cursor-wrapper';
            const invisibleCursor = document.createElement('div');
            invisibleCursor.id = `ivisible-user-cursor-${clientID}`;
            invisibleCursor.className = 'ivisible-user-cursor';

            wrapper.appendChild(invisibleCursor);
            return wrapper;

          }
        }),
        yUndoPlugin(),
      ];
    },
  });
};