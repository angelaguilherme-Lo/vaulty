# Vaulty 1.0.0 (2): reminder and navigation fixes

The first iPhone test found that the empty date control did not clearly identify itself. Reminders save correctly after choosing a date. The bottom navigation also floated over scrolling content.

## Changes

- Reminder fields now have persistent labels: Title (required), Date (required), Time, Location or list, and Priority.
- An empty date shows “Tap to choose a date.” Submitting without a date explains the problem beside the field and focuses it. Successful saves show “Reminder added.” Save failures remain next to the form.
- Time uses a native time picker rather than a short list of preset times.
- Mobile navigation occupies a separate layout row below the scroll area, with safe-area padding. All six tabs align consistently; the current tab has an accessibility state.
- The Guide shortcut is in the header. Its dialog is rendered outside animated page containers and stays within the viewport; it no longer floats above form controls.
- The mobile shell responds to visual viewport resizing. This still needs keyboard testing on the physical iPhone.
- Release builds clear generated Next.js assets before rebuilding. An incremental build reused older CSS during QA; the clean build and archived CSS were checked against the updated source.
- Build number is 2. The Info.plist records that non-exempt encryption is not used, matching the Apple-provided CryptoKit/WebCrypto implementation and the build 1 questionnaire answer.

## Completed checks

- TypeScript and ESLint pass.
- Eight automated tests pass: four encrypted-backup/schema checks and four reminder-store checks covering missing/past dates, valid save/delete, duplicate submits during saving, and locked-workspace writes.
- The production static export and Capacitor synchronization succeed.
- Browser interaction test: blank date gives a visible error; choosing a date with the native browser date picker saves the reminder and displays the saved entry and confirmation.
- Every navigation destination renders: Home, Notes, Alerts, Vault, Docs, Settings.
- Layout checks at 320×568, 393×852, 393×420, 736×414, and 1280×800 show no horizontal overflow or navigation/content overlap. At 393×852, the content ends at y=783 and the navigation starts at y=783.
- The Guide dialog fits inside a 393×852 viewport; it closes normally. Browser error/warning log is empty.

## Phone retest after uploading build 2

Install the new TestFlight build, use sample entries, and check that the date label is obvious before selecting anything. Submit without a date and confirm the error is visible. Then add a future reminder, scroll to the last saved entry, and verify all content is reachable above the navigation. Check typing, date/time pickers, Face ID relocking, reminder delivery, backup/restore, and device text-size settings.

The browser checks are not a claim that these physical-device flows have all passed. Build 2 must be uploaded from Xcode Organizer before the phone can receive this update.
