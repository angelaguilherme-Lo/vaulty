"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Clock3,
  CalendarDays,
  FileText,
  FolderOpen,
  Mail,
  NotebookText,
  Sparkles,
  PlusCircle,
  Trash2,
  LockKeyhole,
  PlayCircle,
  Upload,
  Download,
  FileUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { SectionCard } from "@/components/section-card";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  defaultStats,
  reminderLocations,
  reminderPriorities,
  reminderTimes,
  type DocumentItem,
} from "@/lib/data";
import { VaultGate } from "@/components/vault-gate";
import { VaultList } from "@/components/vault-list";
import { DataControls } from "@/components/data-controls";
import { toBase64 } from "@/lib/backup";
import { exportDocument } from "@/lib/files";
import { useAppStore } from "@/store/app-store";

function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
    >
      {children}
    </motion.div>
  );
}

function Select({
  id,
  value,
  onChange,
  children,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-4 text-sm text-[color:var(--text)] outline-none"
    >
      {children}
    </select>
  );
}

export function HomePageContent() {
  const {
    notes,
    reminders,
    documents,
    vaultItems,
    addNote,
    addReminder,
    addDocument,
  } = useAppStore();

  const [quickTitle, setQuickTitle] = useState("");
  const [quickBody, setQuickBody] = useState("");
  const [quickType, setQuickType] = useState<"note" | "reminder" | "document">("note");

  const computedStats = [
    { ...defaultStats[0], value: String(vaultItems.length) },
    { ...defaultStats[1], value: String(reminders.length) },
    { ...defaultStats[2], value: String(documents.length) },
    { ...defaultStats[3], value: String(notes.length) },
  ];

  const handleQuickSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() || !quickBody.trim()) return;

    if (quickType === "note") {
      if (!await addNote({ title: quickTitle, body: quickBody, tag: "Quick Note" })) return;
    } else if (quickType === "reminder") {
      if (!await addReminder({
        title: quickTitle,
        date: new Date(Date.now() + 86400000).toLocaleDateString("en-CA"),
        time: "18:00",
        location: "Personal",
        priority: "Medium",
      })) return;
    } else {
      if (!await addDocument({
        name: quickTitle,
        meta: quickBody,
        fileType: "text/reference",
        content: quickBody,
      })) return;
    }

    setQuickTitle("");
    setQuickBody("");
  };

  return (
    <FadeIn>
      <Header
        title="Personal  Management"
        subtitle="Structured Workflow"
      />

      <div className="stat-grid">
        {computedStats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="mt-4 grid-2">
        <SectionCard title="Quick action" subtitle="Add real data instantly">
          <form onSubmit={handleQuickSave} className="grid gap-3">
            <Input
              placeholder="Title"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
            />
            <Input
              placeholder={
                quickType === "note"
                  ? "Write your memo"
                  : quickType === "reminder"
                  ? "Quick reminder title"
                  : "Example: Personal · Updated now"
              }
              value={quickBody}
              onChange={(e) => setQuickBody(e.target.value)}
            />

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={quickType === "note" ? "primary" : "secondary"}
                onClick={() => setQuickType("note")}
              >
                Note
              </Button>
              <Button
                type="button"
                variant={quickType === "reminder" ? "primary" : "secondary"}
                onClick={() => setQuickType("reminder")}
              >
                Reminder
              </Button>
              <Button
                type="button"
                variant={quickType === "document" ? "primary" : "secondary"}
                onClick={() => setQuickType("document")}
              >
                Document
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Save entry
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="gap-2"
                onClick={() => {
                  setQuickTitle("");
                  setQuickBody("");
                }}
              >
                <Sparkles className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </form>
        </SectionCard>

        <SectionCard title="Pinned essentials" subtitle="Fast visual access">
          <div className="space-y-3">
            <Link href="/vault" className="block rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4 transition hover:scale-[1.01]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[image:var(--gradient-cool)] text-white">
                  <Mail className="h-4 w-4" />
                </div>
                <p className="font-medium text-[color:var(--text)]">Open credentials</p>
              </div>
            </Link>

            <Link href="/documents" className="block rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4 transition hover:scale-[1.01]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[image:var(--gradient-warm)] text-white">
                  <FileText className="h-4 w-4" />
                </div>
                <p className="font-medium text-[color:var(--text)]">Browse documents</p>
              </div>
            </Link>

            <Link href="/notes" className="block rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4 transition hover:scale-[1.01]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[image:var(--gradient-pink)] text-white">
                  <NotebookText className="h-4 w-4" />
                </div>
                <p className="font-medium text-[color:var(--text)]">Open your notes</p>
              </div>
            </Link>

            <Link href="/vault" className="block rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4 transition hover:scale-[1.01]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[image:var(--gradient-green)] text-white">
                  <LockKeyhole className="h-4 w-4" />
                </div>
                <p className="font-medium text-[color:var(--text)]">{vaultItems.length} vault item(s) saved</p>
              </div>
            </Link>
          </div>
        </SectionCard>
      </div>

      <div className="mt-4 grid-3">
        <SectionCard title="Recent memos" subtitle="Latest saved notes">
          <div className="space-y-3">
            {notes.slice(0, 4).map((note) => (
              <Link
                key={note.id}
                href="/notes"
                className="block rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4 transition hover:scale-[1.01]"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-semibold text-[color:var(--text)]">{note.title}</p>
                  <span className="rounded-full border border-[color:var(--line)] px-2.5 py-1 text-xs text-[color:var(--text-muted)]">
                    {note.tag}
                  </span>
                </div>
                <p className="text-sm leading-6 text-[color:var(--text-muted)]">{note.body}</p>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Upcoming reminders" subtitle="Latest reminder entries">
          <div className="space-y-3">
            {reminders.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href="/reminders"
                className="block rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4 transition hover:scale-[1.01]"
              >
                <p className="font-semibold text-[color:var(--text)]">{item.title}</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-[color:var(--text-muted)]">
                  <Clock3 className="h-4 w-4" />
                  {item.date} · {item.time} · {item.location}
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Documents preview" subtitle="Latest stored references">
          <div className="space-y-3">
            {documents.slice(0, 4).map((doc) => (
              <Link
                key={doc.id}
                href="/documents"
                className="block rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4 transition hover:scale-[1.01]"
              >
                <p className="font-semibold text-[color:var(--text)]">{doc.name}</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-[color:var(--text-muted)]">
                  <FolderOpen className="h-4 w-4" />
                  {doc.meta}
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>
    </FadeIn>
  );
}

export function NotesPageContent() {
  const { notes, addNote, deleteNote } = useAppStore();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    if (!await addNote({ title, body, tag: tag || "General" })) return;
    setTitle("");
    setBody("");
    setTag("");
  };

  return (
    <FadeIn>
      <Header title="Notes" subtitle="Write and save notes" />
      <div className="grid-2">
        <SectionCard title="Add note" subtitle="Create and store instantly">
          <form onSubmit={onSubmit} className="grid gap-3">
            <Input placeholder="Note title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="Tag, e.g. Work or Personal" value={tag} onChange={(e) => setTag(e.target.value)} />
            <Input placeholder="Write your note" value={body} onChange={(e) => setBody(e.target.value)} />
            <Button type="submit" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add note
            </Button>
          </form>
        </SectionCard>

        <SectionCard title="Saved notes" subtitle={`${notes.length} item(s)`}>
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[color:var(--text)]">{note.title}</p>
                    <p className="text-xs text-[color:var(--text-muted)]">{note.tag}</p>
                  </div>
                  <Button variant="danger" aria-label={`Delete ${note.title}`} className="h-11 px-3" onClick={() => { if (confirm("Delete this note permanently?")) void deleteNote(note.id); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm leading-6 text-[color:var(--text-muted)]">{note.body}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </FadeIn>
  );
}

export function RemindersPageContent() {
  const { reminders, addReminder, deleteReminder, busy, notificationsEnabled } = useAppStore();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(reminderTimes[0]);
  const [location, setLocation] = useState(reminderLocations[0]);
  const [priority, setPriority] = useState(reminderPriorities[1]);
  const [errors, setErrors] = useState<{ title?: string; date?: string; form?: string }>({});
  const [message, setMessage] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    const missing = {
      ...(!title.trim() ? { title: "Enter a title for your reminder." } : {}),
      ...(!date ? { date: "Choose a date for your reminder." } : {}),
    };
    setErrors(missing);
    if (missing.title || missing.date) {
      const field = e.currentTarget.elements.namedItem(missing.title ? "title" : "date");
      if (field instanceof HTMLElement) field.focus();
      return;
    }
    if (!await addReminder({ title: title.trim(), date, time, location, priority })) {
      setErrors({ form: useAppStore.getState().error || "Your reminder was not saved. Please try again." });
      return;
    }
    setTitle("");
    setDate("");
    setErrors({});
    setMessage("Reminder added.");
  };

  return (
    <FadeIn>
      <Header title="Reminders" subtitle="Plan a task and choose when it is due" />
      <div className="grid-2">
        <SectionCard title="Add reminder" subtitle="Choose a title, date, and time">
          <form onSubmit={onSubmit} noValidate className="reminder-form grid gap-4">
            <div className="form-field">
              <label htmlFor="reminder-title">Title <span>(required)</span></label>
              <Input id="reminder-title" name="title" required placeholder="What do you need to do?"
                value={title} aria-invalid={!!errors.title} aria-describedby={errors.title ? "reminder-title-error" : undefined}
                onChange={e => { setTitle(e.target.value); setErrors({}); setMessage(""); }} />
              {errors.title ? <p id="reminder-title-error" role="alert" className="field-error">{errors.title}</p> : null}
            </div>
            <div className="form-field">
              <label htmlFor="reminder-date"><CalendarDays className="h-4 w-4" aria-hidden="true" />Date <span>(required)</span></label>
              <Input id="reminder-date" name="date" type="date" required value={date} aria-invalid={!!errors.date}
                aria-describedby="reminder-date-hint" onChange={e => { setDate(e.target.value); setErrors({}); setMessage(""); }} />
              <p id="reminder-date-hint" role={errors.date ? "alert" : undefined} className={errors.date ? "field-error" : "field-hint"}>
                {errors.date || (date ? "Your reminder will be due on this date." : "Tap to choose a date.")}
              </p>
            </div>
            <div className="form-field">
              <label htmlFor="reminder-time">Time</label>
              <Input id="reminder-time" name="time" type="time" required value={time}
                onChange={e => { setTime(e.target.value); setErrors({}); setMessage(""); }} />
              <p className="field-hint">Choose a time in the future. Notifications can be enabled in Settings.</p>
            </div>
            <div className="form-field"><label htmlFor="reminder-location">Location or list</label>
              <Select id="reminder-location" value={location} onChange={setLocation}>
                {reminderLocations.map(item => <option key={item} value={item}>{item}</option>)}
              </Select>
            </div>
            <div className="form-field"><label htmlFor="reminder-priority">Priority</label>
              <Select id="reminder-priority" value={priority} onChange={setPriority}>
                {reminderPriorities.map(item => <option key={item} value={item}>{item}</option>)}
              </Select>
            </div>
            {errors.form ? <p role="alert" className="field-error">{errors.form}</p> : null}
            {message ? <p role="status" className="text-sm text-[color:var(--green)]">{message}</p> : null}
            <Button type="submit" disabled={busy} className="gap-2"><PlusCircle className="h-4 w-4" />{busy ? "Saving reminder…" : "Add reminder"}</Button>
          </form>
        </SectionCard>
        <SectionCard title="Saved reminders" subtitle={`${reminders.length} item(s) · ${notificationsEnabled ? "Notifications enabled" : "Notifications off"}`}>
          {!reminders.length ? <p className="text-sm text-[color:var(--text-muted)]">Your reminders will appear here after you add one.</p> : null}
          <div className="space-y-3">
            {reminders.map(item => <div key={item.id} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div><p className="font-semibold">{item.title}</p><p className="text-xs text-[color:var(--text-muted)]">{item.priority} · {item.location}</p></div>
                <Button variant="danger" aria-label={`Delete ${item.title}`} className="h-11 px-3" onClick={() => { if (confirm("Delete this reminder permanently?")) void deleteReminder(item.id); }}><Trash2 className="h-4 w-4" /></Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-[color:var(--text-muted)]"><Clock3 className="h-4 w-4 text-[color:var(--orange)]" />{item.date} · {item.time}</div>
            </div>)}
          </div>
        </SectionCard>
      </div>
    </FadeIn>
  );
}

export function DocumentsPageContent() {
  const { documents, addDocument, deleteDocument } = useAppStore();
  const [name, setName] = useState("");
  const [meta, setMeta] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [reading, setReading] = useState(false);
  const [error, setError] = useState("");

  const formatFileSize = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;
  const handleFileChange = async (file: File | null) => {
    setSelectedFile(null); setFileContent(""); setError("");
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Choose a file smaller than 5 MB."); return; }
    setReading(true);
    try {
      const encoded = toBase64(new Uint8Array(await file.arrayBuffer()));
      setFileContent(encoded); setSelectedFile(file);
    } catch { setError("Could not read this file. Choose it again."); }
    finally { setReading(false); }
  };
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reading || (!selectedFile && !name.trim())) return;
    if (!await addDocument({
      name: selectedFile?.name || name, meta: meta || "Personal",
      ...(selectedFile ? { fileSize: formatFileSize(selectedFile.size), fileType: selectedFile.type || "application/octet-stream",
        fileName: selectedFile.name, base64: fileContent } : { content: meta || name, fileType: "text/plain", fileName: `${name}.txt` }),
    })) return;
    setName(""); setMeta(""); setSelectedFile(null); setFileContent("");
    const input = document.getElementById("vaulty-file-upload") as HTMLInputElement | null;
    if (input) input.value = "";
  };
  const downloadDocument = async (doc: DocumentItem) => {
    try { await exportDocument(doc); }
    catch { setError("Could not export this document. Please try again."); }
  };

  return (
    <FadeIn>
      <Header title="Documents" subtitle="Upload files and download saved documents" />

      <div className="grid-2">
        <SectionCard title="Add document reference" subtitle="Supports upload and download">
          {error ? <p role="alert" className="mb-3 text-sm text-rose-500">{error}</p> : null}
          <form onSubmit={onSubmit} className="grid gap-3">
            <Input
              placeholder="Document name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Meta, e.g. Personal · Updated now"
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
            />

            <div className="rounded-2xl border border-dashed border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4">
              <div className="mb-3 flex items-center gap-2">
                <FileUp className="h-4 w-4 text-[color:var(--text)]" />
                <p className="text-sm font-medium text-[color:var(--text)]">Upload file</p>
              </div>

              <input
                id="vaulty-file-upload"
                type="file"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                className="block w-full rounded-xl text-sm text-[color:var(--text-muted)]"
              />

              {selectedFile ? (
                <div className="mt-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel)] p-3 text-sm text-[color:var(--text-muted)]">
                  <p><strong>Name:</strong> {selectedFile.name}</p>
                  <p><strong>Type:</strong> {selectedFile.type || "unknown"}</p>
                  <p><strong>Size:</strong> {formatFileSize(selectedFile.size)}</p>
                </div>
              ) : (
                <p className="mt-3 text-xs text-[color:var(--text-muted)]">
                  Choose a file from your device. Files up to 5 MB are supported.
                </p>
              )}
            </div>

            <Button type="submit" disabled={reading} className="gap-2">
              <Upload className="h-4 w-4" />
              {reading ? "Reading file…" : "Add document"}
            </Button>
          </form>
        </SectionCard>

        <SectionCard title="Saved documents" subtitle={`${documents.length} item(s)`}>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[color:var(--text)]">{doc.name}</p>
                    <p className="text-xs text-[color:var(--text-muted)]">{doc.meta}</p>

                    {(doc.fileType || doc.fileSize) && (
                      <p className="mt-2 text-xs text-[color:var(--text-muted)]">
                        {doc.fileType || "unknown"}{doc.fileSize ? ` · ${doc.fileSize}` : ""}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-9 px-3"
                      aria-label={`Export ${doc.name}`}
                      onClick={() => void downloadDocument(doc)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="danger"
                      className="h-9 px-3"
                      aria-label={`Delete ${doc.name}`}
                      onClick={() => { if (confirm("Delete this document permanently?")) void deleteDocument(doc.id); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-[color:var(--text-muted)]">
                  <FolderOpen className="h-4 w-4 text-[color:var(--green)]" />
                  Saved in your workspace
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </FadeIn>
  );
}

export function VaultPageContent() {
  const { isVaultUnlocked, addVaultItem } = useAppStore();

  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [category, setCategory] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !username.trim() || !password.trim()) return;
    if (!await addVaultItem({
      title,
      username,
      password,
      website: website || "not provided",
      category: category || "General",
    })) return;
    setTitle("");
    setUsername("");
    setPassword("");
    setWebsite("");
    setCategory("");
  };

  return (
    <FadeIn>
      <Header title="Vault" subtitle="Protected credentials and private entries" />

      {isVaultUnlocked ? (
        <div className="space-y-4">
          <SectionCard title="Add vault item" subtitle="Credential creation">
            <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
              <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Input placeholder="Username or email" value={username} onChange={(e) => setUsername(e.target.value)} />
              <Input type="password" autoComplete="new-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Input placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
              <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
              <div className="md:col-span-2">
                <Button type="submit" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add vault item
                </Button>
              </div>
            </form>
          </SectionCard>

          <VaultList />
        </div>
      ) : (
        <VaultGate />
      )}
    </FadeIn>
  );
}

export function SettingsPageContent() {
  const { setHasSeenOnboarding, lockVault, notificationsEnabled, setNotifications } = useAppStore();
  return <FadeIn>
    <Header title="Settings" subtitle="Your device, your workspace" />
    <div className="grid-2">
      <SectionCard title="Privacy and locking" subtitle="Protected on your iPhone">
        <p className="mb-4 text-sm leading-6">The iOS app encrypts your workspace on this device. Vaulty locks when you leave the app or after two minutes without interaction. Device authentication unlocks it.</p>
        <Button onClick={lockVault} className="gap-2"><LockKeyhole className="h-4 w-4" />Lock Vaulty</Button>
        <div className="mt-5 flex gap-4 text-sm underline"><Link href="/privacy">Privacy policy</Link><Link href="/support">Help and recovery</Link></div>
      </SectionCard>
      <SectionCard title="Reminder notifications" subtitle="Optional local alerts">
        <p className="mb-4 text-sm leading-6">Notifications show a private prompt to open Vaulty. Entry titles stay inside the app. The next 60 future reminders are scheduled; open Vaulty to refresh them. Changing time zones may change delivery times.</p>
        <Button onClick={() => void setNotifications(!notificationsEnabled)}>{notificationsEnabled ? "Turn off notifications" : "Enable reminder notifications"}</Button>
      </SectionCard>
      <SectionCard title="Backup and recovery" subtitle="Keep a copy outside this device"><DataControls /></SectionCard>
      <SectionCard title="Appearance and welcome" subtitle="Make yourself at home">
        <p className="mb-4 text-sm leading-6">Use the theme toggle in the header to switch appearance.</p>
        <Button variant="secondary" onClick={() => void setHasSeenOnboarding(false)} className="gap-2"><PlayCircle className="h-4 w-4" />Replay welcome tour</Button>
      </SectionCard>
    </div>
  </FadeIn>;
}
