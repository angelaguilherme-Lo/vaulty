import test from "node:test";
import assert from "node:assert/strict";
import { encryptBackup, decryptBackup } from "../lib/backup";
import { emptyWorkspace, validateWorkspace } from "../lib/workspace";

const passphrase = "a strong backup passphrase";

test("encrypted backups round-trip binary document data without leaking secrets", async () => {
  const workspace = emptyWorkspace();
  workspace.vaultItems = [{ id: "1", title: "Personal", password: "TEST_SECRET_not_real", username: "private", website: "example.com", category: "Personal" }];
  workspace.documents = [{ id: "2", name: "file.pdf", meta: "test", base64: "AAECA//+", fileType: "application/pdf" }];
  const json = JSON.stringify(workspace);
  const encrypted = await encryptBackup(json, passphrase);
  assert.ok(!encrypted.includes("TEST_SECRET_not_real"));
  assert.deepEqual(validateWorkspace(JSON.parse(await decryptBackup(encrypted, passphrase))), workspace);
  assert.notEqual(encrypted, await encryptBackup(json, passphrase));
});
test("wrong backup passphrase and tampering are rejected", async () => {
  const backup = await encryptBackup(JSON.stringify(emptyWorkspace()), passphrase);
  await assert.rejects(decryptBackup(backup, "incorrect password"));
  const changed = JSON.parse(backup);
  changed.ciphertext = (changed.ciphertext[0] === "A" ? "B" : "A") + changed.ciphertext.slice(1);
  await assert.rejects(decryptBackup(JSON.stringify(changed), passphrase));
});
test("weak passphrases, unexpected KDF work, and unknown formats are rejected", async () => {
  await assert.rejects(encryptBackup("{}", "1234"));
  await assert.rejects(decryptBackup('{"format":"other"}', passphrase));
  const changed = JSON.parse(await encryptBackup("{}", passphrase));
  changed.iterations = 1000000000;
  await assert.rejects(decryptBackup(JSON.stringify(changed), passphrase));
});
test("restore validation rejects malformed, duplicate, and unsupported records", () => {
  assert.deepEqual(validateWorkspace(emptyWorkspace()), emptyWorkspace());
  assert.throws(() => validateWorkspace({ ...emptyWorkspace(), version: 2 }));
  assert.throws(() => validateWorkspace({ ...emptyWorkspace(), notes: [{ id: "bad" }] }));
  const note = { id: "1", title: "A", body: "B", tag: "C" };
  assert.throws(() => validateWorkspace({ ...emptyWorkspace(), notes: [note, note] }));
  assert.throws(() => validateWorkspace({ ...emptyWorkspace(), documents: [{ id: "x", name: "A", meta: "B", base64: "bad data!" }] }));
});
