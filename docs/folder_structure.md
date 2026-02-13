# 📂 The "Structural Blueprint" (Folder Map) - v2.0

This is the defined file structure for **ScaleKit**. All code should strictly follow these locations.

```plaintext
scalekit/
├── .github/                    # CI/CD Workflows
├── content/                    # 📄 DOCS CONTENT (MDX Files)
│   └── docs/                   # Markdown files for the website
│       ├── auth/
│       ├── security/
│       └── database/
│
├── docs/                       # 📄 INTERNAL PROJECT DOCS (Overview, Standards)
├── docker/                     # Docker Configs
├── public/                     # Static Assets
├── scripts/                    # Maintenance Scripts
│
├── registry/                   # 🏭 THE WAREHOUSE (Raw Backend Components)
│   ├── auth/                   # Auth components (JWT, RBAC)
│   ├── security/               # Security components (Rate Limiters)
│   ├── database/               # DB patterns (Pagination)
│   └── shared/                 # Shared utilities for components
│
├── src/                        # 🌐 THE STOREFRONT (Documentation Website)
│   ├── app/                    # ROUTING LAYER
│   │   ├── (marketing)/        # Landing Page
│   │   ├── docs/               # Documentation Routes ([...slug])
│   │   ├── api/                # API for Registry JSON (if needed)
│   │   ├── globals.css         # Tailwind Imports
│   │   └── layout.tsx          # Root Layout
│   │
│   ├── components/             # UI COMPONENTS (For the Website)
│   │   ├── ui/                 # Core UI (Buttons, Sidebar)
│   │   ├── mdx/                # MDX Components (CodeBlock, etc.)
│   │   └── layout/             # Header, Sidebar, TOC
│   │
│   ├── config/                 # SITE CONFIG
│   │   └── site.ts             # Navigation menus, Metadata
│   │
│   ├── lib/                    # UTILS
│   │   └── utils.ts            # cn helper
│   │
│   └── styles/                 # Extra styles
│
├── registry.json               # � THE MANIFEST (Maps components to files)
├── .env                        # Secrets
├── drizzle.config.ts           # Drizzle Kit Config
├── next.config.ts              # Next.js Config
├── package.json                # Dependencies List
├── postcss.config.mjs          # Tailwind v4 Plugin Setup
├── tailwind.config.ts          # Tailwind Theme Config
└── tsconfig.json               # TypeScript Paths (@/* -> ./src/*)
```
