// Startseiten-Logik mit Benutzer- und Rollenkontext

import { getCurrentUser } from './userSession'; // später dynamisch ersetzen
import { getAllStations, getDocumentsForStation, getLatestDocuments } from './apiFunctions';

interface User {
  username: string;
  role: 'user' | 'editor' | 'admin' | 'emergency';
  access: string[]; // z.B. ['Station_A3b', 'Station_B7b'] oder ['*']
  emergencyAccessEnabled?: boolean;
}

async function renderStartPage() {
  const user: User = getCurrentUser();
  const allStations = await getAllStations();

  const visibleStations = user.access.includes('*') || user.role === 'emergency' && user.emergencyAccessEnabled
    ? allStations
    : allStations.filter(station => user.access.includes(station));

  // Schnellzugriff "Meine Station(en)"
  const mainContainer = document.getElementById('main');
  const mySection = document.createElement('section');
  mySection.innerHTML = `<h2>Meine Station(en)</h2>`;

  for (const station of visibleStations) {
    const docs = await getDocumentsForStation(station);
    const latestDoc = docs[0];

    const stationDiv = document.createElement('div');
    stationDiv.classList.add('station-box');
    stationDiv.innerHTML = `
      <h3>${station}</h3>
      <a href="/editor/${station}/${latestDoc?.id}">📝 ${latestDoc?.title || 'Kein Dokument vorhanden'}</a>
    `;
    mySection.appendChild(stationDiv);
  }

  // Abschnitt: Neueste Dokumente über alle Stationen
  const recentSection = document.createElement('section');
  recentSection.innerHTML = `<h2>Neuste Dokumente</h2>`;
  const latestDocs = await getLatestDocuments(user.access);

  const list = document.createElement('ul');
  for (const doc of latestDocs) {
    const li = document.createElement('li');
    li.innerHTML = `<a href="/editor/${doc.station}/${doc.id}">${doc.title} (${doc.modified})</a>`;
    list.appendChild(li);
  }
  recentSection.appendChild(list);

  mainContainer?.replaceChildren(mySection, recentSection);
}

renderStartPage();
