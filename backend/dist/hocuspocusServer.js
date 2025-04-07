import { Server } from '@hocuspocus/server';
import * as fs from 'fs';
import * as path from 'path';
import * as Y from 'yjs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SPEICHERORT = path.resolve(__dirname, 'dokumente');
if (!fs.existsSync(SPEICHERORT))
    fs.mkdirSync(SPEICHERORT);
function erstelleInitialdokument() {
    const doc = new Y.Doc();
    const yxml = doc.getXmlFragment('prosemirror');
    const paragraph = new Y.XmlElement('paragraph');
    const text = new Y.XmlText();
    text.insert(0, 'Willkommen im neuen Dokument!');
    paragraph.push([text]);
    yxml.push([paragraph]);
    return doc;
}
const server = Server.configure({
    port: 3002,
    async onLoadDocument(data) {
        const pfad = path.join(SPEICHERORT, `${data.documentName}.bin`);
        if (fs.existsSync(pfad)) {
            const bin = fs.readFileSync(pfad);
            const doc = new Y.Doc();
            Y.applyUpdate(doc, bin);
            console.log(`[LOAD] ${data.documentName} geladen.`);
            return doc;
        }
        else {
            console.log(`[CREATE] Neues Dokument: ${data.documentName}`);
            return erstelleInitialdokument();
        }
    },
    async onStoreDocument(data) {
        const pfad = path.join(SPEICHERORT, `${data.documentName}.bin`);
        const update = Y.encodeStateAsUpdate(data.document);
        fs.writeFileSync(pfad, update);
        console.log(`[SAVE] ${data.documentName} gespeichert.`);
    },
});
server.listen();
console.log('🧠 Hocuspocus-CRDT-Server läuft auf ws://localhost:3002');
