# Features Implementation Roadmap

We are tackling core features sequentially to transition from a technical prototype to a complete product.

## ✅ Phase 1 & 2: Base Auth & Database
- Setup Drizzle ORM, Postgres, and basic Email/Password Auth.

## ✅ Phase 3: OAuth Integration (GitHub and Google)
- **Goal**: Allow users to sign up/login with one click.
- **Status**: Completed. GitHub and Google providers configured and integrated.

## ✅ Phase 4: User Settings & Profile
- **Goal**: Enable users to manage their identity (Name, Avatar, Bio).
- **Status**: Completed. Profile page, Cloudinary avatar uploads, and Theme switching implemented.

## ✅ Phase 5: Email Verification (Resend)
- **Goal**: Verify user ownership of their email address for security.
- **Status**: Completed. Verification emails sent via Resend, token validation logic implemented.

## ✅ Phase 6: Role-Based Access Control (RBAC)
- **Goal**: Secure routes and resources based on user roles (Admin vs User).
- **Status**: Completed. `User` and `Admin` roles defined, `withPermission` guard implemented for APIs and Frontend.

---

## ✅ Phase 7: Password Reset
- **Goal**: Allow users to recover lost passwords securely.
- **Status**: Completed. Reset token flow, email templates, and secure API endpoints implemented.

## ✅ Phase 8: Core Product - Workspaces (Teams)
- **Goal**: Allow users to organize their work in teams (Multi-tenancy).
- **Status**: Completed. 
    - Full workspace creation and switching logic.
    - Member invites via email (Resend) and role management.
    - Settings pages for workspace configuration.

---

## 🚧 Phase 9: Billing & Subscriptions (Stripe) (Next Priority)
- **Goal**: Monetize the application.
- **Tasks**:
    1.  **Schema**: Add `subscription_status`, `stripe_customer_id`, `plan` to Workspaces table.
    2.  **Integration**: Stripe Checkout (for upgrades) & Webhooks (for listening to payment events).
    3.  **UI**: Pricing page (public) and Billing portal (internal settings).
    4.  **Logic**: Enforce plan limits (e.g. "Free plan has max 3 members").

## 🔮 Phase 10: Advanced Features
- **Goal**: Polish and production readiness.
- **Tasks**:
    1.  **Activity Logs**: Track user actions for audits.
    2.  **API Keys**: Allow users to generate API keys for programmatic access.
    3.  **Rate Limiting**: Protect API routes.

---

**Current Status**: Multi-tenancy is fully operational. Ready to start **Phase 9 (Billing/Stripe)**.
