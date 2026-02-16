"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Permission } from "@registry/auth/types";
import { ReactNode } from "react";

interface PermissionGuardProps {
    permission: Permission;
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * A client-side guard component that only renders its children if the current user has the required permission.
 * 
 * Example:
 * <PermissionGuard permission="delete:users" fallback={<span>Unauthorized</span>}>
 *   <DeleteUserButton />
 * </PermissionGuard>
 */
export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
    const { hasPermission, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Not authenticated, definitely no permissions.
        return fallback;
    }

    if (hasPermission(permission)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}
