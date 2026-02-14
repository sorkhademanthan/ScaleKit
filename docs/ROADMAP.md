# Features Implementation Roadmap

We will tackle the remaining core features sequentially to transition from a technical prototype to a complete product.

## Phase 3: OAuth Integration (GitHub)
- **Goal**: Allow users to sign up/login with one click using their GitHub account.
- **Tasks**:
    1.  **Schema Update**: Add `github_id` and `avatar_url` to `users` table.
    2.  **Infrastructure**: Register a GitHub OAuth App and get Client ID/Secret.
    3.  **Backend Logic**: creating `GET /api/auth/github` (redirect) and `GET /api/auth/github/callback`.
    4.  **Frontend**: Wire up the "Continue with GitHub" button.

## Phase 4: User Settings & Profile
- **Goal**: Enable users to manage their identity (Name, Avatar).
- **Tasks**:
    1.  **API**: Create `PATCH /api/users/me` endpoint.
    2.  **UI**: Build a premium `Settings` page with form validation.
    3.  **UX**: Update the Dashboard sidebar and header to display real user data.

## Phase 5: Email Verification (Resend)
- **Goal**: Verify user ownership of their email address for security.
- **Tasks**:
    1.  **Schema Update**: Add `email_verified` (boolean) and `verification_token` fields.
    2.  **Infrastructure**: Setup Resend API key.
    3.  **Backend**: Send email on signup; verify token on click.
    4.  **UI**: Add "Verify your email" banner to dashboard if unverified.

## Phase 6: Core Product - Workspaces
- **Goal**: Allow users to organize their work (e.g., "Personal", "Team").
- **Tasks**:
    1.  **Schema**: Create `workspaces` table and `workspace_members` join table.
    2.  **API**: CRUD for workspaces.
    3.  **UI**: Workspace switcher in the sidebar.

---

**Current Focus: Phase 3 (OAuth Integration)**
Let's make that "Continue with GitHub" button functional.
