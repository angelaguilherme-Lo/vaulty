"use client";

import { Copy, Eye, EyeOff, Globe, LockKeyhole, LogOut, Trash2, UserRound } from "lucide-react";
import { isIOS, VaultyNative } from "@/lib/native";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";

export function VaultList() {
  const [message, setMessage] = useState("");
  const [visibleId, setVisibleId] = useState<string | null>(null);
  const { lockVault, vaultItems, deleteVaultItem } = useAppStore();

  return (
    <div className="space-y-4">
      <div className="gradient-border">
        <div className="glass flex flex-col gap-4 rounded-[30px] p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-[color:var(--text-muted)]">Vaulty password vault</p>
            <h2 className="text-title text-[color:var(--text)]">Protected credentials</h2>
          </div>

          <Button variant="danger" onClick={lockVault} className="gap-2">
            <LogOut className="h-4 w-4" />
            Lock vault
          </Button>
        </div>
      </div>

      {message ? <p role="status" className="text-sm">{message}</p> : null}
      {!vaultItems.length ? <p className="panel rounded-3xl p-5">No credentials yet. Add your first entry above.</p> : null}
      <div className="grid gap-4">
        {vaultItems.map((item) => {
          const shown = visibleId === item.id;

          return (
            <div key={item.id} className="panel card-hover rounded-[28px] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[image:var(--gradient-pink)] text-white">
                      <LockKeyhole className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-section text-[color:var(--text)]">{item.title}</h3>
                      <p className="text-sm text-[color:var(--text-muted)]">{item.category}</p>
                    </div>
                  </div>

                  <div className="grid gap-2 text-sm text-[color:var(--text-muted)]">
                    <div className="flex items-center gap-2">
                      <UserRound className="h-4 w-4" />
                      {item.username}
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {item.website}
                    </div>
                    <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-4 py-3 font-mono text-sm tracking-[0.08em] text-[color:var(--text)]">
                      {shown ? item.password : "••••••••••••••••"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setVisibleId(shown ? null : item.id)}
                    className="gap-2"
                  >
                    {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {shown ? "Hide" : "Show"}
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={async () => {
                      try {
                        if (isIOS()) await VaultyNative.copyPassword({ value: item.password });
                        else await navigator.clipboard.writeText(item.password);
                        setMessage("Copied. On iOS, this clipboard entry expires after one minute.");
                      } catch { setMessage("Could not copy. Try again."); }
                    }}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => { if (confirm("Delete this credential permanently?")) void deleteVaultItem(item.id); }}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}