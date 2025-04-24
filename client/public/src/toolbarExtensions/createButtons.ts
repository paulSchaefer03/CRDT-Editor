import { Editor } from '@tiptap/core';
import { farben } from '../globalConstants';

export const statefulButtons: { button: HTMLElement; update: () => void; }[] = [];

export function createTextDropdown(options: string[], onChange: (value: string) => void, isFontDropDown?: boolean, defaultValue?: string, getCurrentFont?: () => string): HTMLElement {
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

export function createIconDropdown(
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

export function iconButton(iconPath: string, tooltip: string, handler: () => void, isActive?: () => boolean): HTMLButtonElement {
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


export function createTableInsertButton(editor: Editor): HTMLElement {
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

export function createFontSizeSelector(
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

export function createColorDropdown(svgPath: string, tooltip: string, onSelect: (color: string) => void, defaultColor: string, getCurrentColor: () => string): HTMLElement {
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