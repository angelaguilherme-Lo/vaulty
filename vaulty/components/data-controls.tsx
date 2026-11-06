"use client";
import { useState } from "react";
import { encryptBackup, decryptBackup } from "@/lib/backup";
import { exportBytes } from "@/lib/files";
import { useAppStore, workspaceSnapshot } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DataControls() {
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const replaceWorkspace = useAppStore(s => s.replaceWorkspace);
  const run = async (restore: boolean) => {
    if (busy) return;
    setBusy(true); setMessage("");
    const session = useAppStore.getState().session;
    try {
      if (restore) {
        if (!file || !confirmed) throw new Error("Choose a backup and confirm replacement.");
        if (file.size > 30_000_000) throw new Error("Backup is too large.");
        const decrypted = await decryptBackup(await file.text(), password);
        if (useAppStore.getState().session !== session) throw new Error("Unlock your workspace and try again.");
        if (!await replaceWorkspace(JSON.parse(decrypted))) return;
        setMessage("Backup restored and saved on this device.");
      } else {
        const encrypted = await encryptBackup(JSON.stringify(workspaceSnapshot()), password);
        if (useAppStore.getState().session !== session) throw new Error("Unlock your workspace and try again.");
        await exportBytes(`Vaulty-${new Date().toISOString().slice(0, 10)}.vaultybackup`, new TextEncoder().encode(encrypted), "application/json");
        setMessage("Backup prepared. Save it somewhere you can access if this device is lost.");
      }
      setPassword("");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not process the backup."); }
    finally { setBusy(false); }
  };
  return <div className="space-y-4 text-sm">
    <p>Backups include all entries and files, encrypted with a separate passphrase. Keep the passphrase safe: Vaulty cannot recover it.</p>
    <Input aria-label="Backup passphrase" type="password" autoComplete="new-password" placeholder="Backup passphrase (12+ characters)" value={password} onChange={e => setPassword(e.target.value)} />
    <Button disabled={busy || password.length < 12} onClick={() => void run(false)}>{busy ? "Working…" : "Export encrypted backup"}</Button>
    <div className="border-t border-[color:var(--line)] pt-4 space-y-3">
      <label className="block">Restore a Vaulty backup<input aria-label="Backup file" className="mt-2 block w-full" type="file" accept=".vaultybackup,application/json" onChange={e => setFile(e.target.files?.[0] || null)} /></label>
      <label className="flex items-start gap-2"><input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} /><span>Replace this workspace with the backup. Current entries will be removed. Export a backup first to keep them.</span></label>
      <Button variant="danger" disabled={busy || !file || !confirmed || !password} onClick={() => void run(true)}>Restore and replace workspace</Button>
    </div>
    {message ? <p role="status">{message}</p> : null}
  </div>;
}
