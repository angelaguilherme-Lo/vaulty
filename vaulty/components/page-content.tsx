"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Clock3,
  FileText,
  FolderOpen,
  Mail,
  NotebookText,
  Shield,
  SlidersHorizontal,
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
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
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

  const handleQuickSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() || !quickBody.trim()) return;

    if (quickType === "note") {
      addNote({ title: quickTitle, body: quickBody, tag: "Quick Note" });
    } else if (quickType === "reminder") {
      addReminder({
        title: quickTitle,
        date: new Date().toISOString().slice(0, 10),
        time: "18:00",
        location: "Personal",
        priority: "Medium",
      });
    } else {
      addDocument({
        name: quickTitle,
        meta: quickBody,
        fileType: "text/reference",
        content: quickBody,
      });
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
                <p className="font-medium text-[color:var(--text)]">Main email access</p>
              </div>
            </Link>

            <Link href="/documents" className="block rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4 transition hover:scale-[1.01]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[image:var(--gradient-warm)] text-white">
                  <FileText className="h-4 w-4" />
                </div>
                <p className="font-medium text-[color:var(--text)]">Signed documents folder</p>
              </div>
            </Link>

            <Link href="/notes" className="block rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4 transition hover:scale-[1.01]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[image:var(--gradient-pink)] text-white">
                  <NotebookText className="h-4 w-4" />
                </div>
                <p className="font-medium text-[color:var(--text)]">Travel memo note</p>
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    addNote({ title, body, tag: tag || "General" });
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
                  <Button variant="danger" className="h-9 px-3" onClick={() => deleteNote(note.id)}>
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
  const { reminders, addReminder, deleteReminder } = useAppStore();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(reminderTimes[0]);
  const [location, setLocation] = useState(reminderLocations[0]);
  const [priority, setPriority] = useState(reminderPriorities[1]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim()) return;
    addReminder({ title, date, time, location, priority });
    setTitle("");
    setDate("");
    setTime(reminderTimes[0]);
    setLocation(reminderLocations[0]);
    setPriority(reminderPriorities[1]);
  };

  return (
    <FadeIn>
      <Header title="Reminders" subtitle="Create reminders with date, time, location, and priority" />
      <div className="grid-2">
        <SectionCard title="Add reminder" subtitle="Structured management">
          <form onSubmit={onSubmit} className="grid gap-3">
            <Input placeholder="Reminder title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

            <Select value={time} onChange={setTime}>
              {reminderTimes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>

            <Select value={location} onChange={setLocation}>
              {reminderLocations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>

            <Select value={priority} onChange={setPriority}>
              {reminderPriorities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>

            <Button type="submit" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add reminder
            </Button>
          </form>
        </SectionCard>

        <SectionCard title="Saved reminders" subtitle={`${reminders.length} item(s)`}>
          <div className="space-y-3">
            {reminders.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[color:var(--text)]">{item.title}</p>
                    <p className="text-xs text-[color:var(--text-muted)]">
                      {item.priority} · {item.location}
                    </p>
                  </div>
                  <Button variant="danger" className="h-9 px-3" onClick={() => deleteReminder(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-[color:var(--text-muted)]">
                  <Clock3 className="h-4 w-4 text-[color:var(--orange)]" />
                  {item.date} · {item.time}
                </div>
              </div>
            ))}
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileChange = async (file: File | null) => {
    setSelectedFile(file);
    if (!file) {
      setFileContent("");
      return;
    }

    const isTextLike =
      file.type.startsWith("text/") ||
      file.type.includes("json") ||
      file.type.includes("javascript") ||
      file.type.includes("xml");

    if (isTextLike) {
      try {
        const text = await file.text();
        setFileContent(text);
      } catch {
        setFileContent(`Demo content for ${file.name}`);
      }
    } else {
      setFileContent(`Demo file content placeholder for ${file.name}`);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile && !name.trim()) return;

    addDocument({
      name: selectedFile?.name || name,
      meta: meta || "Uploaded",
      fileSize: selectedFile ? formatFileSize(selectedFile.size) : undefined,
      fileType: selectedFile?.type || "unknown",
      fileName: selectedFile?.name || name,
      content: fileContent || meta || "Demo document content",
    });

    setName("");
    setMeta("");
    setSelectedFile(null);
    setFileContent("");

    const input = document.getElementById("vaulty-file-upload") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const downloadDocument = (doc: DocumentItem) => {
    const content = doc.content || `Document: ${doc.name}\nMeta: ${doc.meta}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = doc.fileName || `${doc.name}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <FadeIn>
      <Header title="Documents" subtitle="Upload files and download saved documents" />

      <div className="grid-2">
        <SectionCard title="Add document reference" subtitle="Supports upload and download">
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
                  Choose a file from your computer to add it to the Documents page.
                </p>
              )}
            </div>

            <Button type="submit" className="gap-2">
              <Upload className="h-4 w-4" />
              Add document
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
                      onClick={() => downloadDocument(doc)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="danger"
                      className="h-9 px-3"
                      onClick={() => deleteDocument(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-[color:var(--text-muted)]">
                  <FolderOpen className="h-4 w-4 text-[color:var(--green)]" />
                  Uploaded or saved in demo memory
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !username.trim() || !password.trim()) return;
    addVaultItem({
      title,
      username,
      password,
      website: website || "not provided",
      category: category || "General",
    });
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
              <Input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
  const { setHasSeenOnboarding } = useAppStore();

  return (
    <FadeIn>
      <Header title="Settings" subtitle="Appearance, privacy, and interface control" />
      <div className="grid-2">
        <SectionCard title="Appearance" subtitle="Theme and visual experience">
          <div className="space-y-3">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4 text-sm text-[color:var(--text-muted)]">
              Switch between light and dark themes using the toggle in the top header.
            </div>
            <Button variant="secondary" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Refine style
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Onboarding tour" subtitle="Replay the welcome experience">
          <div className="space-y-3">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4 text-sm text-[color:var(--text-muted)]">
              Start the animated onboarding tour again for new viewers during your pitch.
            </div>
            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => setHasSeenOnboarding(false)}
            >
              <PlayCircle className="h-4 w-4" />
              Start tour again
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Privacy" subtitle="Vault protection">
          <div className="space-y-3">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4 text-sm text-[color:var(--text-muted)]">
              4-digit vault gate is active for sensitive credentials in this demo.
            </div>
            <Button variant="ghost" className="gap-2">
              <Shield className="h-4 w-4" />
              Update PIN later
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Organization" subtitle="Sorting and structure">
          <div className="space-y-3">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4 text-sm text-[color:var(--text-muted)]">
              The homepage cards are clickable, reminders use dropdowns, documents support upload/download, and Vaulty AI Helper can assist your demo flow.
            </div>
            <Button variant="ghost" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Manage layout
            </Button>
          </div>
        </SectionCard>
      </div>
    </FadeIn>
  );
}