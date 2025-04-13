import { Editor } from '@tiptap/core';
import html2pdf from 'html2pdf.js';
import { applyInlineStylesToTable } from './exportStyleSheet';
import { setPadding } from './editor';
import * as Y from "yjs";
import { getAvailableFonts } from "./customExtensions/FontFamily";

const farben: { name: string; hex: string }[] = [
  { name: 'schwarz',      hex: '#000000' },
  { name: 'dunkelgrau-4', hex: '#434343' },
  { name: 'dunkelgrau-3', hex: '#666666' },
  { name: 'dunkelgrau-2', hex: '#999999' },
  { name: 'dunkelgrau-1', hex: '#b7b7b7' },
  { name: 'grau',         hex: '#cccccc' },
  { name: 'hellgrau-1',   hex: '#d9d9d9' },
  { name: 'hellgrau-2',   hex: '#efefef' },
  { name: 'hellgrau-3',   hex: '#f3f3f3' },
  { name: 'weiß',         hex: '#ffffff' },

  { name: 'beerenrot',    hex: '#980000' },
  { name: 'rot',          hex: '#ff0000' },
  { name: 'orange',       hex: '#ff9900' },
  { name: 'gelb',         hex: '#ffff00' },
  { name: 'grün',         hex: '#00ff00' },
  { name: 'cyan',         hex: '#00ffff' },
  { name: 'kornblumenblau',hex: '#4a86e8' },
  { name: 'blau',         hex: '#0000ff' },
  { name: 'lila',         hex: '#9900ff' },
  { name: 'magenta',      hex: '#ff00ff' },

  { name: 'helles-beerenrot-3',    hex: '#e6b8af' },
  { name: 'helles-rot-3',          hex: '#f4cccc' },
  { name: 'helles-orange-3',       hex: '#fce5cd' },
  { name: 'helles-gelb-3',         hex: '#fff2cc' },
  { name: 'helles-grün-3',         hex: '#d9ead3' },
  { name: 'helles-cyan-3',         hex: '#d0e0e3' },
  { name: 'helles-kornblumenblau-3',hex: '#c9daf8' },
  { name: 'helles-blau-3',         hex: '#cfe2f3' },
  { name: 'helles-lila-3',         hex: '#d9d2e9' },
  { name: 'helles-magenta-3',      hex: '#ead1dc' },

  { name: 'helles-beerenrot-2',    hex: '#dd7e6b' },
  { name: 'helles-rot-2',          hex: '#ea9999' },
  { name: 'helles-orange-2',       hex: '#f9cb9c' },
  { name: 'helles-gelb-2',         hex: '#ffe599' },
  { name: 'helles-grün-2',         hex: '#b6d7a8' },
  { name: 'helles-cyan-2',         hex: '#a2c4c9' },
  { name: 'helles-kornblumenblau-2',hex: '#a4c2f4' },
  { name: 'helles-blau-2',         hex: '#9fc5e8' },
  { name: 'helles-lila-2',         hex: '#b4a7d6' },
  { name: 'helles-magenta-2',      hex: '#d5a6bd' },

  { name: 'helles-beerenrot-1',    hex: '#cc4125' },
  { name: 'helles-rot-1',          hex: '#e06666' },
  { name: 'helles-orange-1',       hex: '#f6b26b' },
  { name: 'helles-gelb-1',         hex: '#ffd966' },
  { name: 'helles-grün-1',         hex: '#93c47d' },
  { name: 'helles-cyan-1',         hex: '#76a5af' },
  { name: 'helles-kornblumenblau-1',hex: '#6d9eeb' },
  { name: 'helles-blau-1',         hex: '#6fa8dc' },
  { name: 'helles-lila-1',         hex: '#8e7cc3' },
  { name: 'helles-magenta-1',      hex: '#c27ba0' },

  { name: 'dunkles-beerenrot-1',    hex: '#a61c00' },
  { name: 'dunkles-rot-1',          hex: '#cc0000' },
  { name: 'dunkles-orange-1',       hex: '#e69138' },
  { name: 'dunkles-gelb-1',         hex: '#f1c232' },
  { name: 'dunkles-grün-1',         hex: '#6aa84f' },
  { name: 'dunkles-cyan-1',         hex: '#45818e' },
  { name: 'dunkles-kornblumenblau-1',hex: '#3c78d8' },
  { name: 'dunkles-blau-1',         hex: '#3d85c6' },
  { name: 'dunkles-lila-1',         hex: '#674ea7' },
  { name: 'dunkles-magenta-1',      hex: '#a64d79' },

  { name: 'dunkles-beerenrot-2',    hex: '#85200c' },
  { name: 'dunkles-rot-2',          hex: '#990000' },
  { name: 'dunkles-orange-2',       hex: '#b45f06' },
  { name: 'dunkles-gelb-2',         hex: '#bf9000' },
  { name: 'dunkles-grün-2',         hex: '#38761d' },
  { name: 'dunkles-cyan-2',         hex: '#134f5c' },
  { name: 'dunkles-kornblumenblau-2',hex: '#1155cc' },
  { name: 'dunkles-blau-2',         hex: '#0b5394' },
  { name: 'dunkles-lila-2',         hex: '#351c75' },
  { name: 'dunkles-magenta-2',      hex: '#741b47' },

  { name: 'dunkles-beerenrot-3',    hex: '#5b0f00' },
  { name: 'dunkles-rot-3',          hex: '#660000' },
  { name: 'dunkles-orange-3',       hex: '#783f04' },
  { name: 'dunkles-gelb-3',         hex: '#7f6000' },
  { name: 'dunkles-grün-3',         hex: '#274e13' },
  { name: 'dunkles-cyan-3',         hex: '#0c343d' },
  { name: 'dunkles-kornblumenblau-3',hex: '#1c4587' },
  { name: 'dunkles-blau-3',         hex: '#073763' },
  { name: 'dunkles-lila-3',         hex: '#20124d' },
  { name: 'dunkles-magenta-3',      hex: '#4c1130' },

];

