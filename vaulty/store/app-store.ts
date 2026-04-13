"use client";

import { create } from "zustand";

type AppState = {
  pin: string;
  setPin: (value: string) => void;
  isVaultUnlocked: boolean;
  unlockVault: () => void;
  lockVault: () => void;
};

const VAULT_PIN = "1234";

export const useAppStore = create<AppState>((set, get) => ({
  pin: "",
  setPin: (value) => set({ pin: value }),
  isVaultUnlocked: false,
  unlockVault: () => {
    if (get().pin === VAULT_PIN) {
      set({ isVaultUnlocked: true });
    }
  },
  lockVault: () => set({ isVaultUnlocked: false, pin: "" }),
}));