export type NoteItem = {
  id: string;
  title: string;
  body: string;
  tag: string;
};

export type ReminderItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  priority: string;
};

export type DocumentItem = {
  id: string;
  name: string;
  meta: string;
  fileSize?: string;
  fileType?: string;
  fileName?: string;
  content?: string;
};

export type VaultItem = {
  id: string;
  title: string;
  username: string;
  password: string;
  website: string;
  category: string;
};

export const defaultStats = [
  { label: "Vault Items", value: "28", hint: "+4 this week", tone: "cool" },
  { label: "Reminders", value: "12", hint: "3 due today", tone: "warm" },
  { label: "Documents", value: "19", hint: "2 recently added", tone: "pink" },
  { label: "Memos", value: "43", hint: "Creative + personal", tone: "green" },
] as const;

export const defaultNotes: NoteItem[] = [
  {
    id: "n1",
    title: "Client portal access",
    body: "Store project links, login notes, and support instructions in one clean space.",
    tag: "Work",
  },
  {
    id: "n2",
    title: "Travel memo",
    body: "Passport scan, hotel confirmation, transfer phone number, and packing notes.",
    tag: "Personal",
  },
];

export const defaultReminders: ReminderItem[] = [
  {
    id: "r1",
    title: "Renew passport copy",
    date: "2026-04-16",
    time: "18:00",
    location: "Home",
    priority: "High",
  },
  {
    id: "r2",
    title: "Send design contract by email",
    date: "2026-04-17",
    time: "09:30",
    location: "Work",
    priority: "Medium",
  },
];

export const defaultDocuments: DocumentItem[] = [
  {
    id: "d1",
    name: "Passport-Scan.pdf",
    meta: "Personal · Updated 2h ago",
    fileSize: "1.2 MB",
    fileType: "application/pdf",
    fileName: "Passport-Scan.pdf",
    content: "Demo document content for Passport-Scan.pdf",
  },
  {
    id: "d2",
    name: "Client-Contract.pdf",
    meta: "Work · Updated yesterday",
    fileSize: "840 KB",
    fileType: "application/pdf",
    fileName: "Client-Contract.pdf",
    content: "Demo document content for Client-Contract.pdf",
  },
];

export const defaultVaultItems: VaultItem[] = [
  {
    id: "v1",
    title: "Gmail",
    username: "hello@example.com",
    password: "Qz!29@Mail2026",
    website: "mail.google.com",
    category: "Email",
  },
];

export const reminderTimes = ["08:00", "09:00", "10:00", "12:00", "15:00", "18:00", "21:00"];
export const reminderLocations = ["Home", "Work", "Travel", "Bank", "Personal", "Office", "Other"];
export const reminderPriorities = ["Low", "Medium", "High", "Critical"];