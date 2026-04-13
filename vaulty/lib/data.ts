export const stats = [
  { label: "Vault Items", value: "28", hint: "+4 this week", tone: "cool" },
  { label: "Reminders", value: "12", hint: "3 due today", tone: "warm" },
  { label: "Documents", value: "19", hint: "2 recently added", tone: "pink" },
  { label: "Memos", value: "43", hint: "Creative + personal", tone: "green" },
] as const;

export const notes = [
  {
    id: 1,
    title: "Client portal access",
    body: "Store project links, login notes, and support instructions in one clean space.",
    tag: "Work",
  },
  {
    id: 2,
    title: "Travel memo",
    body: "Passport scan, hotel confirmation, transfer phone number, and packing notes.",
    tag: "Personal",
  },
  {
    id: 3,
    title: "Family documents",
    body: "Insurance number, emergency contacts, and digital copies of key records.",
    tag: "Private",
  },
  {
    id: 4,
    title: "Creative app direction",
    body: "Use stronger typography, more editorial hierarchy, and color-coded sections.",
    tag: "Product",
  },
];

export const reminderItems = [
  { id: 1, title: "Renew passport copy", time: "Today · 18:00", priority: "High" },
  { id: 2, title: "Send design contract by email", time: "Tomorrow · 09:30", priority: "Medium" },
  { id: 3, title: "Pay hosting invoice", time: "Apr 16 · 12:00", priority: "Low" },
  { id: 4, title: "Review private accounts", time: "Apr 18 · 20:00", priority: "High" },
];

export const documents = [
  { id: 1, name: "Passport-Scan.pdf", meta: "Personal · Updated 2h ago" },
  { id: 2, name: "Client-Contract.pdf", meta: "Work · Updated yesterday" },
  { id: 3, name: "Insurance-Policy.pdf", meta: "Private · Updated 4 days ago" },
  { id: 4, name: "Travel-Checklist.docx", meta: "Personal · Updated 1 week ago" },
];

export const vaultItems = [
  {
    id: 1,
    title: "Gmail",
    username: "hello@example.com",
    password: "Qz!29@Mail2026",
    website: "mail.google.com",
    category: "Email",
  },
  {
    id: 2,
    title: "Dropbox",
    username: "vaultowner",
    password: "Dr0pBox!Secure88",
    website: "dropbox.com",
    category: "Documents",
  },
  {
    id: 3,
    title: "Banking App",
    username: "private-user",
    password: "UseYourEncryptedPasswordHere",
    website: "bank.example.com",
    category: "Finance",
  },
];