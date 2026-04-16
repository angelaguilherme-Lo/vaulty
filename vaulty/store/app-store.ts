"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  defaultDocuments,
  defaultNotes,
  defaultReminders,
  defaultVaultItems,
  type DocumentItem,
  type NoteItem,
  type ReminderItem,
  type VaultItem,
} from "@/lib/data";

type AppState = {
  pin: string;
  setPin: (value: string) => void;
  isVaultUnlocked: boolean;
  unlockVault: () => void;
  lockVault: () => void;

  notes: NoteItem[];
  reminders: ReminderItem[];
  documents: DocumentItem[];
  vaultItems: VaultItem[];

  addNote: (item: Omit<NoteItem, "id">) => void;
  deleteNote: (id: string) => void;

  addReminder: (item: Omit<ReminderItem, "id">) => void;
  deleteReminder: (id: string) => void;

  addDocument: (item: Omit<DocumentItem, "id">) => void;
  deleteDocument: (id: string) => void;

  addVaultItem: (item: Omit<VaultItem, "id">) => void;
  deleteVaultItem: (id: string) => void;

  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (value: boolean) => void;
};

const VAULT_PIN = "1234";
const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      pin: "",
      setPin: (value) => set({ pin: value }),
      isVaultUnlocked: false,
      unlockVault: () => {
        if (get().pin === VAULT_PIN) {
          set({ isVaultUnlocked: true });
        }
      },
      lockVault: () => set({ isVaultUnlocked: false, pin: "" }),

      notes: defaultNotes,
      reminders: defaultReminders,
      documents: defaultDocuments,
      vaultItems: defaultVaultItems,

      addNote: (item) =>
        set((state) => ({
          notes: [{ id: makeId(), ...item }, ...state.notes],
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((item) => item.id !== id),
        })),

      addReminder: (item) =>
        set((state) => ({
          reminders: [{ id: makeId(), ...item }, ...state.reminders],
        })),

      deleteReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((item) => item.id !== id),
        })),

      addDocument: (item) =>
        set((state) => ({
          documents: [{ id: makeId(), ...item }, ...state.documents],
        })),

      deleteDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((item) => item.id !== id),
        })),

      addVaultItem: (item) =>
        set((state) => ({
          vaultItems: [{ id: makeId(), ...item }, ...state.vaultItems],
        })),

      deleteVaultItem: (id) =>
        set((state) => ({
          vaultItems: state.vaultItems.filter((item) => item.id !== id),
        })),

      hasSeenOnboarding: false,
      setHasSeenOnboarding: (value: boolean) => set({ hasSeenOnboarding: value }),
    }),
    {
      name: "vaulty-demo-store-v6",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notes: state.notes,
        reminders: state.reminders,
        documents: state.documents,
        vaultItems: state.vaultItems,
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
    }
  )
);