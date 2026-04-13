# Vaulty

Vaulty is a premium private workspace built with Next.js where users can manage passwords, notes, reminders, documents, emails, and memos in one polished interface.

The app combines inspiration from Notion and Apple Reminders, with a modern UI that uses glassmorphism, colorful premium accents, smooth interactions, and a dedicated vault protected by a 4-digit PIN.

## Features

- Premium dashboard-style interface
- Notes page
- Reminders page
- Documents page
- Vault page with 4-digit PIN gate
- Settings page
- Light and dark mode
- Lucide icons
- Mobile bottom navigation
- Responsive layout with desktop sidebar

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- next-themes
- Lucide React
- Framer Motion
- Zustand

## Project Status

This project is currently a frontend MVP.

It includes the interface, navigation, theme switching, and a demo vault experience. It does **not** yet include production-grade authentication, encrypted password storage, database persistence, or secure backend vault logic.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/vaulty.git
cd vaulty
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Open the app in your browser

```txt
http://localhost:3000
```

## Available Pages

- `/` — Home dashboard
- `/notes` — Notes
- `/reminders` — Reminders
- `/documents` — Documents
- `/vault` — Secure vault
- `/settings` — Settings

## Demo Vault Access

The current vault screen uses a demo 4-digit PIN:

```txt
1234
```

This PIN is only for UI demonstration in the current MVP version.

## Folder Structure

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

## Design Direction

Vaulty is designed to feel:

- modern
- premium
- minimal but creative
- glassmorphic
- colorful without looking noisy
- smooth and polished across desktop and mobile

## Roadmap

Planned next improvements:

- User authentication
- Database integration with Prisma and PostgreSQL
- Secure password encryption
- CRUD for notes, reminders, and vault entries
- Search and filters
- File uploads for documents
- Better settings management
- Production deployment

## Security Note

Vaulty is not yet a real secure password manager.

The current vault logic is frontend-based and uses mock data for demonstration. Do not use it to store real passwords or sensitive personal information until a secure backend, encryption, and proper authentication are implemented.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Author

Built as the Vaulty project using Next.js App Router.

## License

This project is currently for personal development and learning unless you choose to add an open-source license.