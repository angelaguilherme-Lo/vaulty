"use client";

import { create } from "zustand";
import type { NoteItem, ReminderItem, DocumentItem, VaultItem } from "@/lib/data";
import { emptyWorkspace, validateWorkspace, type Workspace } from "@/lib/workspace";
import { isIOS, VaultyNative } from "@/lib/native";

type Result = Promise<boolean>;
type AppState = Workspace & {
  isVaultUnlocked: boolean; busy: boolean; error: string | null; session: string | null;
  unlockVault: () => Result; lockVault: () => void;
  addNote: (item: Omit<NoteItem, "id">) => Result;
  deleteNote: (id: string) => Result;
  addReminder: (item: Omit<ReminderItem, "id">) => Result;
  deleteReminder: (id: string) => Result;
  addDocument: (item: Omit<DocumentItem, "id">) => Result;
  deleteDocument: (id: string) => Result;
  addVaultItem: (item: Omit<VaultItem, "id">) => Result;
  deleteVaultItem: (id: string) => Result;
  setHasSeenOnboarding: (value: boolean) => Result;
  setNotifications: (enabled: boolean) => Result;
  replaceWorkspace: (value: unknown) => Result;
};

export function workspaceSnapshot(): Workspace {
  const s = useAppStore.getState();
  return { version: 1, notes: s.notes, reminders: s.reminders, documents: s.documents,
    vaultItems: s.vaultItems, hasSeenOnboarding: s.hasSeenOnboarding, notificationsEnabled: s.notificationsEnabled };
}

async function syncNotifications(workspace: Workspace) {
  if (!isIOS()) return;
  const reminders = workspace.notificationsEnabled ? workspace.reminders.map(r => ({ id: r.id, at: new Date(`${r.date}T${r.time}:00`).toISOString() })) : [];
  await VaultyNative.syncReminders({ reminders });
}

// Commit to native encrypted storage BEFORE reporting success in the interface.
async function commit(change: (s: Workspace) => Workspace): Result {
  const state = useAppStore.getState();
  if (!state.isVaultUnlocked || state.busy) return false;
  useAppStore.setState({ busy: true, error: null });
  try {
    const next = validateWorkspace(change(workspaceSnapshot()));
    const json = JSON.stringify(next);
    if (new TextEncoder().encode(json).length > 20_000_000) throw new Error("Workspace limit reached. Export a backup and remove unused files.");
    if (isIOS()) await VaultyNative.saveWorkspace({ workspace: json, session: state.session! });
    if (useAppStore.getState().session !== state.session || !useAppStore.getState().isVaultUnlocked) return false;
    useAppStore.setState({ ...next });
    try { await syncNotifications(next); } catch {
      useAppStore.setState({ error: "Saved, but alerts could not be updated. Open Settings and enable reminders again." });
    }
    return true;
  } catch (error) {
    if (useAppStore.getState().isVaultUnlocked) useAppStore.setState({ error: error instanceof Error ? error.message : "Could not save. Your changes were not stored." });
    return false;
  } finally { useAppStore.setState({ busy: false }); }
}

export const useAppStore = create<AppState>()((set, get) => ({
  ...emptyWorkspace(), isVaultUnlocked: false, busy: false, error: null, session: null,
  unlockVault: async () => {
    if (get().busy) return false;
    set({ busy: true, error: null });
    try {
      if (!isIOS()) { set({ ...emptyWorkspace(), isVaultUnlocked: true, session: crypto.randomUUID() }); return true; }
      const result = await VaultyNative.unlockWorkspace();
      const workspace = result.workspace ? validateWorkspace(JSON.parse(result.workspace)) : emptyWorkspace();
      set({ ...workspace, isVaultUnlocked: true, session: result.session });
      await syncNotifications(workspace).catch(() => set({ error: "Could not refresh reminder notifications." }));
      return true;
    } catch (error) {
      await VaultyNative.lockWorkspace().catch(() => {});
      set({ error: error instanceof Error ? error.message : "Could not unlock. Please try again." });
      return false;
    } finally { set({ busy: false }); }
  },
  lockVault: () => {
    set({ ...emptyWorkspace(), isVaultUnlocked: false, session: null, error: null });
    if (isIOS()) void VaultyNative.lockWorkspace().catch(() => {});
  },
  addNote: item => commit(s => ({ ...s, notes: [{ ...item, id: crypto.randomUUID() }, ...s.notes] })),
  deleteNote: id => commit(s => ({ ...s, notes: s.notes.filter(item => item.id !== id) })),
  addReminder: item => commit(s => {
    if (!Number.isFinite(new Date(`${item.date}T${item.time}:00`).getTime()) || new Date(`${item.date}T${item.time}:00`).getTime() <= Date.now()) throw new Error("Choose a reminder time in the future.");
    return { ...s, reminders: [{ ...item, id: crypto.randomUUID() }, ...s.reminders] };
  }),
  deleteReminder: id => commit(s => ({ ...s, reminders: s.reminders.filter(item => item.id !== id) })),
  addDocument: item => commit(s => ({ ...s, documents: [{ ...item, id: crypto.randomUUID() }, ...s.documents] })),
  deleteDocument: id => commit(s => ({ ...s, documents: s.documents.filter(item => item.id !== id) })),
  addVaultItem: item => commit(s => ({ ...s, vaultItems: [{ ...item, id: crypto.randomUUID() }, ...s.vaultItems] })),
  deleteVaultItem: id => commit(s => ({ ...s, vaultItems: s.vaultItems.filter(item => item.id !== id) })),
  setHasSeenOnboarding: value => commit(s => ({ ...s, hasSeenOnboarding: value })),
  setNotifications: async enabled => {
    if (enabled && isIOS()) {
      try {
        if (!(await VaultyNative.requestNotifications()).granted) {
          set({ error: "Notifications are off. Enable them for Vaulty in iPhone Settings." }); return false;
        }
      } catch { set({ error: "Could not request notification permission." }); return false; }
    }
    return commit(s => ({ ...s, notificationsEnabled: enabled }));
  },
  replaceWorkspace: value => commit(() => validateWorkspace(value)),
}));
