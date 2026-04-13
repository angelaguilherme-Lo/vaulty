"use client";

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
} from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { SectionCard } from "@/components/section-card";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { documents, notes, reminderItems, stats } from "@/lib/data";
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

export function HomePageContent() {
  return (
    <FadeIn>
      <Header
        title="Personal Management"
        subtitle="Organised privacy - structured beautifully"
      />

      <div className="stat-grid">
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="mt-4 grid-2">
        <SectionCard title="Quick capture" subtitle="Add notes, reminders, and private references instantly">
          <div className="grid gap-3">
            <Input placeholder="Title" />
            <Input placeholder="Short memo, quick access note, or private detail" />
            <div className="flex flex-wrap gap-3">
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Save entry
              </Button>
              <Button variant="secondary" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Organize smartly
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Pinned essentials" subtitle="Fast access with premium visual clarity">
          <div className="space-y-3">
            {[
              { icon: Mail, title: "Main email access", bg: "bg-[image:var(--gradient-cool)]" },
              { icon: FileText, title: "Signed documents folder", bg: "bg-[image:var(--gradient-warm)]" },
              { icon: NotebookText, title: "Travel memo note", bg: "bg-[image:var(--gradient-pink)]" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white ${item.bg}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="font-medium text-[color:var(--text)]">{item.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <div className="mt-4 grid-3">
        <SectionCard title="Recent memos" subtitle="Bold hierarchy, calm reading">
          <div className="space-y-3">
            {notes.slice(0, 3).map((note) => (
              <div key={note.id} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-semibold text-[color:var(--text)]">{note.title}</p>
                  <span className="rounded-full border border-[color:var(--line)] px-2.5 py-1 text-xs text-[color:var(--text-muted)]">
                    {note.tag}
                  </span>
                </div>
                <p className="text-sm leading-6 text-[color:var(--text-muted)]">{note.body}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Upcoming reminders" subtitle="Clear, vibrant, quick to scan">
          <div className="space-y-3">
            {reminderItems.slice(0, 3).map((item) => (
              <div key={item.id} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4">
                <p className="font-semibold text-[color:var(--text)]">{item.title}</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-[color:var(--text-muted)]">
                  <Clock3 className="h-4 w-4" />
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Vault preview" subtitle="Protected by PIN access">
          <div className="space-y-3">
            {[
              "Email account logins",
              "Documents platform passwords",
              "Bank and finance credentials",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-[color:var(--pink)]" />
                  <span className="text-sm text-[color:var(--text)]">{item}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </FadeIn>
  );
}

export function NotesPageContent() {
  return (
    <FadeIn>
      <Header title="Notes" subtitle="Modern, layered, and beautifully readable" />
      <div className="grid-3">
        {notes.map((note) => (
          <SectionCard key={note.id} title={note.title} subtitle={note.tag}>
            <p className="text-sm leading-6 text-[color:var(--text-muted)]">{note.body}</p>
          </SectionCard>
        ))}
      </div>
    </FadeIn>
  );
}

export function RemindersPageContent() {
  return (
    <FadeIn>
      <Header title="Reminders" subtitle="Tasks, alerts, and important timings" />
      <div className="grid-2">
        {reminderItems.map((item) => (
          <SectionCard key={item.id} title={item.title} subtitle={item.priority}>
            <div className="flex items-center gap-2 text-sm text-[color:var(--text-muted)]">
              <Clock3 className="h-4 w-4 text-[color:var(--orange)]" />
              {item.time}
            </div>
          </SectionCard>
        ))}
      </div>
    </FadeIn>
  );
}

export function DocumentsPageContent() {
  return (
    <FadeIn>
      <Header title="Documents" subtitle="Premium document management space" />
      <div className="grid-2">
        {documents.map((doc) => (
          <SectionCard key={doc.id} title={doc.name} subtitle={doc.meta}>
            <div className="flex items-center gap-3 text-sm text-[color:var(--text-muted)]">
              <FolderOpen className="h-4 w-4 text-[color:var(--green)]" />
              Ready for uploads, previews, folders, and secure organization
            </div>
          </SectionCard>
        ))}
      </div>
    </FadeIn>
  );
}

export function VaultPageContent() {
  const { isVaultUnlocked } = useAppStore();

  return (
    <FadeIn>
      <Header title="Vault" subtitle="Protected credentials and private entries" />
      {isVaultUnlocked ? <VaultList /> : <VaultGate />}
    </FadeIn>
  );
}

export function SettingsPageContent() {
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

        <SectionCard title="Privacy" subtitle="Vault protection">
          <div className="space-y-3">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4 text-sm text-[color:var(--text-muted)]">
              4-digit vault gate is active for sensitive credentials.
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
              Group notes, reminders, and documents into future collections and folders.
            </div>
            <Button variant="ghost" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Manage layout
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="About Vaulty" subtitle="Product character">
          <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4 text-sm leading-6 text-[color:var(--text-muted)]">
            Vaulty blends bold typography, vibrant premium color accents, and private workspace functionality into one polished interface.
          </div>
        </SectionCard>
      </div>
    </FadeIn>
  );
}