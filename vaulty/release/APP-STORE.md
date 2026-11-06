# Vaulty 1.0 — release preparation

Status: build 1 was uploaded by the owner and is available in TestFlight. Its Apple-provided encryption questionnaire is saved, and the owner was invited to Vaulty Internal Testing. Build 2 contains reminder-form and navigation fixes, has completed browser/automated QA, and must be uploaded from Xcode Organizer. Public App Review submission is still pending.

- App Store name: Vaulty: Private Workspace (created and confirmed by the owner)
- App Store Connect ID: 6831593828
- App Store Connect: https://appstoreconnect.apple.com/apps/6831593828/distribution
- Subtitle: Your private workspace
- Primary language: English (U.S.)
- Category: Productivity; secondary Utilities
- Bundle identifier: com.angelaguilherme.vaulty
- SKU: vaulty-ios-001
- Version: 1.0.0; newest prepared build: 2; TestFlight currently has build 1
- Team: 8TUS2WRNGR
- Intended release: free, local-only, iPhone, iOS 15+

## Description draft

Keep your notes, reminders, documents, and credentials together in Vaulty.

Your iPhone workspace is encrypted and protected by Face ID, Touch ID, or your device passcode. Save ideas, organize documents, and keep credentials at hand without creating a cloud account.

• Capture notes and document references.
• Import real documents up to 5 MB each and export them with the iOS share sheet.
• Create dated reminders with optional private local notifications.
• Store and copy credentials; the iOS clipboard entry expires after one minute.
• Switch between light and dark appearance.
• Export a passphrase-encrypted backup and restore it on another iPhone.

Vaulty stores your workspace on this device. There is no automatic cloud sync or developer-managed recovery. Keep an encrypted backup outside your phone and remember its passphrase. Removing your device passcode, deleting the app, or losing the device can make local data unrecoverable.

## Review notes draft

No sign-in account is required. Set a device passcode before testing. Tap Unlock Vaulty and authenticate using device authentication. The initial workspace is empty. Skip or finish onboarding, then add notes, documents, reminders, and credentials. Optional notification permission is requested only from Settings. Notifications contain a generic message, not entry titles. The next 60 future reminders are scheduled. The app locks after backgrounding or two minutes of inactivity. Settings provides encrypted backup export and restore.

No subscriptions or purchases. No credential autofill extension. No external AI; the guide contains built-in offline tips.

## Items that must be finished before submission

- Confirm app name availability and intended pricing/territories with the owner.
- App record created with bundle ID com.angelaguilherme.vaulty. Version 1.0.0 description, keywords, support URL, review notes, subtitle and Productivity category are saved. Age rating is 4+. Data Not Collected privacy disclosure published with owner authorization. Manual release is selected.
- Build 1 upload completed through Xcode Organizer. Use the same process to upload the build 2 archive after reviewing release/BUILD-2-QA.md.
- Test on a physical iPhone: first key creation, Face ID and passcode fallback, cancellation, background/inactivity lock, restart persistence, save failures, real PDF export, encrypted backup export/restore to another installation, notification permission/revocation and delivery, and airplane mode.
- Complete accessibility review including VoiceOver, text sizes, and smaller screens.
- Supply screenshots captured from the actual iOS build at Apple's requested dimensions. The included browser preview is not an App Store screenshot.
- Privacy and support URLs saved using the public documents on codex/ios-release-preparation. Keep that branch available until these documents are merged and the URLs updated. Supply App Review contact details; confirm pricing/availability and content rights before submission.
- Age-rating and App Privacy questionnaires completed for this source: 4+ and Data Not Collected. Recheck these if the binary changes.
- Complete Apple's encryption/export-compliance questionnaire. The app uses AES-256-GCM in Apple CryptoKit and WebCrypto, and PBKDF2-SHA256 for backups. No export-compliance exemption has been asserted in Info.plist.
- Confirm current SDK/RC acceptance with App Store Connect before uploading. Installed Xcode reports 27.0 build 27A266a.
- Upload to TestFlight, review test results, and only then submit for review.

## Validation completed

- TypeScript, ESLint, static production export, and Capacitor asset synchronization.
- Next.js patched to 16.4.5 with matching eslint-config-next. Production dependency audit reports zero vulnerabilities; eight moderate development-tool findings remain.
- Automated encrypted-backup round-trip, binary file preservation in backups, wrong-passphrase rejection, tamper rejection, fresh randomness, and restore-schema checks.
- Native CryptoKit round-trip, ciphertext does not contain test plaintext, fresh nonces, wrong-key/tamper/format rejection.
- All native Swift files type-checked against the iOS SDK and Capacitor 8.6.0.
- Standalone project: unsigned arm64 iPhone build and signed Release archive succeeded using official Capacitor/Cordova xcframeworks, checked against upstream SHA-256 hashes.
- Browser preview: note creation, credential creation, route navigation, masked credentials, lock, and clearing temporary entries on lock.

## Environment limits

The normal SPM project cannot evaluate package manifests inside this automation sandbox (`sandbox-exec: sandbox_apply: Operation not permitted`). A standalone Xcode project with the same native source and official embedded frameworks is included to avoid package resolution. No system security settings were changed. CoreSimulatorService is inaccessible here, so native UI, device authentication, notifications, and share-sheet behavior are not runtime-verified.


Build 2 QA: [BUILD-2-QA.md](BUILD-2-QA.md).
