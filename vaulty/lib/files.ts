import { isIOS, VaultyNative } from "./native";
import { toBase64 } from "./backup";
import type { DocumentItem } from "./data";

export async function exportBytes(name: string, bytes: Uint8Array<ArrayBuffer>, type = "application/octet-stream") {
  if (isIOS()) { await VaultyNative.exportFile({ name, base64: toBase64(bytes) }); return; }
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportDocument(doc: DocumentItem) {
  const bytes = doc.base64 ? Uint8Array.from(atob(doc.base64), c => c.charCodeAt(0)) : new TextEncoder().encode(doc.content || doc.meta);
  await exportBytes(doc.fileName || `${doc.name}.txt`, bytes, doc.fileType || "text/plain");
}
