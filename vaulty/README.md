# Vaulty for iPhone

A local-only private workspace for notes, reminders, documents, and credentials. Next.js exports the bundled interface; Capacitor provides the native iOS host.

This branch prepares a release candidate. Device security flows and a signed archive still need physical-device verification before App Store submission. See [release/APP-STORE.md](release/APP-STORE.md).

## Development

Requires Node.js 22+, Xcode 26+ with the iOS SDK, and an Apple developer signing team for distribution.

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run ios:sync
npm run ios:open
```

Open `ios/App/App.xcodeproj`, choose the App target and your signing team, then run on an iPhone. Bundle identifier: `com.angelaguilherme.vaulty`. Developer team: `8TUS2WRNGR`.

`npm run build` exports assets to `out/`. `npm run ios:sync` rebuilds and copies them to the native project. There is no web server inside the app. Browser preview entries are temporary and are cleared on lock/reload.

## Storage and authentication

`VaultyNativePlugin.swift` protects a 256-bit random workspace key in iOS Keychain with `WhenPasscodeSetThisDeviceOnly` and `userPresence`. Device authentication unlocks the key. AES-GCM encrypts the entire workspace in Application Support using a versioned authenticated header, atomic writes, complete file protection, and backup exclusion. The key stays in native code. Save operations are acknowledged only after the encrypted file is written. Backgrounding clears the native key/session; the UI drops decrypted workspace references and a native cover hides app-switcher snapshots. Inactivity locks after two minutes.

The device passcode is required. Removing it can invalidate the key. The app does not recover lost keys or forgotten backup passphrases. It does not import the old unencrypted browser demo store. No demo password entries ship in this branch.

## Backups and files

Portable backups use WebCrypto AES-256-GCM with PBKDF2-SHA256 (600,000 iterations), random salt and nonce, and a separate passphrase of at least 12 characters. Restore validates version, entries and duplicate IDs before replacing the workspace. Keep a backup outside the device. Imported files retain their exact bytes; each file is limited to 5 MB and the serialized workspace to 20 MB.

## Notifications and privacy

Optional local notifications carry a generic prompt without entry titles. The next 60 future reminders are scheduled. No cloud accounts, tracking, analytics, ads, external fonts, or remote AI. The offline guide consists of bundled tips. Privacy and support screens are bundled in the app. Review their contact information before release.

## Native cryptography checks

On macOS:

```sh
swiftc ios/App/App/VaultCrypto.swift native-tests/main.swift -o /tmp/vaulty-crypto-tests
/tmp/vaulty-crypto-tests
```

Automated tests and successful compilation do not replace physical-device security, accessibility, and recovery testing.
