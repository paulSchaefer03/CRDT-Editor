import { Editor } from '@tiptap/core';

const farben: { name: string; hex: string }[] = [
  { name: 'Rot', hex: '#ef4444' },
  { name: 'Grün', hex: '#10b981' },
  { name: 'Blau', hex: '#3b82f6' },
  { name: 'Grau', hex: '#6b7280' },
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

const textLayouts: { name: string; align: 'left' | 'right' | 'center' }[] = [
  { name: 'Linksbündig', align: 'left' },
  { name: 'Rechtsbündig', align: 'right' },
  { name: 'Zentriert', align: 'center' },
];

const schriftGroessen = ['10', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '60', '72', '96'];

const schriftArten = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];

export function erstelleToolbar(container: HTMLElement, editor: Editor) {
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
    button('Bold', () => editor?.chain().focus().toggleBold().run()),
    button('Italic', () => editor?.chain().focus().toggleItalic().run()),
    button('Underline', () => editor?.chain().focus().toggleUnderline().run())
  );

  // 🎨 Schriftart-Auswahl
  const fontSelect = document.createElement('select');
  schriftArten.forEach((font) => {
    const option = document.createElement('option');
    option.value = font;
    option.textContent = font;
    fontSelect.appendChild(option);
  });

  fontSelect.onchange = () => {
    editor.chain().focus().setFontFamily(fontSelect.value).run();
  };

  const zeilenAbstaende = [
    { name: 'Einfach', value: '1' },
    { name: '1.5', value: '1.5' },
    { name: 'Doppelt', value: '2' },
    { name: 'Benutzerdefiniert', value: 'custom' },
  ];

  toolbar.appendChild(fontSelect);

  // 🔤 Schriftgrößen-Auswahl
  const sizeWrap = document.createElement('div');
  sizeWrap.style.display = 'inline-flex';
  sizeWrap.style.alignItems = 'center';
  sizeWrap.style.gap = '4px';

  const sizeInput = document.createElement('input');
  sizeInput.type = 'number';
  sizeInput.value = '14';
  sizeInput.style.width = '50px';

  const updateSize = (delta = 0) => {
    const newSize = parseInt(sizeInput.value) + delta;
    sizeInput.value = newSize.toString();
    editor.chain().focus().setFontSize(`${newSize}px`).run();
  };

  sizeWrap.append(
    button('-', () => updateSize(-1)),
    sizeInput,
    button('+', () => updateSize(1))
  );

  sizeInput.onchange = () => updateSize();

  toolbar.appendChild(sizeWrap);

  // 🎨 Farb-Dropdown
  const farbDropdown = document.createElement('div');
  farbDropdown.className = 'btn';
  farbDropdown.textContent = 'Farbe ▼';

  const farbMenu = document.createElement('div');
  farbMenu.style.display = 'none';
  farbMenu.style.position = 'absolute';
  farbMenu.style.background = '#fff';
  farbMenu.style.border = '1px solid #ccc';
  farbMenu.style.padding = '0.5rem';
  farbMenu.style.zIndex = '10';

  farben.forEach(({ name, hex }) => {
    const btn = button(name, () => {
      editor?.chain().focus().setColor(hex).run();
      farbMenu.style.display = 'none';
    });
    btn.style.background = hex;
    farbMenu.appendChild(btn);
  });

  const farbWrap = document.createElement('div');
  farbWrap.style.position = 'relative';
  farbWrap.append(farbDropdown, farbMenu);
  farbDropdown.onclick = () => {
    farbMenu.style.display = farbMenu.style.display === 'none' ? 'block' : 'none';
  };
  toolbar.appendChild(farbWrap);

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

  const layoutDropdown = document.createElement('div');
  layoutDropdown.className = 'btn';
  layoutDropdown.textContent = 'Layout ▼';

  const layoutMenu = document.createElement('div');
  layoutMenu.style.display = 'none';
  layoutMenu.style.position = 'absolute';
  layoutMenu.style.background = '#fff';
  layoutMenu.style.border = '1px solid #ccc';
  layoutMenu.style.padding = '0.5rem';
  layoutMenu.style.zIndex = '10';

  textLayouts.forEach(({ name, align }) => {
    const btn = button(name, () => {
      editor.chain().focus().setTextAlign(align).run();
      layoutMenu.style.display = 'none';
    });
    layoutMenu.appendChild(btn);
  });

  const layoutWrap = document.createElement('div');
  layoutWrap.style.position = 'relative';
  layoutWrap.append(layoutDropdown, layoutMenu);
  layoutDropdown.onclick = () => {
    layoutMenu.style.display = layoutMenu.style.display === 'none' ? 'block' : 'none';
  };
  toolbar.appendChild(layoutWrap);

  // 🖌️ Hintergrundfarbe-Dropdown
  const highlightDropdown = document.createElement('div');
  highlightDropdown.className = 'btn';
  highlightDropdown.textContent = 'Highlight ▼';

  const highlightMenu = document.createElement('div');
  highlightMenu.style.display = 'none';
  highlightMenu.style.position = 'absolute';
  highlightMenu.style.background = '#fff';
  highlightMenu.style.border = '1px solid #ccc';
  highlightMenu.style.padding = '0.5rem';
  highlightMenu.style.zIndex = '10';

  farben.forEach(({ name, hex }) => {
    const btn = button(name, () => {
      editor.chain().focus().toggleHighlight({ color: hex }).run();
      highlightMenu.style.display = 'none';
    });
    btn.style.background = hex;
    highlightMenu.appendChild(btn);
  });

  const highlightWrap = document.createElement('div');
  highlightWrap.style.position = 'relative';
  highlightWrap.append(highlightDropdown, highlightMenu);
  highlightDropdown.onclick = () => {
    highlightMenu.style.display = highlightMenu.style.display === 'none' ? 'block' : 'none';
  };
  toolbar.appendChild(highlightWrap);

    // 🖌️ Tabellenzellen-Hintergrundfarbe-Dropdown
    const cellBgDropdown = document.createElement('div');
    cellBgDropdown.className = 'btn';
    cellBgDropdown.textContent = 'Zellenfarbe ▼';
  
    const cellBgMenu = document.createElement('div');
    cellBgMenu.style.display = 'none';
    cellBgMenu.style.position = 'absolute';
    cellBgMenu.style.background = '#fff';
    cellBgMenu.style.border = '1px solid #ccc';
    cellBgMenu.style.padding = '0.5rem';
    cellBgMenu.style.zIndex = '10';
  
    farben.forEach(({ name, hex }) => {
      const btn = button(name, () => {
        editor.chain().focus().updateAttributes('tableCell', { backgroundColor: hex }).run();
        cellBgMenu.style.display = 'none';
      });
      btn.style.background = hex;
      cellBgMenu.appendChild(btn);
    });
  
    const cellBgWrap = document.createElement('div');
    cellBgWrap.style.position = 'relative';
    cellBgWrap.append(cellBgDropdown, cellBgMenu);
    cellBgDropdown.onclick = () => {
      cellBgMenu.style.display = cellBgMenu.style.display === 'none' ? 'block' : 'none';
    };
    toolbar.appendChild(cellBgWrap);

    // 📏 Zeilenabstand-Auswahl
    const spacingSelect = document.createElement('select');
    zeilenAbstaende.forEach((option) => {
      const opt = document.createElement('option');
      opt.value = option.value;
      opt.textContent = option.name;
      spacingSelect.appendChild(opt);
    });
  
    spacingSelect.onchange = () => {
      const value = spacingSelect.value;
      if (value === 'custom') {
        const customValue = prompt('Bitte Zeilenabstand eingeben:', '1');
        if (customValue) editor.chain().focus().setLineHeight(customValue).run();
      } else {
        editor.chain().focus().setLineHeight(value).run();
      }
    };
  
    toolbar.appendChild(spacingSelect);
  
  // 🎯 Abschließend Toolbar anhängen
  container.innerHTML = '';
  container.appendChild(toolbar);
}
  