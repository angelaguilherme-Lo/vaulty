import { Capacitor, registerPlugin, type PluginListenerHandle } from "@capacitor/core";

interface VaultyNativePlugin {
  addListener(event: "workspaceLocked", callback: () => void): Promise<PluginListenerHandle>;
  unlockWorkspace(): Promise<{ workspace: string | null; session: string }>;
  saveWorkspace(options: { workspace: string; session: string }): Promise<void>;
  lockWorkspace(): Promise<void>;
  requestNotifications(): Promise<{ granted: boolean }>;
  syncReminders(options: { reminders: { id: string; at: string }[] }): Promise<void>;
  exportFile(options: { name: string; base64: string }): Promise<void>;
  copyPassword(options: { value: string }): Promise<void>;
}

export const isIOS = () => Capacitor.getPlatform() === "ios";
export const VaultyNative = registerPlugin<VaultyNativePlugin>("VaultyNative");