const tabellenAktionen: { name: string; cmd: (editor: Editor) => void }[] = [
  {
    name: 'Tabelle einfügen',
    cmd: (editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  { name: 'Spalte davor', cmd: (editor) => editor.chain().focus().addColumnBefore().run() },
  { name: 'Spalte danach', cmd: (editor) => editor.chain().focus().addColumnAfter().run() },
  { name: 'Spalte löschen', cmd: (editor) => editor.chain().focus().deleteColumn().run() },
  { name: 'Zeile davor', cmd: (editor) => editor.chain().focus().addRowBefore().run() },
  { name: 'Zeile danach', cmd: (editor) => editor.chain().focus().addRowAfter().run() },
  { name: 'Zeile löschen', cmd: (editor) => editor.chain().focus().deleteRow().run() },
  { name: 'Tabelle löschen', cmd: (editor) => editor.chain().focus().deleteTable().run() },
  { name: 'Zellen mergen', cmd: (editor) => editor.chain().focus().mergeCells().run() },
  { name: 'Zelle teilen', cmd: (editor) => editor.chain().focus().splitCell().run() },
  { name: 'Header-Spalte', cmd: (editor) => editor.chain().focus().toggleHeaderColumn().run() },
  { name: 'Header-Zeile', cmd: (editor) => editor.chain().focus().toggleHeaderRow().run() },
  { name: 'Header-Zelle', cmd: (editor) => editor.chain().focus().toggleHeaderCell().run() },
  { name: 'Merge/Split', cmd: (editor) => editor.chain().focus().mergeOrSplit().run() },
  { name: 'Fix Tabelle', cmd: (editor) => editor.chain().focus().fixTables().run() },
];

const textLayouts: { name: string; align: 'left' | 'right' | 'center' | 'justify' }[] = [
  { name: 'Linksbündig', align: 'left' },
  { name: 'Rechtsbündig', align: 'right' },
  { name: 'Zentriert', align: 'center' },
  { name: 'Blocksatz', align: 'justify' },
];

const schriftGroessen = ['8', '9', '10', '11', '12', '14', '18', '24', '30', '36', '48', '60', '72', '96'];

const schriftArten = getAvailableFonts();

const presets = [
  { name: 'Standard', top: 25, right: 20, bottom: 20, left: 20 },
  { name: 'Schmal', top: 12.7, right: 12.7, bottom: 12.7, left: 12.7 },
  { name: 'Breit', top: 50, right: 50, bottom: 50, left: 50 },
  { name: 'Druckfreundlich', top: 20, right: 15, bottom: 15, left: 15 },
];

const zeilenAbstaende = [
  { name: 'Einfach', value: '1' },
  { name: '1.5', value: '1.5' },
  { name: 'Doppelt', value: '2' },
  { name: 'Benutzerdefiniert', value: 'custom' },
];

const statefulButtons: { button: HTMLElement; update: () => void; }[] = [];



function createTextDropdown(options: string[], onChange: (value: string) => void, isFontDropDown?: boolean, defaultValue?: string, getCurrentFont?: () => string): HTMLElement {
  const select = document.createElement('select');
  select.className = 'btn text-select';

  if (isFontDropDown) {
    select.style.width = '150px';
    select.style.textOverflow = 'ellipsis';
    select.style.whiteSpace = 'nowrap';
    select.style.overflow = 'hidden';
  }

  options.forEach(val => {
    const opt = document.createElement('option');
    opt.value = val;
    opt.textContent = val;
    if(isFontDropDown) {
      opt.style.fontFamily = val;
    }
    select.appendChild(opt);
  });

  select.onchange = () => {
    onChange(select.value);
    if(isFontDropDown) {
      select.style.fontFamily = select.value;
    }
  };

  if(defaultValue) {
    select.value = defaultValue;
    onChange(defaultValue);
  }

  if(isFontDropDown && getCurrentFont) {
    registerInputField(select, getCurrentFont, true);
  }
  return select;
}

function createIconDropdown(
  iconPath: string,
  tooltip: string,
  entries: { label: string, action: () => void }[]
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'dropdown-color';
  wrapper.title = tooltip;

  const toggle = document.createElement('button');
  toggle.className = 'btn icon-table';

  const img = document.createElement('img');
  img.src = iconPath;
  img.alt = tooltip;
  img.className = 'icon-wrapper-table';
  toggle.appendChild(img);
  wrapper.appendChild(toggle);

  const menu = document.createElement('div');
  menu.className = 'color-menu';
  wrapper.appendChild(menu);

  entries.forEach(entry => {
    const btn = document.createElement('button');
    btn.className = 'btn text-option';
    btn.textContent = entry.label;
    btn.onclick = () => {
      entry.action();
      wrapper.classList.remove('open');
    };
    menu.appendChild(btn);
  });

  toggle.onclick = () => wrapper.classList.toggle('open');

  return wrapper;
}

function iconButton(iconPath: string, tooltip: string, handler: () => void, isActive?: () => boolean): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'btn icon-no-Color';
  btn.title = tooltip;

  const img = document.createElement('img');
  img.src = iconPath;
  img.alt = tooltip;
  img.className = 'icon-wrapper-no-Color';

  btn.appendChild(img);
  btn.onclick = () => {
    handler();
    updateActiveState(); // Zustand neu prüfen nach Klick
  };

  if (isActive) {
    statefulButtons.push({
      button: btn,
      update: () => {
        if (isActive()) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      }
    });
  }

  return btn;
}

function createTableInsertButton(editor: Editor): HTMLElement {
  const maxCols = 10;
  const maxRows = 8;



  const wrapper = document.createElement('div');
  wrapper.className = 'dropdown-table';

  const toggle = document.createElement('button');
  toggle.className = 'btn icon-table';
  toggle.title = 'Tabelle einfügen';

  const img = document.createElement('img');
  img.src = '/icons/other-icons/insert-table.svg';
  img.alt = 'Tabelle';
  img.className = 'icon-wrapper-table';
  toggle.appendChild(img);
  wrapper.appendChild(toggle);

  const gridContainer = document.createElement('div');
  gridContainer.className = 'table-grid-container';
  wrapper.appendChild(gridContainer);
  const grid = document.createElement('div');
  grid.className = 'table-grid';
  gridContainer.appendChild(grid);

  const sizeLabel = document.createElement('div');
  sizeLabel.className = 'table-size-label';
  sizeLabel.textContent = '0 × 0';
  gridContainer.appendChild(sizeLabel);


  const inputRow = document.createElement('div');
  inputRow.className = 'table-input-row';

  const rowsInput = document.createElement('input');
  rowsInput.className = 'input';
  rowsInput.type = 'number';
  rowsInput.placeholder = 'Zeilen';
  rowsInput.min = '1';
  rowsInput.value = maxRows.toString(); // Defaultwert für Zeilen

  const colsInput = document.createElement('input');
  colsInput.className = 'input';
  colsInput.type = 'number';
  colsInput.placeholder = 'Spalten';
  colsInput.min = '1';
  colsInput.value = maxCols.toString(); // Defaultwert für Spalten

  const insertBtn = document.createElement('button');
  insertBtn.className = 'btn-table';
  insertBtn.textContent = 'Einfügen';
  insertBtn.onclick = () => {
    const rows = parseInt(rowsInput.value);
    const cols = parseInt(colsInput.value);
    if (rows > 0 && cols > 0) {
      editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
      wrapper.classList.remove('open');
    }
  };

  inputRow.appendChild(colsInput);
  inputRow.appendChild(rowsInput);
  inputRow.appendChild(insertBtn);
  gridContainer.appendChild(inputRow);

  for (let r = 0; r < maxRows; r++) {
    for (let c = 0; c < maxCols; c++) {
      const cell = document.createElement('div');
      cell.className = 'table-cell';
      cell.dataset.col = (c + 1).toString();
      cell.dataset.row = (r + 1).toString();
      grid.appendChild(cell);

      cell.addEventListener('mouseenter', () => {
        highlightGrid(c + 1, r + 1);
        sizeLabel.textContent = `${c + 1} × ${r + 1}`;
        rowsInput.value = (r + 1).toString();
        colsInput.value = (c + 1).toString();
      });

      cell.addEventListener('click', () => {
        editor.chain().focus().insertTable({ rows: r + 1, cols: c + 1, withHeaderRow: false }).run();
        wrapper.classList.remove('open');
      });
    }
  }

  function highlightGrid(cols: number, rows: number) {
    const cells = grid.querySelectorAll('.table-cell');
    cells.forEach(cell => {
      const col = parseInt((cell as HTMLElement).dataset.col!);
      const row = parseInt((cell as HTMLElement).dataset.row!);
      cell.classList.toggle('selected', col <= cols && row <= rows);
    });
  }

  toggle.onclick = () => wrapper.classList.toggle('open');
  return wrapper;
}


function createFontSizeSelector(
  sizes: string[],
  onChange: (value: string) => void,
  defaultValue?: string,
  currentFontSize?: () => string
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'font-size-selector';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'font-size-input';
  input.placeholder = 'Größe';

  const minusBTN = iconButton('/icons/other-icons/minus.svg', 'Größe verringern', () => {
    const currentSize = parseInt(input.value) || 0;
    const newSize = Math.max(currentSize - 1, 0);
    input.value = newSize.toString();
    onChange(newSize.toString());
  });
  wrapper.appendChild(minusBTN);

  wrapper.appendChild(input);

  const dropdown = document.createElement('div');
  dropdown.className = 'font-size-dropdown';
  dropdown.style.display = 'none';
  wrapper.appendChild(dropdown);

  sizes.forEach(size => {
    const item = document.createElement('div');
    item.className = 'font-size-option';
    item.textContent = size;
    item.onclick = () => {
      input.value = size;
      onChange(size);
      dropdown.style.display = 'none';
    };
    dropdown.appendChild(item);
  });

  // ⌨️ Eingabe direkt
  input.onchange = () => {
    onChange(input.value);
  };

  input.onclick = () => {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  };

  // 🔽 Schließe das Dropdown bei Klick außerhalb
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target as Node)) {
      dropdown.style.display = 'none';
    }
  });

  const plusBTN = iconButton('/icons/other-icons/plus.svg', 'Größe erhöhen', () => {
    const currentSize = parseInt(input.value) || 0;
    const newSize = Math.min(currentSize + 1, 100); // Maximalgröße auf 100 begrenzen
    input.value = newSize.toString();
    onChange(newSize.toString());
  }
  );
  wrapper.appendChild(plusBTN);

  if(defaultValue) {
    input.value = defaultValue;
    onChange(defaultValue);
  }
  if(currentFontSize){
    registerInputField(input, currentFontSize, false);
  }

  return wrapper;
}


