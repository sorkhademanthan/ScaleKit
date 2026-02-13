# 🚀 Project Master Document: ScaleKit (v2.0)

## 1. Vision Statement
To become the “ShadCN of Backend Architecture” — providing production-ready, scalable system blueprints that developers can directly use in real-world applications.

**This is NOT:**
*   A tutorial repo.
*   A beginner learning repo.
*   A random boilerplate dump.

**This IS:**
*   Real production-grade architecture systems.
*   Structured, scalable, documented backend systems.
*   Designed for serious developers to browse, copy-paste, or CLI-inject.

## 2. Core Problem Statement
**The Real Developer Pain:**
When building serious applications, devs know how to write APIs, use JWT, Redis, and Docker. However, they struggle with:
*   Versioning services properly.
*   Designing for horizontal scaling.
*   Writing production-grade infrastructure configs.
*   Preparing systems for future scale.

Most GitHub repos are over-engineered, under-documented, or beginner-level. There is NO clean, modular, production-ready architecture library. That’s our gap.

## 3. What This Product Actually Is
A "Component Registry" for backend architecture. It includes:
*   **The Documentation Site:** A luxury SaaS-style site where devs browse components.
*   **The Registry:** A decoupled folder of raw, production-ready backend code blocks.
*   **The CLI:** A future tool (`npx scalekit add <component>`) to automate integration.

## 4. Phase Roadmap

### PHASE 0: The Engine Room (Completed) ✅
*   **Stack:** Next.js 16 (App Router), Node.js, TypeScript.
*   **Styling:** Tailwind CSS v4.
*   **DB:** PostgreSQL with Drizzle ORM.
*   **Infra:** Docker Compose (Postgres + Redis).

### PHASE 1: The Storefront (Documentation Shell)
*   **Goal:** Build the website for browsing backend components.
*   **Layout:**
    *   Left Sidebar: Navigation categories (Auth, Database, Storage, Security).
    *   Middle Content: MDX Documentation.
    *   Right Sidebar: Table of Contents.
*   **Tech:** Next.js MDX or Fumadocs.
*   **Key Component:** `<CodeBlock />` with syntax highlighting and "Copy to Clipboard".

### PHASE 2: The Warehouse (Component Registry)
*   **Goal:** Decouple backend code from UI for easy distribution.
*   **Structure:** `registry/` folder at root.
*   **Manifest:** `registry.json` mapping components to files and dependencies.

### PHASE 3: The First Component (Proof of Concept)
*   **Goal:** Test the pipeline (Code -> Registry -> MDX -> Website).
*   **Candidate:** Redis-backed Sliding Window Rate Limiter.
*   **Deliverable:** `content/docs/security/rate-limiter.mdx` displaying code from `registry/`.

### PHASE 4: Infinite Scaling (The Component Factory)
*   **Loop:** Write Code ➔ Add to `registry.json` ➔ Write .mdx doc.
*   **Modules:**
    *   **Auth:** JWT setup, RBAC middleware.
    *   **Database:** Cursor pagination, Soft-delete.
    *   **Storage:** S3 pre-signed URL uploaders.
    *   **Queues:** BullMQ workers.

### PHASE 5: The Endgame (The CLI Tool)
*   **Goal:** `npx scalekit add <component>`.
*   **Mechanism:** CLI fetches `registry.json`, downloads raw files, runs `npm install`.

## 5. Architecture Standards (For The Registry Code)
*   Strict TypeScript.
*   Modular architecture & SOLID principles.
*   Clean code rules & Error abstraction.
*   Security first (Helmet, CORS, Rate limits).

## 6. Branding Strategy
*   **Vibe:** Clean, Minimal, Technical, Engineer-focused.
*   **Name:** ScaleKit.

## 7. Why This Stands Out
*   **Recruiters see:** Deep architecture knowledge, Production thinking.
*   **Dev Community sees:** Serious engineering, Useful infra.

## 8. Practical Next Step
**Start Phase 1:** Set up the MDX documentation engine and the "Luxury SaaS" layout.
