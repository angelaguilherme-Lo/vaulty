"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { type PluginListenerHandle } from "@capacitor/core";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { isIOS, VaultyNative } from "@/lib/native";
import { emptyWorkspace } from "@/lib/workspace";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";

const subscribe = () => () => {};

export function WorkspaceBoundary({ children }: { children: React.ReactNode }) {
  const { isVaultUnlocked, unlockVault, lockVault, busy, error } = useAppStore();
  const native = useSyncExternalStore(subscribe, isIOS, () => false);
  useEffect(() => {
    const handles: Promise<PluginListenerHandle>[] = [];
    if (isIOS()) {
      handles.push(VaultyNative.addListener("workspaceLocked", () => {
        useAppStore.setState({ ...emptyWorkspace(), isVaultUnlocked: false, session: null });
      }));
    }
    const lockOnHide = () => { if (!isIOS() && document.visibilityState === "hidden") lockVault(); };
    document.addEventListener("visibilitychange", lockOnHide);
    let lastActivity = Date.now();
    const activity = () => { lastActivity = Date.now(); };
    const interval = window.setInterval(() => {
      if (Date.now() - lastActivity > 120_000 && useAppStore.getState().isVaultUnlocked) lockVault();
    }, 5000);
    window.addEventListener("pointerdown", activity, { passive: true });
    window.addEventListener("keydown", activity);
    return () => {
      for (const handle of handles) void handle.then(h => h.remove());
      document.removeEventListener("visibilitychange", lockOnHide);
      window.removeEventListener("pointerdown", activity);
      window.removeEventListener("keydown", activity);
      window.clearInterval(interval);
    };
  }, [lockVault]);

  if (!isVaultUnlocked) return (
    <main className="unlock-screen">
      <div className="glass w-full max-w-md rounded-[32px] p-7">
        <ShieldCheck className="mb-5 h-12 w-12 text-[color:var(--primary)]" />
        <h1 className="text-title">Vaulty</h1>
        <p className="mt-3 text-lg">Your private workspace</p>
        <p className="my-5 text-sm leading-6 text-[color:var(--text-muted)]">
          {native ? "Unlock with Face ID, Touch ID, or your iPhone passcode. Your notes, reminders, files, and credentials stay on this device." : "This browser preview is temporary. Data is kept in memory and cleared when you lock or reload. Use the iOS app to save your workspace."}
        </p>
        <Button className="w-full gap-2" disabled={busy} onClick={() => void unlockVault()}>
          <LockKeyhole className="h-4 w-4" />
          {busy ? "Unlocking…" : native ? "Unlock Vaulty" : "Open temporary preview"}
        </Button>
        {error ? <p role="alert" className="mt-4 text-sm text-rose-500">{error}</p> : null}
        <p className="mt-5 text-xs leading-5 text-[color:var(--text-muted)]">Keep an encrypted backup. Removing your device passcode, deleting the app, or losing this device can make local data unrecoverable.</p>
        <div className="mt-5 flex gap-5 text-sm underline"><Link href="/privacy">Privacy</Link><Link href="/support">Help</Link></div>
      </div>
    </main>
  );
  return <>
    {!native ? <p className="preview-banner">Temporary browser preview — changes are not saved.</p> : null}
    {error ? <div className="status-banner" role="alert">{error}</div> : null}
    <fieldset disabled={busy} className="workspace-fieldset" aria-busy={busy}>{children}</fieldset>
    {busy ? <div className="saving-indicator" role="status">Saving…</div> : null}
  </>;
}
