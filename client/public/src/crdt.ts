import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";

export function createCRDTProvider(docName: string) {
  const ydoc = new Y.Doc();
  console.log("[CRDT] Erstelle neues Y.Doc für:", docName);
  const provider = new HocuspocusProvider({
    url: "ws://localhost:3002",
    name: docName,
    document: ydoc,
  });

  const yXmlFragment = ydoc.getXmlFragment("prosemirror");

  provider.on("status", (event: any) => {
    console.log("[Hocuspocus] Status:", event.status);
  });

  return { ydoc, yXmlFragment, provider };
}

export function getSharedPaddingMap(ydoc: Y.Doc): Y.Map<string> {
  return ydoc.getMap("padding");
}

export function getSharedOrientationMap(ydoc: Y.Doc): Y.Map<string> {
  return ydoc.getMap("layout");
}

