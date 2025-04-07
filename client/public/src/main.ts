import { setupCRDTEditor } from "./editor";

window.addEventListener("DOMContentLoaded", () => {
  const editorContainer = document.getElementById("editor");
  if (!editorContainer) {
    throw new Error("Editor-Container fehlt!");
  }

  setupCRDTEditor(editorContainer, "uebergabe-2025-04-06");
});
