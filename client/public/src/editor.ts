import { createCRDTProvider } from "./crdt";
import { entferneLadeIndikator } from "./navigation";
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TextStyle from '@tiptap/extension-text-style';
import { YjsExtension } from "./YjsExtensions";
import { erstelleToolbar } from "./toolbar";

export function setupCRDTEditor(container: HTMLElement, dokumentName: string) {
  const { ydoc, yXmlFragment, provider } = createCRDTProvider(dokumentName);
  if(provider.awareness == null) {
    console.error("[CRDT] Awareness ist null. Überprüfe die Verbindung.");
    return;
  }
  const editor = new Editor({
    element: container,
    extensions: [
      StarterKit.configure({ history: false }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'],
        alignments: ['left', 'right', 'center'], 
        defaultAlignment: 'left',
      }),
      Color,
      TextStyle,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      YjsExtension(yXmlFragment, provider.awareness),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-full p-4 border rounded min-h-[200px] outline-none',
      },
    },
  });

  provider.on("synced", () => {
    console.log("[Hocuspocus] Synchronisiert:", provider.synced, " Dokument:", dokumentName, " Entferne Ladeindikator");
    entferneLadeIndikator();
  });

  // Debug global
  (window as any).view = editor.view;
  (window as any).provider = provider;
  (window as any).editor = editor;
  erstelleToolbar(document.getElementById('toolbar')!, editor);
  return editor;
}
