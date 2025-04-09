
export function applyInlineStylesToTable(table: HTMLElement) {
    const tableStyle = getComputedStyle(table);
    table.style.border = tableStyle.border;
    table.style.borderCollapse = tableStyle.borderCollapse;
    table.style.width = tableStyle.width;
  
    const cells = table.querySelectorAll('td, th');
    cells.forEach((cell) => {
      const style = getComputedStyle(cell as HTMLElement);
      (cell as HTMLElement).style.border = style.border;
      (cell as HTMLElement).style.padding = style.padding;
      (cell as HTMLElement).style.backgroundColor = style.backgroundColor;
    });
  }
  