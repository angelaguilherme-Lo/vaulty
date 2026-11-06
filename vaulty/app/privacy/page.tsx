import Link from "next/link";

export default function PrivacyPage() {
  return <main className="unlock-screen"><article className="glass w-full max-w-2xl space-y-5 rounded-3xl p-7">
    <h1 className="text-title">Vaulty privacy policy</h1>
    <p>Local-only iOS release · November 6, 2026</p>
    <p>Vaulty stores your notes, credentials, reminders, and imported documents locally on your iPhone. The iOS workspace is encrypted and its key is protected by iOS Keychain and device authentication. Vaulty has no cloud account, analytics, advertising, or external AI service.</p>
    <p>Vaulty does not transmit your workspace to the developer. Local notifications show a generic message, keeping reminder details inside the app. Notification permission is optional and can be changed in iPhone Settings.</p>
    <p>Files you import are copied into your workspace. When you export a document, the selected file is shared with the destination you choose through iOS. Workspace backups are encrypted with a passphrase you choose. You control where you save and share them.</p>
    <p>Copied passwords are marked for local use and expire from the iOS clipboard after one minute. Other apps may be able to read a password while it is on the clipboard if you grant them access.</p>
    <p>You can delete individual entries inside Vaulty. Vaulty does not keep a trash or developer-side copy. Encrypted local workspace files are excluded from iCloud device backups. Keep your own encrypted export: removing the device passcode, losing the device, or deleting the app can make your data unrecoverable. Copies exported to other destinations remain until you delete them there.</p>
    <p>The browser preview keeps workspace entries in memory and clears them when locked or reloaded. Theme preference may be stored by your browser.</p>
    <p>Developer: Angela Guilherme. For support or privacy questions, use the <a className="underline" href="https://github.com/angelaguilherme-Lo/vaulty/issues" target="_blank" rel="noreferrer">Vaulty support tracker</a>. Do not include passwords, private notes, or documents in a public support request.</p>
    <Link className="inline-block underline" href="/">Back to Vaulty</Link>
  </article></main>;
}
