# ScaleKit Authentication & User Settings Testing Guide

This guide provides step-by-step instructions to verify the authentication module (including OAuth) and user settings (Avatar Upload).

## Prerequisites

1.  **Server Running**: Ensure your development server is running on `http://localhost:3000`.
    ```bash
    npm run dev
    ```
2.  **Environment Variables**: Verify your `.env` file has the correct credentials:
    -   `DATABASE_URL` (PostgreSQL)
    -   `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`
    -   `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
    -   `STORAGE_ENDPOINT` (e.g. `https://<account_id>.r2.cloudflarestorage.com` or empty for AWS S3)
    -   `STORAGE_ACCESS_KEY_ID` & `STORAGE_SECRET_ACCESS_KEY`
    -   `STORAGE_BUCKET_NAME`

---

## 1. Authentication (Email, GitHub, Google)

### Test Case 1.1: Verify Login & Registration
1.  Navigate to [http://localhost:3000/register](http://localhost:3000/register).
2.  Test Email/Password registration.
3.  Test "Continue with GitHub".
4.  Test "Continue with Google".
5.  **Verify**: Successful login redirects to `/dashboard`.

### Test Case 1.2: Verify Logout
1.  Click **Log out** in the sidebar.
2.  **Verify**: You are redirected to `/login`.

---

## 2. User Settings & Avatar Upload

### Test Case 2.1: Navigation
1.  Log in to the dashboard.
2.  Click **Settings** in the sidebar.
3.  **Verify**: You see the "Settings" page with your current avatar (or initial).

### Test Case 2.2: Avatar Upload (Direct-to-S3/R2)
1.  Hover over the avatar image → Click the **Camera Icon** (or click "Upload").
2.  Select an image file (PNG, JPG, or WebP, max 5MB).
3.  **Verify**:
    -   The image immediately updates (Optimistic UI).
    -   A loading spinner appears briefly.
    -   The image persists after you refresh the page.

### Troubleshooting Uploads
-   **"Upload to storage failed"**: Check your CORS configuration on your S3 bucket or R2 bucket.
    -   **Allowed Origins**: `http://localhost:3000`
    -   **Allowed Methods**: `PUT`, `GET`
    -   **Allowed Headers**: `*` or `Content-Type`
    -   **Expose Headers**: `ETag`
-   **"Failed to get upload URL"**: Check your `.env` credentials (`STORAGE_...`).
