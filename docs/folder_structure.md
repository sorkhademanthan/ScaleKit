# 📂 The "Structural Blueprint" (Folder Map)

This is the defined file structure for **ScaleKit**. All code should strictly follow these locations.

```plaintext
scalekit/
├── .github/                    # CI/CD Workflows
├── docs/                       # 📄 Documentation (You are here)
├── docker/                     # Docker Configs
├── public/                     # Static Assets
├── scripts/                    # Maintenance Scripts
│
├── src/                        # 🧠 THE BRAIN (All Logic is Here)
│   ├── app/                    # 🌐 ROUTING LAYER
│   │   ├── (auth)/             # Login/Register Pages
│   │   ├── (dashboard)/        # Protected App Routes
│   │   ├── api/                # API Gateway
│   │   │   └── v1/             # Versioned Endpoints
│   │   ├── globals.css         # Tailwind Imports
│   │   ├── layout.tsx          # Root Layout
│   │   └── page.tsx            # Landing Page
│   │
│   ├── config/                 # ⚙️ CONFIGURATION
│   │   └── env.ts              # Zod-validated Environment Vars
│   │
│   ├── core/                   # 🧱 SHARED KERNEL
│   │   ├── utils/              # cn.ts (Tailwind merge helper)
│   │   ├── errors/             # Custom Error Classes
│   │   └── middleware/         # Global Middleware
│   │
│   ├── db/                     # 🗄️ DATABASE LAYER
│   │   ├── schema/             # Drizzle Table Definitions
│   │   ├── migrations/         # SQL History
│   │   ├── seeds/              # Fake Data Generators
│   │   └── index.ts            # DB Connection Pool
│   │
│   ├── emails/                 # 📧 COMMUNICATION
│   │   └── templates/          # React-Email Components
│   │
│   ├── lib/                    # 📚 EXTERNAL ADAPTERS
│   │   └── redis.ts            # Redis Connection
│   │
│   ├── modules/                # 🚀 BUSINESS LOGIC (The "ProdStack")
│   │   ├── auth/               # Module 1: Authentication
│   │   ├── communication/      # Module 3: Realtime
│   │   ├── jobs/               # Module 5: Queues
│   │   └── storage/            # Module 4: Uploads
│   │
│   └── test/                   # 🧪 TESTING
│       ├── integration/
│       └── unit/
│
├── .env                        # Secrets (Database URL, JWT Secret)
├── drizzle.config.ts           # Drizzle Kit Config
├── next.config.ts              # Next.js Config
├── package.json                # Dependencies List
├── postcss.config.mjs          # Tailwind v4 Plugin Setup
├── tailwind.config.ts          # Tailwind Theme Config
└── tsconfig.json               # TypeScript Paths (@/* -> ./src/*)
```
