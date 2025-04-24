import { Editor } from '@tiptap/core';
import html2pdf from 'html2pdf.js';
import { applyInlineStylesToTable } from './exportStyleSheet';
import * as Y from "yjs";
import { setOrientation, updateOrientation, applyMargins } from "./utils";
import { tabellenAktionen, schriftGroessen, schriftArten, presets, zeilenAbstaende, textLayouts } from './globalConstants';
import {iconButton, createIconDropdown, createFontSizeSelector, createTableInsertButton, createTextDropdown, createColorDropdown} from './toolbarExtensions/createButtons';


export function erstelleToolbar(container: HTMLElement, editor: Editor, ydoc: Y.Doc) {
  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';

  const button = (label: string, handler: () => void) => {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = label;
    btn.onclick = handler;
    return btn;
  };

  toolbar.append(
    iconButton('/icons/other-icons/bold.svg', 'Bold', () => editor?.chain().focus().toggleBold().run(), () => editor.isActive('bold')),
    iconButton('/icons/other-icons/italic.svg', 'Italic', () => editor?.chain().focus().toggleItalic().run(), () => editor.isActive('italic')),
    iconButton('/icons/other-icons/underline.svg', 'Underline', () => editor?.chain().focus().toggleUnderline().run(), () => editor.isActive('underline'))
  );

  // 🎨 Farb-Dropdown
  toolbar.appendChild(createColorDropdown('/icons/font-icons/font-color-schwarz.svg', 
    'Schriftfarbe', 
    hex => editor.chain().focus().setColor(hex).run(), 
    '#000000',
    () => editor.getAttributes('textStyle').color || '#000000'));

  // 🖌️ Hintergrundfarbe-Dropdown
  toolbar.appendChild(createColorDropdown('/icons/highlight-icons/highlighter-marker-schwarz.svg', 
    'Hervorhebungsfarbe', 
    hex => editor.chain().focus().toggleHighlight({ color: hex }).run(), 
    'transparent', 
    () => editor.getAttributes('highlight').color || 'transparent'));


    // 🔤 Schriftart-Dropdown
  toolbar.appendChild(createTextDropdown(schriftArten, (value) => {
    editor.chain().focus().setFontFamily(value).run()}
    , true, 'Arial',
  () => editor.getAttributes('fontFamily').font || 'Arial'
  ));
 
  // 🔤 Schriftgrößen-Auswahl
  toolbar.appendChild(createFontSizeSelector(schriftGroessen, (value) => {
      editor.chain().focus().setFontSize(`${value}px`).run();
    }, '14',
  () => editor.getAttributes('fontSize').size?.replace('px', '') || '14'
  ));


  // 📊 Tabellen-Dropdown
  const tabDropdown = document.createElement('div');
  tabDropdown.className = 'btn';
  tabDropdown.textContent = 'Tabelle ▼';

  const tabMenu = document.createElement('div');
  tabMenu.style.display = 'none';
  tabMenu.style.position = 'absolute';
  tabMenu.style.background = '#fff';
  tabMenu.style.border = '1px solid #ccc';
  tabMenu.style.padding = '0.5rem';
  tabMenu.style.zIndex = '10';
  tabMenu.style.maxHeight = '300px';
  tabMenu.style.overflowY = 'auto';

  tabellenAktionen.forEach(({ name, cmd }) => {
    const btn = button(name, () => {
      cmd(editor);
      tabMenu.style.display = 'none';
    });
    tabMenu.appendChild(btn);
  });

  const tabWrap = document.createElement('div');
  tabWrap.style.position = 'relative';
  tabWrap.append(tabDropdown, tabMenu);
  tabDropdown.onclick = () => {
    tabMenu.style.display = tabMenu.style.display === 'none' ? 'block' : 'none';
  };
  toolbar.appendChild(tabWrap);
  
  const tableInsert = createTableInsertButton(editor);
  toolbar.appendChild(tableInsert);

  // 📐 Schriftlayout-Auswahl
  textLayouts.forEach(({ name, align }) => {
    const btn = iconButton(`/icons/other-icons/${align}.svg`, name, () => {
      editor.chain().focus().setTextAlign(align).run();
    }, () => editor.isActive({ textAlign: align }));
    toolbar.appendChild(btn);
  });


  toolbar.appendChild(createColorDropdown(
    '/icons/table-color/table-color-schwarz.svg', 
    'Tabellen Hintergrundfarbe', 
    hex => editor.chain().focus().updateAttributes('tableCell', { backgroundColor: hex }).run(), 
    'transparent', 
    () => editor.getAttributes('tableCell').backgroundColor || 'transparent'));


    // 📏 Zeilenabstand-Auswahl

    const spacingDropdown = createIconDropdown(
      '/icons/other-icons/spacing.svg', 'Zeilenabstand',
      zeilenAbstaende.map(({ name, value }) => ({
        label: name,
        action: () => {
          if (value === 'custom') {
            const custom = prompt('Benutzerdefiniert:', '1');
            if (custom) editor.chain().focus().setLineHeight(custom).run();
          } else {
            editor.chain().focus().setLineHeight(value).run();
          }
        }
      }))
    );
    toolbar.appendChild(spacingDropdown);
    
    
  // 📐 Seitenrand-Presets
  const randDropdown = createIconDropdown(
    '/icons/other-icons/padding.svg', 'Ausrichten und Einrücken',
    presets.map(({ name, top, right, bottom, left }) => ({
      label: name,
      action: () => applyMargins(top, right, bottom, left, ydoc)
    }))
  );
  toolbar.appendChild(randDropdown);


  // 🔄 Seitenorientierung umschalten
  const orientationDropdown = iconButton('/icons/other-icons/flip.svg', 'Seitenorientierung', () => {
    
    const documentEl = document.getElementById('document');
    if (!documentEl) return;
    let isLandscape = documentEl.style.width === '1123px';
    isLandscape = !isLandscape;
    setOrientation(isLandscape? "landscape" : "portrait", ydoc, true);
    updateOrientation(ydoc);//Only updates the rulers

  });

  toolbar.appendChild(orientationDropdown);

  // Lineal einblenden/Ausblenden
  const lineal = iconButton('/icons/other-icons/ruler.svg', 'Lineal Ein/Ausblenden', () => {
    const linealVert = document.getElementById('ruler-vertical');
    const linealHorizontal = document.getElementById('ruler-row-id');
    if (!linealVert || !linealHorizontal) return;
    linealVert.style.display = linealVert.style.display === 'none' ? 'flex' : 'none';
    linealHorizontal.style.display = linealHorizontal.style.display === 'none' ? 'flex' : 'none';
  }
  , () => {
    const linealVert = document.getElementById('ruler-vertical');
    const linealHorizontal = document.getElementById('ruler-row-id');
    if (!linealVert || !linealHorizontal) return false;
    return linealVert.style.display === 'flex' && linealHorizontal.style.display === 'flex';
  });


  toolbar.appendChild(lineal);


 // 🖨️ PDF-Export & Drucken (Querformat muss noch gefixt werden)
  const pdfExport = iconButton('/icons/other-icons/export.svg', 'PDF-Export', () => {
    const element = document.getElementById('document');
    if (!element) return;
    
    element.querySelectorAll('table').forEach((table) => {
      applyInlineStylesToTable(table as HTMLElement);
    });

    const opt = {
      margin: 0,
      filename: 'Dokument.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true },
      jsPDF: {
        unit: 'px',
        format: [element.offsetWidth, element.offsetHeight],
        orientation: 'portrait' as const,
      },
    };
    html2pdf().set(opt).from(element).save();

  });
  toolbar.appendChild(pdfExport);

  const printBtn = iconButton('/icons/other-icons/print.svg', 'Drucken', () => {
    window.print();
  });
  toolbar.appendChild(printBtn);


  // 🎯 Abschließend Toolbar anhängen
  container.innerHTML = '';
  container.appendChild(toolbar);
}
