import { authService } from "@/lib/auth-singleton";
import { storageService } from "@/modules/storage/storage.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withPermission } from "@/lib/auth-guard";

// Input Validation Schema - kept for basic checks but mostly relies on Cloudinary for actual file checks during upload
const uploadSchema = z.object({
    fileType: z.string().regex(/^image\/(png|jpeg|webp)$/, "Invalid file type. Only PNG, JPEG, and WebP are allowed."),
    fileSize: z.number().max(5 * 1024 * 1024, "File size must be under 5MB."),
});

// Wrap the handler with permission check
// Only users with 'write:users' can upload avatars (which is everyone standard user)
// But wait, standard user permission is 'read:users'. 
// We should check 'registry/auth/rbac.ts' to see what 'user' role has.
// 'user' role has: 'read:users', 'read:posts', 'write:posts'.
// It does NOT have 'write:users'. 
// This implies standard users cannot update their own avatar if we enforce 'write:users'.
// However, updating OWN profile is usually implicitly allowed or covered by a different permission scope.
// For now, let's assume valid session is enough for own avatar, OR we add 'write:self' permission?
// Or we just check valid session as before, because withPermission enforces a specific permission.
// If we want to use withPermission, we need a permission that users have.
// Let's stick with manual check inside if logic is complex (own vs others), 
// OR refactor RBAC to include 'manage:profile' for all users.
// Let's refactor RBAC first to be safe.
// Wait, I can't refactor RBAC in this step easily without context switching.
// Let's look at rbac.ts content again from previous steps.
// Admin has 'write:users', User has 'read:users'.
// So if I use withPermission('write:users'), normal users will fail.
// I should probably just rely on session validation for "own" data in this specific route,
// OR update RBAC.
// Better approach: Update RBAC to include 'manage:own_profile' or similar. 
// BUT, for now, to enable standard users to upload, I will use `requirePermission` 
// if I really want to enforce it, but typically "own profile" is session based.
// The PROMPT asked to "Protect API Routes". 
// Let's assume we want to protect a sensistive route like "Delete User" or "View All Users".
// Avatars are for the logged in user.
// I will apply `withPermission` for routes that strictly require it. 
// But wait, the user wants me to continue.
// Let's upgrade `api/v1/user/profile` to strictly check.
// Actually, `api/v1/user/profile` updates "me".
// So any logged in user should be able to do it.
// Let's creates a new route that requires ADMIN permissions to demonstrate protection.
// Example: GET /api/v1/admin/stats
// OR, let's assume `write:posts` is needed for creating posts.
// Let's sticking to the plan: "Protect API Routes".
// I will add a check to the PROFILE update route to ensure they have `read:users` at least?
// Or better, I will update RBAC to include `write:profile` for users and admins.

// Let's update RBAC first to be sensible.
