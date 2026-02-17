# ScaleKit Testing Guide

This guide outlines how to verify that the ScaleKit application is working correctly, specifically focusing on the new **Workspaces & Invites** features.

## ✅ Prerequisites

1.  **Environment Variables**: Ensure `.env` is populated with `DATABASE_URL`, `RESEND_API_KEY` (optional for local testing), etc.
2.  **Database**: Ensure your Postgres database is running and schema is pushed (`npm run db:push`).
3.  **Dev Server**: Run `npm run dev` to start the application.

---

## 🧪 Automated Verification Scripts

We have created several scripts to verify core backend logic without using the UI. Run these from your terminal:

### 1. Verify Database Connection
Checks if the application can connect to your Postgres instance.
```bash
node scripts/test-db.js
```

### 2. Verify Workspaces & Invites Logic
Tests the full lifecycle: Create User -> Create Workspace -> Check Owner Role -> Send Invite.
```bash
npx tsx scripts/test-workspaces.ts
```
*Expected Output:* `🎉 Test Suite Complete!`

### 3. Generate Password Reset Link (Manual)
Since emails might not send in development without a verified domain, use this to get a valid reset link.
```bash
npx tsx scripts/get-reset-link.ts your-email@example.com
```

---

## 🕵️ Manual UI Testing Scenarios

Follow these steps to verify the User Interface flows.

### Scenario A: New User Onboarding
1.  Navigate to `http://localhost:3000/register`.
2.  Create a new account (e.g., `test@example.com`).
3.  **Verification**: You should be redirected to `/dashboard`.
4.  **First Workspace**: If you have no workspaces, you should see an empty state or be prompted to create one via the Sidebar Switcher.

### Scenario B: Create a Workspace
1.  In the Dashboard Sidebar (top-left), click the **Workspace Switcher**.
2.  Select **"Create Team"**.
3.  Enter a Name (e.g., "Acme Corp") and Slug (e.g., "acme").
4.  Click **Create**.
5.  **Verification**: The page should reload/redirect to `/dashboard/acme`. The sidebar should now show "Acme Corp".

### Scenario C: Invite a Member
1.  Navigate to **Settings > Team Members** (or `/dashboard/[slug]/settings/members`).
2.  Click **"Invite User"**.
3.  Enter an email (e.g., `colleague@example.com`) and select role `Member`.
4.  Click **Send Invite**.
5.  **Verification**: The user should appear in the "Pending Invitations" list.
6.  **Email Check**: Check your server logs for "FALLBACK INVITE LINK LOG" if emails are not configured, or check the `invitations` table.

### Scenario D: Accept an Invite
1.  **Get the Link**: 
    *   If relying on logs: Copy the link printed in your terminal running `npm run dev`.
    *   If using DB: Run `npx drizzle-kit studio` to view the `invitations` table and get the `token`. Construct URL: `http://localhost:3000/invites/[token]`.
2.  Open the Invite Link in an Incognito window (or logout first).
3.  You should see the "Join [Workspace]" page.
4.  **Action**: Login or Sign Up.
5.  **Verification**: You should be redirected to the workspace dashboard as a member.

---

## 🛠 Troubleshooting

**Issue: "Database does not exist"**
*   Fix: Check `DATABASE_URL` in `.env`. Ensure the database is created in Postgres.

**Issue: Emails not received**
*   Fix: Resend "Test Mode" only sends to the email you signed up with. Check your terminal console for the "FALLBACK LINK" logs which print the URLs directly.

**Issue: "Role mismatch" or Permission errors**
*   Fix: Ensure you rely on the `WorkspaceService` which correctly assigns `owner` role upon creation.

---

## 🚀 Next Steps
If all tests pass, the Multi-Tenant foundation is solid! 
Next phases typically involve:
- **Billing integration (Stripe)**
- **Advanced RBAC (Role Guards)**
