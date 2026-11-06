"use client";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";

export function VaultGate() {
  const { unlockVault, busy } = useAppStore();
  return <div className="panel rounded-3xl p-6"><p className="mb-4">Unlock your workspace to view credentials.</p><Button disabled={busy} onClick={() => void unlockVault()}>Unlock Vaulty</Button></div>;
}
