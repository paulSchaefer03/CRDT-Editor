import { Editor } from '@tiptap/core';
import { getAvailableFonts } from "./customExtensions/FontFamily";

export const userCursorLogs = false; // true = logs aktivieren, false = logs deaktivieren
export const otherLogs = false; // true = logs aktivieren, false = logs deaktivieren

export const farben: { name: string; hex: string }[] = [
  { name: 'schwarz',      hex: '#000000' },
  { name: 'dunkelgrau-4', hex: '#434343' },
  { name: 'dunkelgrau-3', hex: '#666666' },
  { name: 'dunkelgrau-2', hex: '#999999' },
  { name: 'dunkelgrau-1', hex: '#b7b7b7' },
  { name: 'grau',         hex: '#cccccc' },
  { name: 'hellgrau-1',   hex: '#d9d9d9' },
  { name: 'hellgrau-2',   hex: '#efefef' },
  { name: 'hellgrau-3',   hex: '#f3f3f3' },
  { name: 'weiß',         hex: '#ffffff' },

  { name: 'beerenrot',    hex: '#980000' },
  { name: 'rot',          hex: '#ff0000' },
  { name: 'orange',       hex: '#ff9900' },
  { name: 'gelb',         hex: '#ffff00' },
  { name: 'grün',         hex: '#00ff00' },
  { name: 'cyan',         hex: '#00ffff' },
  { name: 'kornblumenblau',hex: '#4a86e8' },
  { name: 'blau',         hex: '#0000ff' },
  { name: 'lila',         hex: '#9900ff' },
  { name: 'magenta',      hex: '#ff00ff' },

  { name: 'helles-beerenrot-3',    hex: '#e6b8af' },
  { name: 'helles-rot-3',          hex: '#f4cccc' },
  { name: 'helles-orange-3',       hex: '#fce5cd' },
  { name: 'helles-gelb-3',         hex: '#fff2cc' },
  { name: 'helles-grün-3',         hex: '#d9ead3' },
  { name: 'helles-cyan-3',         hex: '#d0e0e3' },
  { name: 'helles-kornblumenblau-3',hex: '#c9daf8' },
  { name: 'helles-blau-3',         hex: '#cfe2f3' },
  { name: 'helles-lila-3',         hex: '#d9d2e9' },
  { name: 'helles-magenta-3',      hex: '#ead1dc' },

  { name: 'helles-beerenrot-2',    hex: '#dd7e6b' },
  { name: 'helles-rot-2',          hex: '#ea9999' },
  { name: 'helles-orange-2',       hex: '#f9cb9c' },
  { name: 'helles-gelb-2',         hex: '#ffe599' },
  { name: 'helles-grün-2',         hex: '#b6d7a8' },
  { name: 'helles-cyan-2',         hex: '#a2c4c9' },
  { name: 'helles-kornblumenblau-2',hex: '#a4c2f4' },
  { name: 'helles-blau-2',         hex: '#9fc5e8' },
  { name: 'helles-lila-2',         hex: '#b4a7d6' },
  { name: 'helles-magenta-2',      hex: '#d5a6bd' },

  { name: 'helles-beerenrot-1',    hex: '#cc4125' },
  { name: 'helles-rot-1',          hex: '#e06666' },
  { name: 'helles-orange-1',       hex: '#f6b26b' },
  { name: 'helles-gelb-1',         hex: '#ffd966' },
  { name: 'helles-grün-1',         hex: '#93c47d' },
  { name: 'helles-cyan-1',         hex: '#76a5af' },
  { name: 'helles-kornblumenblau-1',hex: '#6d9eeb' },
  { name: 'helles-blau-1',         hex: '#6fa8dc' },
  { name: 'helles-lila-1',         hex: '#8e7cc3' },
  { name: 'helles-magenta-1',      hex: '#c27ba0' },

  { name: 'dunkles-beerenrot-1',    hex: '#a61c00' },
  { name: 'dunkles-rot-1',          hex: '#cc0000' },
  { name: 'dunkles-orange-1',       hex: '#e69138' },
  { name: 'dunkles-gelb-1',         hex: '#f1c232' },
  { name: 'dunkles-grün-1',         hex: '#6aa84f' },
  { name: 'dunkles-cyan-1',         hex: '#45818e' },
  { name: 'dunkles-kornblumenblau-1',hex: '#3c78d8' },
  { name: 'dunkles-blau-1',         hex: '#3d85c6' },
  { name: 'dunkles-lila-1',         hex: '#674ea7' },
  { name: 'dunkles-magenta-1',      hex: '#a64d79' },

  { name: 'dunkles-beerenrot-2',    hex: '#85200c' },
  { name: 'dunkles-rot-2',          hex: '#990000' },
  { name: 'dunkles-orange-2',       hex: '#b45f06' },
  { name: 'dunkles-gelb-2',         hex: '#bf9000' },
  { name: 'dunkles-grün-2',         hex: '#38761d' },
  { name: 'dunkles-cyan-2',         hex: '#134f5c' },
  { name: 'dunkles-kornblumenblau-2',hex: '#1155cc' },
  { name: 'dunkles-blau-2',         hex: '#0b5394' },
  { name: 'dunkles-lila-2',         hex: '#351c75' },
  { name: 'dunkles-magenta-2',      hex: '#741b47' },

  { name: 'dunkles-beerenrot-3',    hex: '#5b0f00' },
  { name: 'dunkles-rot-3',          hex: '#660000' },
  { name: 'dunkles-orange-3',       hex: '#783f04' },
  { name: 'dunkles-gelb-3',         hex: '#7f6000' },
  { name: 'dunkles-grün-3',         hex: '#274e13' },
  { name: 'dunkles-cyan-3',         hex: '#0c343d' },
  { name: 'dunkles-kornblumenblau-3',hex: '#1c4587' },
  { name: 'dunkles-blau-3',         hex: '#073763' },
  { name: 'dunkles-lila-3',         hex: '#20124d' },
  { name: 'dunkles-magenta-3',      hex: '#4c1130' },

];

