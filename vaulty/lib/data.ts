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
  base64?: string;
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
  { label: "Vault Items", value: "0", hint: "Protected credentials", tone: "cool" },
  { label: "Reminders", value: "0", hint: "Your upcoming tasks", tone: "warm" },
  { label: "Documents", value: "0", hint: "Files and references", tone: "pink" },
  { label: "Notes", value: "0", hint: "Your ideas and memos", tone: "green" },
] as const;

export const reminderTimes = ["08:00", "09:00", "10:00", "12:00", "15:00", "18:00", "21:00"];
export const reminderLocations = ["Home", "Work", "Travel", "Bank", "Personal", "Office", "Other"];
export const reminderPriorities = ["Low", "Medium", "High", "Critical"];