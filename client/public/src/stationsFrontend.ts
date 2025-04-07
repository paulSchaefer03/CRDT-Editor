import { setupCRDTEditor } from './editor';

const apiBase = 'http://localhost:3001';

async function ladeStationen(): Promise<string[]> {
  const res = await fetch(`${apiBase}/stationen`, {
    headers: {
      'Accept': 'application/json'
    },
    mode: 'cors'
  });
  return res.json();
}

async function ladeDokumente(station: string): Promise<string[]> {
  const res = await fetch(`${apiBase}/dokumente/${station}`, {
    headers: {
      'Accept': 'application/json'
    },
    mode: 'cors'
  });
  return res.json();
}

async function neuesDokument(station: string, name: string): Promise<void> {
  await fetch(`${apiBase}/dokumente/${station}/${name}`, {
    method: 'POST',
    mode: 'cors'
  });
}

async function neueStation(name: string): Promise<void> {
  await fetch(`${apiBase}/stationen/${name}`, {
    method: 'POST',
    mode: 'cors'
  });
}

function baueUI() {
  const stationSelect = document.getElementById('stationSelect') as HTMLSelectElement;
  const dokumentSelect = document.getElementById('dokumentSelect') as HTMLSelectElement;
  const editorContainer = document.getElementById('editor') as HTMLElement;
  const createBtn = document.getElementById('createBtn') as HTMLButtonElement;
  const dokumentInput = document.getElementById('dokumentName') as HTMLInputElement;
  const stationInput = document.getElementById('stationName') as HTMLInputElement;
  const stationBtn = document.getElementById('stationCreateBtn') as HTMLButtonElement;

  function aktualisiereStationen(selected?: string) {
    ladeStationen().then((stationen) => {
      stationSelect.innerHTML = '';
      stationen.forEach((name) => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        stationSelect.appendChild(option);
      });
      if (selected) stationSelect.value = selected;
      stationSelect.dispatchEvent(new Event('change'));
    });
  }

  aktualisiereStationen();

  stationSelect.addEventListener('change', () => {
    const station = stationSelect.value;
    ladeDokumente(station).then((dokumente) => {
      dokumentSelect.innerHTML = '';
      dokumente.forEach((doc) => {
        const option = document.createElement('option');
        option.value = doc;
        option.textContent = doc.replace('.bin', '');
        dokumentSelect.appendChild(option);
      });
    });
  });

  dokumentSelect.addEventListener('change', () => {
    const station = stationSelect.value;
    console.log("[Frontend] Dokument2:", dokumentSelect.value);
    const dokument = dokumentSelect.value.replace('.bin', '');
    const dokumentName = `${station}/${dokument}`;
    console.log("[Frontend] Öffne Dokument:", dokumentName);
    editorContainer.innerHTML = '';
    setupCRDTEditor(editorContainer, dokumentName);
  });

  createBtn.addEventListener('click', async () => {
    const station = stationSelect.value;
    const name = dokumentInput.value.trim();
    if (!name) return alert('Dokumentname eingeben!');
    console.log("[Frontend] Erstelle neues Dokument:", name, "in Station:", station);
  
    await neuesDokument(station, name);
  
    // Dokumentliste neu laden UND danach Auswahl setzen:
    const dokumente = await ladeDokumente(station);
    dokumentSelect.innerHTML = '';
    dokumente.forEach((doc) => {
      const option = document.createElement('option');
      option.value = doc;
      option.textContent = doc.replace('.bin', '');
      dokumentSelect.appendChild(option);
    });
  
    dokumentSelect.value = `${name}.bin`;
    console.log("[Frontend] Dokument1:", dokumentSelect.value);
    dokumentSelect.dispatchEvent(new Event('change'));
  });
  

  stationBtn.addEventListener('click', async () => {
    const name = stationInput.value.trim();
    if (!name) return alert('Stationsname eingeben!');
    await neueStation(name);
    aktualisiereStationen(name);
  });
}

window.addEventListener('DOMContentLoaded', baueUI);