export const tabellenAktionen: { name: string; cmd: (editor: Editor) => void }[] = [
  {
    name: 'Tabelle einfügen',
    cmd: (editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  { name: 'Spalte davor', cmd: (editor) => editor.chain().focus().addColumnBefore().run() },
  { name: 'Spalte danach', cmd: (editor) => editor.chain().focus().addColumnAfter().run() },
  { name: 'Spalte löschen', cmd: (editor) => editor.chain().focus().deleteColumn().run() },
  { name: 'Zeile davor', cmd: (editor) => editor.chain().focus().addRowBefore().run() },
  { name: 'Zeile danach', cmd: (editor) => editor.chain().focus().addRowAfter().run() },
  { name: 'Zeile löschen', cmd: (editor) => editor.chain().focus().deleteRow().run() },
  { name: 'Tabelle löschen', cmd: (editor) => editor.chain().focus().deleteTable().run() },
  { name: 'Zellen mergen', cmd: (editor) => editor.chain().focus().mergeCells().run() },
  { name: 'Zelle teilen', cmd: (editor) => editor.chain().focus().splitCell().run() },
  { name: 'Header-Spalte', cmd: (editor) => editor.chain().focus().toggleHeaderColumn().run() },
  { name: 'Header-Zeile', cmd: (editor) => editor.chain().focus().toggleHeaderRow().run() },
  { name: 'Header-Zelle', cmd: (editor) => editor.chain().focus().toggleHeaderCell().run() },
  { name: 'Merge/Split', cmd: (editor) => editor.chain().focus().mergeOrSplit().run() },
  { name: 'Fix Tabelle', cmd: (editor) => editor.chain().focus().fixTables().run() },
];

export const textLayouts: { name: string; align: 'left' | 'right' | 'center' | 'justify' }[] = [
  { name: 'Linksbündig', align: 'left' },
  { name: 'Rechtsbündig', align: 'right' },
  { name: 'Zentriert', align: 'center' },
  { name: 'Blocksatz', align: 'justify' },
];

export const schriftGroessen = ['8', '9', '10', '11', '12', '14', '18', '24', '30', '36', '48', '60', '72', '96'];

export const schriftArten = getAvailableFonts();

export const presets = [
  { name: 'Standard', top: 25, right: 20, bottom: 20, left: 20 },
  { name: 'Schmal', top: 12.7, right: 12.7, bottom: 12.7, left: 12.7 },
  { name: 'Breit', top: 50, right: 50, bottom: 50, left: 50 },
  { name: 'Druckfreundlich', top: 20, right: 15, bottom: 15, left: 15 },
];

export const zeilenAbstaende = [
  { name: 'Einfach', value: '1' },
  { name: '1.5', value: '1.5' },
  { name: 'Doppelt', value: '2' },
  { name: 'Benutzerdefiniert', value: 'custom' },
];