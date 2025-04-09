import { Editor } from '@tiptap/core';
import { TableMap } from '@tiptap/pm/tables';

export function enforceTableMaxWidth(editor: Editor) {
  const view = editor.view;
  const state = view.state;
  const editorElement = document.getElementById('editor');
  const maxWidth = editorElement ? (editorElement.clientWidth - 1) : 793; // Default to DINA4 if not found

  const tr = state.tr;
  let changed = false;

  state.doc.descendants((node, pos) => {
    if (node.type.name === 'table') {
      const map = TableMap.get(node);
      const colWidths: number[] = [];

      // Step 1: Summiere Spaltenbreiten
      for (let i = 0; i < map.width; i++) {
        const cell = node.nodeAt(map.map[i]);
        const widthAttr = cell?.attrs?.colwidth?.[0] ?? 100;
        colWidths.push(widthAttr);
      }

      const total = colWidths.reduce((a, b) => a + b, 0);
    if (total > maxWidth) {
      const attrs = {
        ...node.attrs,
        overflow: false, // Remove the overflow flag
      };
      tr.setNodeMarkup(pos, undefined, attrs);
      changed = true;
        const scale = maxWidth / total;
        for (let row = 0; row < map.height; row++) {
          for (let col = 0; col < map.width; col++) {
            const index = row * map.width + col;
            const cellPos = map.map[index];
            const cell = node.nodeAt(cellPos);
            if (!cell) continue;

            const width = cell.attrs.colwidth?.[0] ?? 100;
            let newWidth = Math.floor(width * scale);
            if (col === map.width - 1) {
              const adjustedTotal = colWidths.slice(0, col).reduce((a, b) => a + Math.floor(b * scale), 0) + newWidth;
              const difference = maxWidth - adjustedTotal;
              newWidth += difference;
            }
            const attrs = {
              ...cell.attrs,
              colwidth: [newWidth],
            };
            tr.setNodeMarkup(pos + 1 + cellPos, undefined, attrs);
            changed = true;
          }
        }

        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          width: maxWidth,
        });
        changed = true;
      
    }
    }
  });

  if (changed) {
    view.dispatch(tr);
  }
}
