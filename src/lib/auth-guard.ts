import { authService, AuthError } from "@/lib/auth-singleton";
import { Permission, User } from "@registry/auth/types";
import { hasPermission } from "@registry/auth/rbac";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Validates the session and ensures the user has the required permission.
 * Returns the user object if authorized, or throws an AuthError/Response.
 */
export async function requirePermission(permission: Permission): Promise<User> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        throw new AuthError("UNAUTHORIZED", "No session token provided");
    }

    const user = await authService.validateSession(token);

    if (!user) {
        throw new AuthError("UNAUTHORIZED", "Invalid session");
    }

    // Cast user to User type since validateSession returns Omit<User, 'passwordHash'>
    // and hasPermission accepts User | Role. This is safe as hasPermission only checks .role
    if (!hasPermission(user as User, permission)) {
        throw new AuthError("FORBIDDEN", `Missing permission: ${permission}`);
    }

    // Return full user object (casted back to full User for consistency, though passwordHash is missing)
    return user as unknown as User;
}

/**
 * Higher-order function to wrap API route handlers with permission checking.
 */
export function withPermission(permission: Permission, handler: (req: Request, user: User) => Promise<NextResponse>) {
    return async (req: Request) => {
        try {
            const user = await requirePermission(permission);
            return handler(req, user);
        } catch (error: any) {
            if (error.code === "UNAUTHORIZED") {
                return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            }
            if (error.code === "FORBIDDEN") {
                return NextResponse.json({ message: "Forbidden" }, { status: 403 });
            }
            console.error("Auth Guard Error:", error);
            return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }
    };
}
