import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { YjsExtension } from "./YjsExtension"; // dein Plugin

const doc = new Y.Doc();
const provider = new HocuspocusProvider({
  url: "ws://localhost:3001",
  name: "uebergabeliste",
  document: doc,
});

const yXmlFragment = doc.getXmlFragment("prosemirror");

export default function CRDTEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      YjsExtension(yXmlFragment, provider.awareness),
    ],
    editorProps: {
      attributes: {
        class: "prose max-w-full p-4 border rounded",
      },
    },
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">CRDT-Übergabeliste (MVP)</h1>
      <EditorContent editor={editor} />
    </div>
  );
}
