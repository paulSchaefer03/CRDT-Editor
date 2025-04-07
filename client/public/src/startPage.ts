import { ladeDokumente, ladeStationen } from './apiFunctions';
import { markiereAktivesDokument, zeigeLadeIndikator } from './navigation';

export async function initialisiereStartseite() {
  const stationsList = document.getElementById('stationsList')!;
  stationsList.innerHTML = '<p>Lade Stationen...</p>';

  const stationen = await ladeStationen();
  console.log("[Startseite] Stationen:", stationen);
  stationsList.innerHTML = '';


  for (const station of stationen) {
    const wrapper = document.createElement('div');
    const headline = document.createElement('h3');
    headline.textContent = station;
    wrapper.appendChild(headline);

    const liste = document.createElement('ul');
    const dokumente = await ladeDokumente(station);
    dokumente.forEach((doc) => {
      const eintrag = document.createElement('li');
      const btn = document.createElement('button');
      const docName = doc.replace('.bin', '');
      btn.textContent = docName;
      btn.addEventListener('click', () => {
        const fullName = `${station}/${docName}`;
        const url = `/editor/${station}/${docName}`;
        console.log("[Startseite] Navigiere zu:", url);
        markiereAktivesDokument(fullName);
        zeigeLadeIndikator('editorPage');
        history.pushState({}, '', url);
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
      eintrag.appendChild(btn);
      liste.appendChild(eintrag);
    });

    wrapper.appendChild(liste);
    stationsList.appendChild(wrapper);
  }
}