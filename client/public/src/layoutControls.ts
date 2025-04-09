const widthSlider = document.getElementById('widthSlider') as HTMLInputElement;
const heightSlider = document.getElementById('heightSlider') as HTMLInputElement;
const orientationToggle = document.getElementById('orientationToggle') as HTMLButtonElement;
const documentEl = document.getElementById('document') as HTMLDivElement;

let isLandscape = false;

// Slider Steuerung
widthSlider.oninput = () => {
  documentEl.style.width = `${widthSlider.value}px`;
};

heightSlider.oninput = () => {
  documentEl.style.height = `${heightSlider.value}px`;
};

// Hoch-Querformat umschalten
orientationToggle.onclick = () => {
  isLandscape = !isLandscape;
  if (isLandscape) {
    documentEl.style.width = '1123px';
    documentEl.style.height = '794px';
    orientationToggle.textContent = 'Hochformat';
    widthSlider.value = '1123';
    heightSlider.value = '794';
  } else {
    documentEl.style.width = '794px';
    documentEl.style.height = '1123px';
    orientationToggle.textContent = 'Querformat';
    widthSlider.value = '794';
    heightSlider.value = '1123';
  }
};

export function initRulerControls() {
  const doc = document.getElementById('document');
  if (!doc) return;

  const handles = document.querySelectorAll('.ruler-handle');
  const lines = {
    left: document.getElementById('lineLeft')!,
    right: document.getElementById('lineRight')!,
    top: document.getElementById('lineTop')!,
    bottom: document.getElementById('lineBottom')!,
  };

  const labels = {
    left: document.getElementById('labelLeft')!,
    right: document.getElementById('labelRight')!,
    top: document.getElementById('labelTop')!,
    bottom: document.getElementById('labelBottom')!,
  };

  handles.forEach(handle => {
    handle.addEventListener('dragstart', (e) => {
      const dragEvent = e as DragEvent;
      dragEvent.dataTransfer?.setData('text/plain', (e.target as HTMLElement).className);
    });

    handle.addEventListener('drag', e => {
      const dragEvent = e as DragEvent;
      if (!dragEvent.clientX && !dragEvent.clientY) return;
      const rect = doc.getBoundingClientRect();

      const el = e.target as HTMLElement;
      const type = el.classList.contains('left') || el.classList.contains('right') ? 'horizontal' : 'vertical';
      const direction = el.classList.contains('left') ? 'left'
        : el.classList.contains('right') ? 'right'
        : el.classList.contains('top') ? 'top'
        : 'bottom';

      if (type === 'horizontal') {
        const x = dragEvent.clientX - rect.left;
        const offset = Math.max(0, Math.min(x, rect.width));
        lines[direction].style.left = `${offset}px`;
        lines[direction].style.opacity = '1';
        labels[direction].textContent = `${Math.round(offset * 0.264583)}mm`;
      } else {
        const y = dragEvent.clientY - rect.top;
        const offset = Math.max(0, Math.min(y, rect.height));
        lines[direction].style.top = `${offset}px`;
        lines[direction].style.opacity = '1';
        labels[direction].textContent = `${Math.round(offset * 0.264583)}mm`;
      }
    });

    handle.addEventListener('dragend', e => {
      const rect = doc.getBoundingClientRect();
      const dragEvent = e as DragEvent;

      const el = e.target as HTMLElement;
      const direction = el.classList.contains('left') ? 'left'
        : el.classList.contains('right') ? 'right'
        : el.classList.contains('top') ? 'top'
        : 'bottom';

      if (direction === 'left' || direction === 'right') {
        const x = dragEvent.clientX - rect.left;
        const offset = Math.max(0, Math.min(x, rect.width));
        if (direction === 'left') {
          doc.style.paddingLeft = `${offset}px`;
        } else {
          doc.style.paddingRight = `${rect.width - offset}px`;
        }
        lines[direction].style.opacity = '0';
      } else {
        const y = dragEvent.clientY - rect.top;
        const offset = Math.max(0, Math.min(y, rect.height));
        if (direction === 'top') {
          doc.style.paddingTop = `${offset}px`;
        } else {
          doc.style.paddingBottom = `${rect.height - offset}px`;
        }
        lines[direction].style.opacity = '0';
      }
    });
  });
}