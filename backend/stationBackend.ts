import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as Y from 'yjs';

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 3001;

const BASIS = path.resolve(__dirname, 'dokumente');

// Hilfsfunktion: Verzeichnisse rekursiv anlegen
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// GET /stationen – Liste aller Stationsordner
app.get('/stationen', (req: express.Request, res: express.Response) => {
  ensureDir(BASIS);
  const stationen = fs.readdirSync(BASIS).filter((f) =>
    fs.statSync(path.join(BASIS, f)).isDirectory()
  );
  res.json(stationen);
});

// GET /dokumente/:station – Liste aller Dokumente in einer Station
app.get('/dokumente/:station', (req: any, res: any) => {
  const { station } = req.params;
  const pfad = path.join(BASIS, station);
  if (!fs.existsSync(pfad)) return res.status(404).json({ error: 'Station nicht gefunden' });
  const dateien = fs.readdirSync(pfad).filter((f) => f.endsWith('.bin'));
  res.json(dateien);
});

// POST /dokumente/:station/:name – Neuen Dateieintrag vorbereiten
function erstelleInitialdokument(): Y.Doc {
    const doc = new Y.Doc();
    const yxml = doc.getXmlFragment('prosemirror');

    const paragraph = new Y.XmlElement('paragraph');
    const text = new Y.XmlText();
    text.insert(0, 'Willkommen im neuen Dokument!');
    paragraph.push([text]);
    yxml.push([paragraph]);

    return doc;
}

app.post('/dokumente/:station/:name', (req: any, res: any) => {
    const { station, name } = req.params;
    const ordner = path.join(BASIS, station);
    const datei = path.join(ordner, `${name}.bin`);

    console.log(`[POST] ${datei}`);
    ensureDir(ordner);
    if (fs.existsSync(datei)) return res.status(200).json({ info: 'Datei existiert bereits' });

    const doc = erstelleInitialdokument();
    const encodedDoc = Y.encodeStateAsUpdate(doc);
    fs.writeFileSync(datei, encodedDoc);
    res.status(201).json({ ok: true });
});

app.listen(port, () => {
  console.log(`📡 Station-API läuft auf http://localhost:${port}`);
});

app.post('/stationen/:name', (req: any, res: any) => {
    const ordner = path.join(BASIS, req.params.name);
    if (!fs.existsSync(ordner)) {
      fs.mkdirSync(ordner);
      return res.status(201).json({ ok: true });
    }
    res.status(200).json({ info: 'Station existiert bereits' });
});