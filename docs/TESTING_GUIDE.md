# ScaleKit Authentication Testing Guide

This guide provides step-by-step instructions to verify the authentication module, including sign-up, login, OAuth integrations (GitHub, Google), and session management.

## Prerequisites

1.  **Server Running**: Ensure your development server is running on `http://localhost:3000`.
    ```bash
    npm run dev
    ```
2.  **Environment Variables**: Verify your `.env` file has the correct credentials:
    -   `DATABASE_URL` (PostgreSQL)
    -   `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`
    -   `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`

---

## 1. Email & Password Authentication

### Test Case 1.1: New User Registration
1.  Navigate to [http://localhost:3000/register](http://localhost:3000/register).
2.  Enter a new email (e.g., `test@example.com`) and password.
3.  Click **Sign Up**.
4.  **Expected Result**: You should be redirected to the `/login` page with a success message (or directly to dashboard if auto-login is enabled).

### Test Case 1.2: Login with Credentials
1.  Navigate to [http://localhost:3000/login](http://localhost:3000/login).
2.  Enter the credentials you just created.
3.  Click **Sign In**.
4.  **Expected Result**: You should be redirected to the `/dashboard`.
5.  **Verify**: Check the top right corner of the dashboard; it should display the initial of your email (e.g., "T").

---

## 2. GitHub OAuth Integration

### Test Case 2.1: Sign Up/Login with GitHub
1.  Use a browser where you are logged into GitHub (or incognito).
2.  Navigate to [http://localhost:3000/login](http://localhost:3000/login).
3.  Click **Continue with GitHub**.
4.  **Expected Result**:
    -   You are redirected to GitHub's authorization page.
    -   After approving, you are redirected back to the `/dashboard`.
5.  **Verify**: The dashboard should show your GitHub profile initial or avatar.

---

## 3. Google OAuth Integration

### Test Case 3.1: Sign Up/Login with Google
1.  Use a browser where you are logged into Google.
2.  Navigate to [http://localhost:3000/login](http://localhost:3000/login).
3.  Click **Continue with Google**.
4.  **Expected Result**:
    -   You are redirected to Google's consent screen.
    -   After selecting an account, you are redirected back to the `/dashboard`.
5.  **Verify**: The dashboard should show your Google profile initial.

---

## 4. Session Management & Logout

### Test Case 4.1: Persistent Session
1.  Log in using any method above.
2.  Refresh the page.
3.  **Expected Result**: You stay logged in on the `/dashboard`.
4.  Close the tab and reopen [http://localhost:3000/dashboard](http://localhost:3000/dashboard).
5.  **Expected Result**: You are still logged in (session cookie persists).

### Test Case 4.2: Logout
1.  On the Dashboard sidebar (bottom left), click **Log out**.
2.  **Expected Result**:
    -   You are redirected to the `/login` page.
    -   The session cookie is removed.
3.  Try accessing [http://localhost:3000/dashboard](http://localhost:3000/dashboard) manually.
4.  **Expected Result**: You are redirected back to `/login`.

---

## Troubleshooting

-   **"OAuth Callback Error"**: Usually means the Redirect URI in your OAuth provider settings (GitHub/Google) does not match `http://localhost:3000/api/auth/callback/[provider]` exactly.
-   **Database Errors**: Run `npm run db:studio` to inspect the database and ensure the `users` table is correctly populated.
