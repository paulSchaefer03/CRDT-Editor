import { createCRDTProvider, getSharedPaddingMap  } from "./crdt";
import { entferneLadeIndikator, zeigeEditorAnsicht } from "./navigation";
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
import { updateRulerHandle } from "./ruler";
import { updateActiveState } from "./toolbar";
import setupRulers from './ruler';
import * as Y from "yjs";

import CustomTableCell from "./customExtensions/CutsomTableCell";
import FontSize from "./customExtensions/FontSize";
import FontFamily from "./customExtensions/FontFamily";
import LineHeight from "./customExtensions/LineHeight";





export function setupCRDTEditor(container: HTMLElement, dokumentName: string) {
  const { ydoc, yXmlFragment, provider } = createCRDTProvider(dokumentName);

  const yPadding = getSharedPaddingMap(ydoc);
  const paddingEl = document.getElementById("editor-padding")!;

  // Padding initial setzen

  const initPaddingFromSharedMap = (paddingEl: HTMLElement, yPadding: Y.Map<string>) => {
    const paddingValues: Record<string, string> = {};
    ["top", "right", "bottom", "left"].forEach((side) => {
      const val = yPadding.get(side);
      if (val) {
      paddingEl.style[`padding${side.charAt(0).toUpperCase() + side.slice(1)}` as any] = val;
      paddingValues[side] = val;
      }
    });
    return paddingValues;
  };

  // Padding bei Änderung synchronisieren
  yPadding.observeDeep(() => {
    ["top", "right", "bottom", "left"].forEach((side) => {
      const value = yPadding.get(side);
      if (value) {
        paddingEl.style[`padding${side.charAt(0).toUpperCase() + side.slice(1)}` as any] = value;
      }
    });
  });

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
        alignments: ['left', 'right', 'center', 'justify'], 
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
    const paddingValues = initPaddingFromSharedMap(paddingEl, yPadding);
    zeigeEditorAnsicht();
    if (paddingEl && editor) {
      setupRulers(paddingEl, ydoc, paddingValues);
    }
    
  });

  editor.on('transaction', updateActiveState);
  editor.on('selectionUpdate', updateActiveState);


  // Debug global
  (window as any).view = editor.view;
  (window as any).provider = provider;
  (window as any).editor = editor;
  erstelleToolbar(document.getElementById('toolbar')!, editor, ydoc);
  monitorColumnResize(editor);
  
  return { editor, ydoc };
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

export function setPadding(side: "Left" | "Top" | "Right" | "Bottom", px: number, ydoc: Y.Doc) {
  const yPadding = getSharedPaddingMap(ydoc);
  const paddingEl = document.getElementById("editor-padding")!;
  paddingEl.style[`padding${side}` as any] = `${px}px`;
  yPadding.set(side.toLowerCase(), `${px}px`);
  const documentEl = document.getElementById('document');
  if (!documentEl) return;
  if(side === "Left") {
    updateRulerHandle("Horizontal-Left", px, documentEl);
  }else if(side === "Top") {
    updateRulerHandle("Vertical-Top", px, documentEl);
  }else if(side === "Right") {
    updateRulerHandle("Horizontal-Right", px, documentEl);
  }else if(side === "Bottom") {
    updateRulerHandle("Vertical-Bottom", px, documentEl);
  }
}