export function updateActiveState() {
  for (const { update } of statefulButtons) {
    update();
  }
}

export function registerColorIndicator(colorIndicator: HTMLElement, getCurrentColor: () => string) {
  statefulButtons.push({
    button: colorIndicator,
    update: () => {
      const hex = getCurrentColor();
      colorIndicator.style.backgroundColor = hex;
      if(hex === 'transparent') {
        colorIndicator.style.border = '1px solid #888';
      }else{
        colorIndicator.style.border = `1px solid ${hex}`;
      }
    }
  });
}

export function registerInputField(inputField: HTMLElement, getCurrentValue: () => string, fontFamilyInput?: boolean) {
  statefulButtons.push({
    button: inputField,
    update: () => {
      const value = getCurrentValue();
      if(inputField instanceof HTMLInputElement) {
        inputField.value = value;
      }
      else if(inputField instanceof HTMLSelectElement) {
        inputField.value = value;
        if(fontFamilyInput) {
          inputField.style.fontFamily = value;
        }
      }
    }
  });
}

export function createColorDropdownIndicatorTracker(
  colorIndicator: HTMLElement,
  getCurrentColor: () => string
) {
  registerColorIndicator(colorIndicator, getCurrentColor);
}

function applyMargins(top: number, right: number, bottom: number, left: number, ydoc: Y.Doc) {
  const paddingEl = document.getElementById('editor-padding')!;
  if (!paddingEl) return;
  paddingEl.style.paddingTop = `${top}mm`;
  paddingEl.style.paddingRight = `${right}mm`;
  paddingEl.style.paddingBottom = `${bottom}mm`;
  paddingEl.style.paddingLeft = `${left}mm`;

  const dpi = 96;
  const mmToPx = dpi / 2.54 / 10; // 1 cm = 10 mm

  setPadding('Top', top * mmToPx, ydoc);
  setPadding('Right', right * mmToPx, ydoc);
  setPadding('Bottom', bottom * mmToPx, ydoc);
  setPadding('Left', left * mmToPx, ydoc);
}

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

    if (isLandscape) {
      documentEl.style.width = '1123px';
      documentEl.style.height = '794px';
      orientationToggle.textContent = 'Hochformat';
    } else {
      documentEl.style.width = '794px';
      documentEl.style.height = '1123px';
      orientationToggle.textContent = 'Querformat';
    }
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

