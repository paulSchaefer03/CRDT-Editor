let currentLoader: HTMLElement | null = null;

export function zeigeStartAnsicht() {
    const start = document.getElementById('startPage')!;
    const editor = document.getElementById('editorPage')!;
    start.style.display = 'block';
    editor.style.display = 'none';
    markiereAktivesDokument(null);
}

export function zeigeEditorAnsicht() {
    const start = document.getElementById('startPage')!;
    const editor = document.getElementById('editorPage')!;
    start.style.display = 'none';
    editor.style.display = 'block';
} 

export function zeigeLadeIndikator(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const loader = document.createElement('div');
  loader.textContent = '⏳ Lade Editor...';
  loader.className = 'loader';
  loader.style.margin = '1rem 0';
  currentLoader = loader;
  container.appendChild(loader);
}

export function entferneLadeIndikator() {
  if (currentLoader && currentLoader.parentNode) {
    currentLoader.parentNode.removeChild(currentLoader);
    currentLoader = null;
  }
}

export function markiereAktivesDokument(id: string | null) {
  document.querySelectorAll('li button').forEach((btn) => {
    btn.classList.remove('active-doc');
    if (id && btn.textContent === id.split('/')[1]) {
      btn.classList.add('active-doc');
    }
  });
}

export function initialisiereNavigation() {
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
  }
}