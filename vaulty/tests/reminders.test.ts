import test from "node:test";
import assert from "node:assert/strict";
import { useAppStore } from "../store/app-store";
import { emptyWorkspace } from "../lib/workspace";

function unlockPreview() {
  useAppStore.setState({ ...emptyWorkspace(), isVaultUnlocked: true, session: "test-preview", busy: false, error: null });
}
const reminder = (date: string) => ({ title: "Test reminder", date, time: "12:00", location: "Personal", priority: "Medium" });
const futureDate = () => new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);

test("missing or past reminder dates preserve the list and report a useful error", async () => {
  unlockPreview();
  assert.equal(await useAppStore.getState().addReminder(reminder("")), false);
  assert.equal(useAppStore.getState().reminders.length, 0);
  assert.match(useAppStore.getState().error!, /future/);
  assert.equal(await useAppStore.getState().addReminder(reminder("2000-01-01")), false);
  assert.equal(useAppStore.getState().reminders.length, 0);
});

test("valid reminders save exactly once and can be removed", async () => {
  unlockPreview();
  const date = futureDate();
  assert.equal(await useAppStore.getState().addReminder(reminder(date)), true);
  const [saved] = useAppStore.getState().reminders;
  assert.equal(saved.date, date);
  assert.equal(saved.title, "Test reminder");
  assert.match(saved.id, /^[a-f0-9-]{36}$/);
  assert.equal(await useAppStore.getState().deleteReminder(saved.id), true);
  assert.equal(useAppStore.getState().reminders.length, 0);
});

test("repeated submit while saving does not create duplicate reminders", async () => {
  unlockPreview();
  const results = await Promise.all([
    useAppStore.getState().addReminder(reminder(futureDate())),
    useAppStore.getState().addReminder(reminder(futureDate())),
  ]);
  assert.deepEqual(results, [true, false]);
  assert.equal(useAppStore.getState().reminders.length, 1);
});

test("locked workspaces reject writes", async () => {
  unlockPreview();
  useAppStore.getState().lockVault();
  assert.equal(await useAppStore.getState().addReminder(reminder(futureDate())), false);
  assert.equal(useAppStore.getState().reminders.length, 0);
});
