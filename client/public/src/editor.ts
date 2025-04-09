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
import TextStyle from '@tiptap/extension-text-style';
import { YjsExtension } from "./YjsExtensions";
import { erstelleToolbar } from "./toolbar";
import { enforceTableMaxWidth } from "./tableSizing";

import CustomTableCell from "./customExtensions/CutsomTableCell";
import FontSize from "./customExtensions/FontSize";
import FontFamily from "./customExtensions/FontFamily";
import LineHeight from "./customExtensions/LineHeight";

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
      CustomTableCell,
      FontSize,
      FontFamily,
      LineHeight,
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
  monitorColumnResize(editor);
  
  return editor;
}

function monitorColumnResize(editor: Editor) {
  let resizing = false;

  document.addEventListener('mousedown', (e) => {
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (target && (target.classList.contains('column-resize-dragging') || 
      target.tagName === 'TH' || 
      target.tagName === 'TD' || 
      target.tagName === 'TABLE')) {
      resizing = true;
    }
  });

  document.addEventListener('mouseup', () => {
    if (resizing) {
      resizing = false;
      // Timeout um DOM-Änderung abzuwarten
      setTimeout(() => enforceTableMaxWidth(editor), 10);
    }
  });
}

