import * as Y from "yjs";
import { updateRulerHandle, removeRulers } from "./ruler";
import { getSharedPaddingMap, getSharedOrientationMap  } from "./crdt";
import setupRulers from './ruler';

export function initPaddingFromSharedMap(paddingEl: HTMLElement, yPadding: Y.Map<string>) {
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

export function applyMargins(top: number, right: number, bottom: number, left: number, ydoc: Y.Doc) {
  const paddingEl = document.getElementById('editor-padding')!;
  if (!paddingEl) return;
  paddingEl.style.paddingTop = `${top}mm`;
  paddingEl.style.paddingRight = `${right}mm`;
  paddingEl.style.paddingBottom = `${bottom}mm`;
  paddingEl.style.paddingLeft = `${left}mm`;

  const dpi = 96;
  const mmToPx = dpi / 2.54 / 10; // 1 cm = 10 mm

  setPadding('Top', top * mmToPx, ydoc, true);
  setPadding('Right', right * mmToPx, ydoc, true);
  setPadding('Bottom', bottom * mmToPx, ydoc, true);
  setPadding('Left', left * mmToPx, ydoc, true);
}

export function setPadding(side: "Left" | "Top" | "Right" | "Bottom", px: number, ydoc: Y.Doc, update: boolean = true) {
    const yPadding = getSharedPaddingMap(ydoc);
    const paddingEl = document.getElementById("editor-padding")!;
    paddingEl.style[`padding${side}` as any] = `${px}px`;
    if (update) {
    yPadding.set(side.toLowerCase(), `${px}px`);
    }
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
  
  export function setOrientation(orientation: "portrait" | "landscape", ydoc: Y.Doc, update: boolean = true) {
    const yOrientation = getSharedOrientationMap(ydoc);
    if (update) {
      yOrientation.set("mode", orientation);
    }
    const documentEl = document.getElementById('document');
    if (!documentEl) return;
  
    if (orientation === "landscape") {
      documentEl.style.width = '1123px';
      documentEl.style.height = '794px';
      orientationToggle.textContent = 'Hochformat';
    } else {
      documentEl.style.width = '794px';
      documentEl.style.height = '1123px';
      orientationToggle.textContent = 'Querformat';
    }
  }
  
  // Funktion die ausschließlich die Orientierung der Lineale ändert
  export function updateOrientation(ydoc: Y.Doc) {
    const documentEl = document.getElementById('document');
    if (!documentEl) return;
    removeRulers();
    let toggleViewRuler = false;
    const linealVert = document.getElementById('ruler-vertical');
    const linealHorizontal = document.getElementById('ruler-row-id');
    if (!linealVert || !linealHorizontal) return;
    if(!(linealVert.style.display === 'flex' && linealHorizontal.style.display === 'flex')) {
      linealVert.style.display = linealVert.style.display === 'none' ? 'flex' : 'none';
      linealHorizontal.style.display = linealHorizontal.style.display === 'none' ? 'flex' : 'none';
      toggleViewRuler = true;
    }
    const yPadding = getSharedPaddingMap(ydoc);
    const paddingEl = document.getElementById("editor-padding")!;
    const paddingValues = initPaddingFromSharedMap(paddingEl, yPadding);
    if(!paddingValues) return;
    setupRulers(documentEl, ydoc, paddingValues);
    if(toggleViewRuler) {
      linealVert.style.display = linealVert.style.display === 'none' ? 'flex' : 'none';
      linealHorizontal.style.display = linealHorizontal.style.display === 'none' ? 'flex' : 'none';
      toggleViewRuler = false;
    }
  }