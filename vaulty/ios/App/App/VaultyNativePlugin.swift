import Capacitor
import CryptoKit
import Foundation
import LocalAuthentication
import Security
import UIKit
import UserNotifications

@objc(VaultyNativePlugin)
public class VaultyNativePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "VaultyNativePlugin"
    public let jsName = "VaultyNative"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "unlockWorkspace", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "saveWorkspace", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "lockWorkspace", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestNotifications", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "syncReminders", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "exportFile", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "copyPassword", returnType: CAPPluginReturnPromise)
    ]
    // Accessed exclusively on the main queue. Keys never cross the JavaScript bridge.
    private var key: SymmetricKey?
    private var session: String?
    private var context: LAContext?
    private var generation = 0
    private var authenticating = false
    private var observer: NSObjectProtocol?
    private var service: String { (Bundle.main.bundleIdentifier ?? "Vaulty") + ".workspace-key.v1" }
    private var keyQuery: [String: Any] {
        [kSecClass as String: kSecClassGenericPassword,
         kSecAttrService as String: service,
         kSecAttrAccount as String: "encryption-key"]
    }
    private func fileURL() throws -> URL {
        var directory = try FileManager.default.url(for: .applicationSupportDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
            .appendingPathComponent("Vaulty", isDirectory: true)
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true,
            attributes: [.protectionKey: FileProtectionType.complete])
        var values = URLResourceValues()
        values.isExcludedFromBackup = true
        try directory.setResourceValues(values)
        return directory.appendingPathComponent("workspace.vaulty")
    }
    public override func load() {
        observer = NotificationCenter.default.addObserver(forName: UIApplication.didEnterBackgroundNotification,
            object: nil, queue: .main) { [weak self] _ in self?.clearSession() }
        // Clean interrupted exports from previous runs.
        try? FileManager.default.removeItem(at: FileManager.default.temporaryDirectory.appendingPathComponent("VaultyExports"))
    }
    deinit { if let observer = observer { NotificationCenter.default.removeObserver(observer) } }
    private func clearSession() {
        generation += 1
        context?.invalidate()
        context = nil
        key = nil
        session = nil
        notifyListeners("workspaceLocked", data: [:])
    }
    @objc func unlockWorkspace(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard !self.authenticating else { call.reject("Authentication is already in progress."); return }
            self.authenticating = true
            let expectedGeneration = self.generation
            let context = LAContext()
            context.localizedCancelTitle = "Cancel"
            var error: NSError?
            guard context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &error) else {
                self.authenticating = false
                call.reject("Set an iPhone passcode in Settings before using Vaulty.")
                return
            }
            self.context = context
            context.evaluatePolicy(.deviceOwnerAuthentication, localizedReason: "Unlock your private Vaulty workspace") { success, _ in
                guard success else {
                    DispatchQueue.main.async { self.authenticating = false; call.reject("Authentication was cancelled or could not be completed.") }
                    return
                }
                // Keychain queries must not block the main thread while using authentication.
                DispatchQueue.global(qos: .userInitiated).async {
                    var query = self.keyQuery
                    query[kSecReturnData as String] = true
                    query[kSecUseAuthenticationContext as String] = context
                    var item: CFTypeRef?
                    let status = SecItemCopyMatching(query as CFDictionary, &item)
                    DispatchQueue.main.async {
                        defer { self.authenticating = false }
                        guard self.generation == expectedGeneration else { call.reject("Workspace locked. Please unlock again."); return }
                        do {
                            let url = try self.fileURL()
                            let data: Data
                            if status == errSecSuccess, let existing = item as? Data, existing.count == 32 {
                                data = existing
                            } else if status == errSecItemNotFound {
                                // Never replace a missing key when an encrypted workspace exists.
                                guard !FileManager.default.fileExists(atPath: url.path) else {
                                    call.reject("The device key is unavailable. Reinstall Vaulty and restore an encrypted backup to recover your data.")
                                    return
                                }
                                var bytes = Data(count: 32)
                                let result = bytes.withUnsafeMutableBytes { SecRandomCopyBytes(kSecRandomDefault, 32, $0.baseAddress!) }
                                guard result == errSecSuccess,
                                      let access = SecAccessControlCreateWithFlags(nil, kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly, .userPresence, nil) else {
                                    call.reject("Could not create a protected device key."); return
                                }
                                var create = self.keyQuery
                                create[kSecAttrAccessControl as String] = access
                                create[kSecValueData as String] = bytes
                                guard SecItemAdd(create as CFDictionary, nil) == errSecSuccess else { call.reject("Could not store the device key."); return }
                                data = bytes
                            } else { call.reject("The protected device key could not be accessed."); return }
                            let key = SymmetricKey(data: data)
                            var workspace: String?
                            if FileManager.default.fileExists(atPath: url.path) {
                                let attributes = try FileManager.default.attributesOfItem(atPath: url.path)
                                guard (attributes[.size] as? NSNumber)?.intValue ?? Int.max <= 20_000_100 else { throw VaultCrypto.CryptoError.tooLarge }
                                let plaintext = try VaultCrypto.open(Data(contentsOf: url), key: key)
                                guard let json = String(data: plaintext, encoding: .utf8) else { throw VaultCrypto.CryptoError.invalidFile }
                                workspace = json
                            }
                            self.key = key
                            self.session = UUID().uuidString
                            call.resolve(["workspace": workspace as Any? ?? NSNull(), "session": self.session!])
                        } catch {
                            self.clearSession()
                            call.reject("Could not open the encrypted workspace. Your stored file has not been changed.")
                        }
                    }
                }
            }
        }
    }
    @objc func saveWorkspace(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard let key = self.key, let session = self.session, call.getString("session") == session,
                  let workspace = call.getString("workspace"), let bytes = workspace.data(using: .utf8),
                  bytes.count <= 20_000_000 else { call.reject("Workspace is locked or too large."); return }
            do {
                _ = try JSONSerialization.jsonObject(with: bytes)
                let encrypted = try VaultCrypto.seal(bytes, key: key)
                try encrypted.write(to: self.fileURL(), options: [.atomic, .completeFileProtection])
                call.resolve()
            } catch { call.reject("Could not save the encrypted workspace. Try again before closing the app.") }
        }
    }
    @objc func lockWorkspace(_ call: CAPPluginCall) {
        DispatchQueue.main.async { self.clearSession(); call.resolve() }
    }
    @objc func requestNotifications(_ call: CAPPluginCall) {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { granted, _ in
            call.resolve(["granted": granted])
        }
    }
    @objc func syncReminders(_ call: CAPPluginCall) {
        let center = UNUserNotificationCenter.current()
        let entries = call.getArray("reminders", JSObject.self) ?? []
        center.getPendingNotificationRequests { pending in
            center.removePendingNotificationRequests(withIdentifiers: pending.filter { $0.identifier.hasPrefix("vaulty-") }.map(\.identifier))
            center.removeAllDeliveredNotifications()
            center.getNotificationSettings { settings in
                guard settings.authorizationStatus == .authorized || settings.authorizationStatus == .provisional else { call.resolve(); return }
                let formatter = ISO8601DateFormatter()
                formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
                let valid = entries.compactMap { entry -> (String, Date)? in
                    guard let id = entry["id"] as? String, let at = entry["at"] as? String,
                          let date = formatter.date(from: at), date > Date() else { return nil }
                    return (id, date)
                }.sorted { $0.1 < $1.1 }.prefix(60)
                let group = DispatchGroup()
                var failed = false
                let resultLock = NSLock()
                for (id, date) in valid {
                    let content = UNMutableNotificationContent()
                    content.title = "Vaulty reminder"
                    content.body = "Open Vaulty to view your reminder."
                    content.sound = .default
                    let components = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute], from: date)
                    let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: false)
                    group.enter()
                    center.add(UNNotificationRequest(identifier: "vaulty-" + id, content: content, trigger: trigger)) { error in
                        if error != nil { resultLock.lock(); failed = true; resultLock.unlock() }
                        group.leave()
                    }
                }
                group.notify(queue: .main) { if failed { call.reject("Could not schedule all reminders.") } else { call.resolve() } }
            }
        }
    }
    @objc func exportFile(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard self.key != nil, let name = call.getString("name"), let encoded = call.getString("base64"),
                  encoded.count <= 40_000_000, let bytes = Data(base64Encoded: encoded) else { call.reject("Could not export this file."); return }
            do {
                let directory = FileManager.default.temporaryDirectory.appendingPathComponent("VaultyExports", isDirectory: true)
                try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true,
                    attributes: [.protectionKey: FileProtectionType.complete])
                let safeName = URL(fileURLWithPath: name).lastPathComponent
                guard !safeName.isEmpty, safeName != ".", safeName != ".." else { call.reject("Invalid file name."); return }
                let url = directory.appendingPathComponent(UUID().uuidString + "-" + safeName)
                try bytes.write(to: url, options: [.atomic, .completeFileProtection])
                let share = UIActivityViewController(activityItems: [url], applicationActivities: nil)
                share.popoverPresentationController?.sourceView = self.bridge?.viewController?.view
                share.popoverPresentationController?.sourceRect = CGRect(x: 20, y: 20, width: 1, height: 1)
                share.completionWithItemsHandler = { _, _, _, _ in try? FileManager.default.removeItem(at: url) }
                guard let presenter = self.bridge?.viewController else { call.reject("Unable to open share sheet."); return }
                presenter.present(share, animated: true) { call.resolve() }
            } catch { call.reject("Could not prepare the file for export.") }
        }
    }
    @objc func copyPassword(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard self.key != nil, let value = call.getString("value") else { call.reject("Unlock Vaulty before copying."); return }
            UIPasteboard.general.setItems([[UIPasteboard.typeAutomatic: value]],
                options: [.localOnly: true, .expirationDate: Date().addingTimeInterval(60)])
            call.resolve()
        }
    }
}
