import Foundation
import CryptoKit

// Versioned authenticated encryption; key management stays in the native plugin.
enum VaultCrypto {
    private static let header = Data("VAULTY1".utf8)

    static func seal(_ plaintext: Data, key: SymmetricKey) throws -> Data {
        guard plaintext.count <= 20_000_000 else { throw CryptoError.tooLarge }
        let box = try AES.GCM.seal(plaintext, using: key, authenticating: header)
        guard let combined = box.combined else { throw CryptoError.invalidFile }
        return header + combined
    }

    static func open(_ encrypted: Data, key: SymmetricKey) throws -> Data {
        guard encrypted.count <= 20_000_100, encrypted.starts(with: header) else { throw CryptoError.invalidFile }
        let box = try AES.GCM.SealedBox(combined: encrypted.dropFirst(header.count))
        return try AES.GCM.open(box, using: key, authenticating: header)
    }

    enum CryptoError: Error { case invalidFile, tooLarge }
}
