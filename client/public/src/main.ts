import { initialisiereStartseite } from "./startPage";
import { initStationsFrontend } from "./stationsFrontend";
import { initialisiereNavigation } from "./navigation";
import { setupCRDTEditor } from "./editor";
import { zeigeEditorAnsicht, zeigeStartAnsicht } from "./navigation";

initialisiereNavigation();

function routeBasierendAufURL() {
  const path = window.location.pathname;

  if (path.startsWith('/editor/')) {
    const teile = path.split('/');
    const station = teile[2];
    const dokument = teile[3];

    if (station && dokument) {
      const dokumentName = `${station}/${dokument}`;
      const editorContainer = document.getElementById('editor')!;
      editorContainer.innerHTML = '';
      setupCRDTEditor(editorContainer, dokumentName);
      zeigeEditorAnsicht();
    }
  } else {
    zeigeStartAnsicht();
    initialisiereStartseite();
    initStationsFrontend();
  }
}

window.addEventListener('DOMContentLoaded', routeBasierendAufURL);
window.addEventListener('popstate', routeBasierendAufURL);

console.log("[Main] Initialisierung abgeschlossen.");