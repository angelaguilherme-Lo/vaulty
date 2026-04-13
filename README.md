# Vaulty

A premium private workspace built with Next.js for storing notes, reminders, document references, emails, memos, and vault-style password entries in one polished interface.

Vaulty blends ideas from **Notion** and **Apple Reminders** with a modern visual style: glassmorphism, colorful premium accents, dark/light theme support, responsive layouts, and a dedicated vault protected by a 4-digit PIN in the current MVP.

---

## Preview

Vaulty includes:

- A modern dashboard homepage
- Notes page
- Reminders page
- Documents page
- Vault page
- Settings page
- Desktop sidebar navigation
- Mobile bottom navigation
- Light and dark mode toggle
- Lucide icons
- Framer Motion transitions

---

## Tech Stack

- **Next.js** with **App Router**
- **TypeScript**
- **Tailwind CSS**
- **next-themes**
- **Lucide React**
- **Framer Motion**
- **Zustand**

---

## Current Status

Vaulty is currently a **frontend MVP**.

It already includes the interface structure, routing, theming, responsive navigation, and a demo vault experience. It does **not** yet include:

- user authentication
- database integration
- encrypted password storage
- secure backend vault logic
- production-ready CRUD operations

This means the current version is ideal for UI development, prototyping, and portfolio work, but **not yet suitable for storing real sensitive passwords**.

---

## Pages

| Route | Description |
|------|-------------|
| `/` | Dashboard / homepage |
| `/notes` | Notes workspace |
| `/reminders` | Reminder list |
| `/documents` | Documents overview |
| `/vault` | Vault screen with PIN gate |
| `/settings` | Appearance and privacy settings |

---


## Project Structure

```txt
app/
  layout.tsx
  providers.tsx
  globals.css
  page.tsx
  notes/page.tsx
  reminders/page.tsx
  documents/page.tsx
  vault/page.tsx
  settings/page.tsx

components/
  dashboard-shell.tsx
  sidebar.tsx
  mobile-nav.tsx
  header.tsx
  theme-toggle.tsx
  page-content.tsx
  stat-card.tsx
  section-card.tsx
  vault-gate.tsx
  vault-list.tsx
  ui/
    button.tsx
    input.tsx

lib/
  data.ts
  utils.ts

store/
  app-store.ts
```

---

## Design Direction

Vaulty is designed to feel:

- modern
- premium
- colorful but controlled
- minimal and clean
- smooth and polished
- mobile-friendly
- visually bold without being messy

---

## Roadmap

Planned next steps for Vaulty:

- Authentication
- Prisma + PostgreSQL
- Secure password encryption
- CRUD for vault items, notes, reminders, and documents
- Search and filtering
- File uploads
- Better settings controls
- Production deployment
- Real user accounts

---

## Security Notice

Vaulty is **not yet a production password manager**.

The current vault logic is client-side and uses mock data. Do not use the current version to store real passwords, financial credentials, or sensitive personal information until secure authentication, encryption, and backend protection are implemented.

---

## Why this project

Vaulty was created as a premium personal workspace concept that merges:

- structured information management
- fast reminders and memos
- private vault access
- elegant interface design
- modern Next.js architecture

---

## Authorship

Built as the **Vaulty** project using Next.js App Router.
