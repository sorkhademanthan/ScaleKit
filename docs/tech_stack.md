# 🛠️ Tech Stack & Project Status

**ScaleKit Architecture Type:** Modular Monolith (Domain-Driven Design)
**Core Framework:** Next.js 16 (App Router)
**Language:** TypeScript (Strict Mode)

## 1. The "Engine Room" (Dependencies Installed)

We have installed these specific tools to handle the heavy lifting:

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Core** | **Next.js 16** | The React Framework. |
| **Styling** | **Tailwind CSS v4** | Utility-first styling (Newest version). |
| **UI Utils** | **clsx, tailwind-merge** | For conditional class names. |
| **Icons** | **lucide-react** | Clean, consistent SVG icons. |
| **Database** | **PostgreSQL** | The main relational database. |
| **ORM** | **Drizzle ORM** | TypeScript-first SQL wrapper (Better than Prisma). |
| **Validation** | **Zod** | Runtime schema validation (Strict types). |
| **Auth** | **Argon2, Jose** | Password hashing & JWT manipulation. |
| **Queues** | **BullMQ, Redis** | Background jobs (Email, File processing). |
| **State** | **Zustand** | Global client-side state management. |

## 2. Project Status
*   **Initial Setup:** Completed
*   **Dependencies:** Installed (pg, drizzle-orm, bullmq, ioredis, argon2, jose, etc.)
*   **Configuration Files:**
    *   `next.config.ts`
    *   `tailwind.config.ts`
    *   `postcss.config.mjs`
    *   `tsconfig.json`
*   **Folder Structure:** Defined and ready for implementation (See `folder-structure.md`).
