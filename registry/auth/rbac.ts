import { Role, Permission, User } from './types';

// Define which permissions each role has
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    admin: [
        'read:users',
        'write:users',
        'delete:users',
        'read:posts',
        'write:posts',
        'delete:posts',
        'manage:settings',
        'view:analytics',
    ],
    user: [
        'read:users', // Users can read other users (public profiles)
        'read:posts',
        'write:posts', // Users can create posts
        // No delete:posts or manage:settings
    ],
    guest: [
        'read:posts',
    ],
};

/**
 * Checks if a user or role has a specific permission.
 * 
 * @param actor - The User object or a Role string
 * @param permission - The permission to check for
 * @returns true if the actor has the permission, false otherwise
 */
export function hasPermission(actor: User | Role, permission: Permission): boolean {
    const role = typeof actor === 'string' ? actor : actor.role;

    // Direct role check shortcut for admins
    if (role === 'admin') return true;

    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
}

/**
 * Checks if a user or role has ALL of the specified permissions.
 */
export function hasAllPermissions(actor: User | Role, permissions: Permission[]): boolean {
    return permissions.every(p => hasPermission(actor, p));
}

/**
 * Checks if a user or role has AT LEAST ONE of the specified permissions.
 */
export function hasAnyPermission(actor: User | Role, permissions: Permission[]): boolean {
    return permissions.some(p => hasPermission(actor, p));
}
