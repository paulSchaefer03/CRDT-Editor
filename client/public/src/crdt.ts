import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";

export function createCRDTProvider(docName: string) {
  const ydoc = new Y.Doc();
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