function createColorDropdown(svgPath: string, tooltip: string, onSelect: (color: string) => void, defaultColor: string, getCurrentColor: () => string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'dropdown-color';
  wrapper.title = tooltip;
  wrapper.style.position = 'relative';

  const toggle = document.createElement('button');
  toggle.className = 'btn icon';

  const iconWrapper = document.createElement('img');
  iconWrapper.className = 'icon-wrapper';
  iconWrapper.src = svgPath;
  iconWrapper.alt = tooltip;

  const colorIndicator = document.createElement('div');
  colorIndicator.className = 'color-indicator';

  toggle.appendChild(iconWrapper);
  toggle.appendChild(colorIndicator);
  wrapper.appendChild(toggle);

  const menu = document.createElement('div');
  menu.className = 'color-menu';
  wrapper.appendChild(menu);

  const standardRow = document.createElement('div');
  standardRow.className = 'color-default-row';

  const standardOption = document.createElement('div');
  standardOption.className = 'color-swatch';
  standardOption.style.background = defaultColor;
  colorIndicator.style.backgroundColor = defaultColor;
  colorIndicator.style.border = '1px solid transparent';
  if(defaultColor === 'transparent') {
    standardOption.title = 'Keine Farbe';
    standardOption.style.border = '1px solid #888';
    colorIndicator.style.border = '1px solid #888';
  }
  else{
    standardOption.title = 'Standardfarbe';
  }
  standardOption.onclick = () => {
    onSelect(defaultColor);
    colorIndicator.style.backgroundColor = defaultColor;
    if(defaultColor === 'transparent') {
      colorIndicator.style.border = '1px solid #888';
    }
    else {
      colorIndicator.style.border = '1px solid transparent';
    }
    wrapper.classList.remove('open');
  };

  const label = document.createElement('span');
  label.className = 'color-default-label';
  label.textContent = 'Standardfarbe';

  standardRow.appendChild(standardOption);
  standardRow.appendChild(label);
  menu.appendChild(standardRow); 


  const colorGrid = document.createElement('div');
  colorGrid.className = 'color-grid';

  farben.forEach(({ name, hex }) => {
    const colorBtn = document.createElement('div');
    colorBtn.className = 'color-swatch';
    colorBtn.style.backgroundColor = hex;
    colorBtn.title = name;

    colorBtn.onclick = () => {
      onSelect(hex);
      colorIndicator.style.backgroundColor = hex;
      colorIndicator.style.border = `1px solid ${hex}`;
      wrapper.classList.remove('open');
    };

    colorGrid.appendChild(colorBtn);
  });

  menu.appendChild(colorGrid);

  toggle.onclick = () => {
    wrapper.classList.toggle('open');
  };
  createColorDropdownIndicatorTracker(colorIndicator, getCurrentColor);


  return wrapper;
}




