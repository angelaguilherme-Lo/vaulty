import Foundation
import CryptoKit

func expectFailure(_ body: () throws -> Void) {
    do { try body(); fatalError("Expected authentication failure") } catch { }
}
let key = SymmetricKey(size: .bits256)
let message = Data("sensitive workspace with a PDF and a password".utf8)
let encrypted = try VaultCrypto.seal(message, key: key)
let decrypted = try VaultCrypto.open(encrypted, key: key)
precondition(decrypted == message)
precondition(encrypted.range(of: message) == nil)
let another = try VaultCrypto.seal(message, key: key)
precondition(another != encrypted)
expectFailure { _ = try VaultCrypto.open(encrypted, key: SymmetricKey(size: .bits256)) }
var tampered = encrypted
tampered[tampered.count - 1] ^= 1
expectFailure { _ = try VaultCrypto.open(tampered, key: key) }
expectFailure { _ = try VaultCrypto.open(Data("not-a-vault".utf8), key: key) }
print("PASS: native AES-GCM round trip, no plaintext, unique nonces, wrong-key, tamper and format rejection")
