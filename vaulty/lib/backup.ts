// Portable, password-encrypted backups; neither the passphrase nor key is persisted.
const iterations = 600_000;
const maxBytes = 30_000_000;
const encoder = new TextEncoder();

export function toBase64(data: Uint8Array): string {
  let text = "";
  for (let i = 0; i < data.length; i += 8192) text += String.fromCharCode(...data.subarray(i, i + 8192));
  return btoa(text);
}

function fromBase64(text: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(text), c => c.charCodeAt(0));
}

async function deriveKey(password: string, salt: Uint8Array<ArrayBuffer>) {
  const material = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, material,
    { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

export async function encryptBackup(plaintext: string, password: string): Promise<string> {
  if (password.length < 12) throw new Error("Use a backup passphrase with at least 12 characters.");
  const bytes = encoder.encode(plaintext);
  if (bytes.length > 20_000_000) throw new Error("Workspace is too large to export.");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, bytes);
  return JSON.stringify({ format: "vaulty-backup", version: 1, kdf: "PBKDF2-SHA256", iterations,
    salt: toBase64(salt), iv: toBase64(iv), ciphertext: toBase64(new Uint8Array(ciphertext)) });
}

export async function decryptBackup(file: string, password: string): Promise<string> {
  if (file.length > maxBytes) throw new Error("Backup file is too large.");
  const data = JSON.parse(file);
  if (data.format !== "vaulty-backup" || data.version !== 1 || data.kdf !== "PBKDF2-SHA256" || data.iterations !== iterations ||
      typeof data.salt !== "string" || typeof data.iv !== "string" || typeof data.ciphertext !== "string") {
    throw new Error("Unsupported backup format.");
  }
  const salt = fromBase64(data.salt);
  const iv = fromBase64(data.iv);
  if (salt.length !== 16 || iv.length !== 12) throw new Error("Invalid backup file.");
  try {
    const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, await deriveKey(password, salt), fromBase64(data.ciphertext));
    return new TextDecoder("utf-8", { fatal: true }).decode(plaintext);
  } catch { throw new Error("Could not open this backup. Check the passphrase and file."); }
}
