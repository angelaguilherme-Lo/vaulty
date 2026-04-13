"use client";

import { Lock, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";

export function VaultGate() {
  const { pin, setPin, unlockVault } = useAppStore();

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    setPin(`${pin}${digit}`);
  };

  const removeDigit = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center">
      <div className="gradient-border w-full">
        <div className="glass w-full rounded-[34px] p-6 md:p-8">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[image:var(--gradient-main)] shadow-[0_16px_40px_rgba(91,108,255,0.28)]">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>

          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
              Vaulty secure vault
            </p>
            <h2 className="mt-2 text-title text-[color:var(--text)]">Enter 4-digit PIN</h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
              Your passwords and credentials stay behind this extra layer.
            </p>
          </div>

          <div className="my-6 flex justify-center gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`pin-dot ${pin[i] ? "filled" : ""}`} />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((key, idx) => (
              <button
                key={`${key}-${idx}`}
                onClick={() => {
                  if (!key) return;
                  if (key === "⌫") return removeDigit();
                  handleDigit(key);
                }}
                className="flex h-14 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] text-base text-[color:var(--text)] transition hover:scale-[1.02]"
              >
                {key}
              </button>
            ))}
          </div>

          <Button onClick={unlockVault} className="mt-4 w-full gap-2">
            <Lock className="h-4 w-4" />
            Unlock vault
          </Button>

          <p className="mt-3 text-center text-xs text-[color:var(--text-soft)]">
            Demo PIN: 1234
          </p>
        </div>
      </div>
    </div>
  );
}