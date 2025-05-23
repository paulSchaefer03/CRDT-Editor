import { createCRDTProvider, getSharedPaddingMap, getSharedOrientationMap  } from "./crdt";
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
import { createAndAddUserCursor, getAllUserCursors, removeUserCursor, updateUserCursorPostion } from "./userCursors";
import setupRulers from './ruler';
import * as Y from "yjs";
import { setPadding, applyMargins, setOrientation, updateOrientation } from "./utils";
import { updateActiveState } from "./toolbarExtensions/createButtons";
import { userCursorLogs, otherLogs } from "./globalConstants";

import CustomTableCell from "./customExtensions/CutsomTableCell";
import FontSize from "./customExtensions/FontSize";
import FontFamily from "./customExtensions/FontFamily";
import LineHeight from "./customExtensions/LineHeight";


export function setupCRDTEditor(container: HTMLElement, dokumentName: string) {
  const { ydoc, yXmlFragment, provider } = createCRDTProvider(dokumentName);

  const yPadding = getSharedPaddingMap(ydoc);
  const yOrientation = getSharedOrientationMap(ydoc);
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

  if(provider.awareness == null) {
    if(otherLogs) console.error("[CRDT] Awareness ist null. Überprüfe die Verbindung.");
    return;
  }

  const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  const randomName = `User${Math.floor(Math.random() * 1000)}`;
  provider.awareness.setLocalStateField('user', {
    name: randomName,
    color: randomColor,
  });

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
    if(otherLogs) console.log("[Hocuspocus] Synchronisiert:", provider.synced, " Dokument:", dokumentName, " Entferne Ladeindikator");
    entferneLadeIndikator();
    const paddingValues = initPaddingFromSharedMap(paddingEl, yPadding);
    zeigeEditorAnsicht();

    const currentOrientation = yOrientation.get("mode");
    if(otherLogs) console.log("[CRDT] Aktuelle Orientierung:", currentOrientation);
    if (currentOrientation === undefined) {
      yOrientation.set("mode", "portrait");
    } else if (currentOrientation === "landscape") {
      setOrientation("landscape", ydoc, false);
    }
    //portrait ist default also das muss nicht gesetzt werden

    if (paddingEl && editor) {
      if(otherLogs) console.log("[CRDT] Padding-Element gefunden:", paddingValues);
      if(paddingValues.top === undefined || paddingValues.right === undefined || paddingValues.bottom === undefined || paddingValues.left === undefined) {
        applyMargins(25, 25, 20, 25, ydoc); //Padding in mm
        const dpi = 96;
        const mmToPx = dpi / 2.54 / 10; // 1 cm = 10 mm
        const paddingValues = {
          top: `${25 * mmToPx}px`,
          right: `${25 * mmToPx}px`,
          bottom: `${20 * mmToPx}px`,
          left: `${25 * mmToPx}px`,
        };
        setupRulers(paddingEl, ydoc, paddingValues);
      }else{
        setupRulers(paddingEl, ydoc, paddingValues);
      }
      
    }

    // Padding bei Änderung synchronisieren
    yPadding.observeDeep(() => {
      ["top", "right", "bottom", "left"].forEach((side) => {
        const value = yPadding.get(side);
        if (value) {
          //Wichtig kein Update sonst infinite loop
          setPadding(side.charAt(0).toUpperCase() + side.slice(1) as "Left" | "Top" | "Right" | "Bottom", parseInt(value), ydoc, false);
        }
      });
    });

    // Orientierung bei Änderung synchronisieren
    yOrientation.observeDeep(() => {
      const currentOrientation = yOrientation.get("mode");
      if (currentOrientation === "landscape") {
        setOrientation("landscape", ydoc, false); //Kein Update schreiben sonst infinite loop
        updateOrientation(ydoc); 
      } else {
        setOrientation("portrait", ydoc, false);//Kein Update schreiben sonst infinite loop
        updateOrientation(ydoc);
      }
    });

    if(provider.awareness != null) {
      provider.awareness.on('change', (change: { added: number[]; updated: number[]; removed: number[] }) => {
        if(userCursorLogs) console.log("[CRDT] Awareness hat sich geändert:", provider.awareness?.getStates(), change);
        if (provider.awareness == null) return;
        const currentCursors = getAllUserCursors();
        const currentClients = provider.awareness.getStates();
        if(currentCursors.size !== (currentClients.size - 1)) { //Man selbst braucht keinen Extra Cursor
          const documentEl = document.getElementById('editor-padding');
          if (!documentEl) return;
          // Identifieziere alle neuen Clients
          if(currentCursors.size < (currentClients.size - 1)) {
            const currentCursorsIds = Array.from(currentCursors.keys());
            const newClients = Array.from(currentClients.keys()).filter((clientId) => 
              clientId !== provider.awareness?.clientID && !currentCursorsIds.includes(clientId)
            );
            if(userCursorLogs) console.log("[CRDT] Neue Clients:", newClients, " Aktuelle Clients:", currentCursorsIds);
            newClients.forEach((clientId) => {
              const clientState = currentClients.get(clientId);
              if (clientState) {
                createAndAddUserCursor(clientId, clientState.user.color, clientState.user.name, documentEl);
                updateUserCursorPostion(clientId);
              }
            });
          }else{
            // Identifiziere alle Clients die entfernt werden müssen
            const currentClientIds = Array.from(currentClients.keys())
              .filter((clientId) => clientId !== provider.awareness?.clientID)
              .map((clientId) => `user-cursor-${clientId}`);
            const removedClientIds = Array.from(currentCursors.keys()).filter((cursorId) => !currentClientIds.includes(cursorId.toString()));
            if(userCursorLogs) console.log("[CRDT] Entfernte Clients:", removedClientIds, " Aktuelle Clients:", currentClientIds);
            removedClientIds.forEach((clientId) => {
              removeUserCursor(clientId);
            });
          }
        }else{
          if(change.updated.length > 0) {
            change.updated.forEach((clientId) => {
              if(userCursorLogs) console.log("[CRDT] Aktualisiere Cursor-Position für Client:", clientId);
              updateUserCursorPostion(clientId);
            });
          }
        }

      });
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

