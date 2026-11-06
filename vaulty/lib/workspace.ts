import type { NoteItem, ReminderItem, DocumentItem, VaultItem } from "./data";

export type Workspace = {
  version: 1;
  notes: NoteItem[];
  reminders: ReminderItem[];
  documents: DocumentItem[];
  vaultItems: VaultItem[];
  hasSeenOnboarding: boolean;
  notificationsEnabled: boolean;
};

export const emptyWorkspace = (): Workspace => ({
  version: 1, notes: [], reminders: [], documents: [], vaultItems: [],
  hasSeenOnboarding: false, notificationsEnabled: false,
});

export function validateWorkspace(value: unknown): Workspace {
  if (!value || typeof value !== "object") throw new Error("Invalid workspace file.");
  const data = value as Record<string, unknown>;
  const fields = {
    notes: ["id", "title", "body", "tag"],
    reminders: ["id", "title", "date", "time", "location", "priority"],
    documents: ["id", "name", "meta"],
    vaultItems: ["id", "title", "username", "password", "website", "category"],
  };
  if (data.version !== 1 || typeof data.hasSeenOnboarding !== "boolean" || typeof data.notificationsEnabled !== "boolean") {
    throw new Error("Unsupported workspace version.");
  }
  for (const [key, required] of Object.entries(fields)) {
    const items = data[key];
    if (!Array.isArray(items) || items.length > 10000) throw new Error("Invalid workspace entries.");
    const ids = new Set<string>();
    for (const item of items) {
      if (!item || typeof item !== "object" || required.some(field => typeof item[field] !== "string")) {
        throw new Error("Invalid workspace entry.");
      }
      if (!item.id || ids.has(item.id)) throw new Error("Duplicate or missing entry identifier.");
      ids.add(item.id);
      for (const [field, v] of Object.entries(item)) {
        if (typeof v !== "string" || v.length > 8_000_000) throw new Error("Invalid entry value.");
        if (key === "documents" && ![...required, "fileSize", "fileType", "fileName", "content", "base64"].includes(field)) {
          throw new Error("Unsupported document field.");
        }
      }
      if (key === "documents" && item.base64 && !/^[A-Za-z0-9+/]*={0,2}$/.test(item.base64)) {
        throw new Error("Invalid file contents.");
      }
    }
  }
  return {
    version: 1, notes: data.notes as NoteItem[], reminders: data.reminders as ReminderItem[],
    documents: data.documents as DocumentItem[], vaultItems: data.vaultItems as VaultItem[],
    hasSeenOnboarding: data.hasSeenOnboarding, notificationsEnabled: data.notificationsEnabled,
  };
}
