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

## 🚧 Phase 7: Password Reset (Next Priority?)
- **Goal**: Allow users to recover lost passwords securely.
- **Tasks**:
    1.  **Schema**: Add `reset_token` and `reset_token_expires` to database.
    2.  **API**: `POST /api/auth/forgot-password` (sends email) and `POST /api/auth/reset-password` (updates DB).
    3.  **UI**: "Forgot Password" link on login page, and a Reset Password form page.
    4.  **Email**: Create transactional email template for reset links.

## 🔮 Phase 8: Core Product - Workspaces (Teams)
- **Goal**: Allow users to organize their work in teams (Multi-tenancy).
- **Tasks**:
    1.  **Schema**: Create `workspaces` table and `workspace_members` join table.
    2.  **API**: CRUD for workspaces, invite members.
    3.  **UI**: Workspace switcher in the sidebar, Member management settings.
    4.  **Middleware**: Ensure users only access data within their active workspace.

## 🔮 Phase 9: Billing & Subscriptions (Stripe)
- **Goal**: Monetize the application.
- **Tasks**:
    1.  **Schema**: Add `subscription_status`, `stripe_customer_id` to Workspaces (or Users).
    2.  **Integration**: Stripe Checkout & Webhooks.
    3.  **UI**: Pricing page and Billing portal.

---

**Current Status**: Authentication is robust. Ready to move to **Phase 7 (Password Reset)** or start **Phase 8 (Workspaces)**.
