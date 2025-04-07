import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";
import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from "y-prosemirror";
import { Awareness } from "y-protocols/awareness";
import { createCRDTProvider } from "./crdt";

export function setupCRDTEditor(container: HTMLElement, docName: string) {
  console.log("[Init] Editor starten für:", docName);

  const { ydoc, yXmlFragment, provider } = createCRDTProvider(docName);

  const state = EditorState.create({
    schema,
    plugins: [
      ySyncPlugin(yXmlFragment),
      yCursorPlugin(provider.awareness ?? new Awareness(ydoc)),
      yUndoPlugin(),
    ],
  });

  const view = new EditorView(container, {
    state,
  });

  // Debug global
  (window as any).y = ydoc;
  (window as any).view = view;
  (window as any).provider = provider;

  return view;
}
