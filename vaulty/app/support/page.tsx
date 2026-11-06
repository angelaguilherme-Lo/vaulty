import Link from "next/link";
export default function SupportPage() {
  return <main className="unlock-screen"><article className="glass w-full max-w-2xl space-y-5 rounded-3xl p-7">
    <h1 className="text-title">Vaulty help and recovery</h1>
    <p>Set a device passcode before using Vaulty. Unlock with Face ID, Touch ID, or your iPhone passcode. The workspace locks when the app goes into the background and after two minutes without interaction.</p>
    <p>In Settings, export an encrypted backup using a separate passphrase of at least 12 characters. Save it somewhere outside this device. To restore on another iPhone, install Vaulty, unlock the empty workspace, choose your backup in Settings, and enter its passphrase. Restoring replaces current entries.</p>
    <p>Vaulty has no account recovery or cloud copy. A forgotten backup passphrase cannot be recovered. If you remove your device passcode, the device encryption key may be deleted by iOS. Reinstall Vaulty and restore your encrypted backup if the local key becomes unavailable.</p>
    <p>Import documents up to 5 MB each. The workspace supports up to 20 MB of stored JSON, including encoded files. Use Export on a document to save or share the original file. Delete an entry only when you are sure; deletion is permanent within Vaulty.</p>
    <p>Enable optional notifications in Vaulty Settings and allow them in iPhone Settings. The next 60 future reminders are scheduled. Reopen Vaulty to refresh the schedule. Alerts contain a generic message; open the app to see details. Delivery is subject to iOS Focus and notification settings.</p>
    <p>Contact support through the <a className="underline" href="https://github.com/angelaguilherme-Lo/vaulty/issues" target="_blank" rel="noreferrer">Vaulty support tracker</a>. Do not post passwords or personal files. Developer: Angela Guilherme.</p>
    <div className="flex gap-5 underline"><Link href="/">Back to Vaulty</Link><Link href="/privacy">Privacy policy</Link></div>
  </article></main>;
}
