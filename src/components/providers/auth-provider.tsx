"use client";

import { createContext, useContext, ReactNode } from "react";
import { User, Permission } from "@registry/auth/types";
import { hasPermission as checkPermission } from "@registry/auth/rbac";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
    user: User | null;
}

export function AuthProvider({ children, user }: AuthProviderProps) {
    const hasPermission = (permission: Permission): boolean => {
        if (!user) return false;
        // We cast because checkPermission accepts User | Role, and our user object matches User shape
        // except passwordHash might be missing, which is fine for RBAC check
        return checkPermission(user, permission);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
