import { describe, it, expect } from 'vitest';
import { hasPermission, hasAllPermissions, hasAnyPermission, ROLE_PERMISSIONS } from './rbac';
import { User, Role, Permission } from './types';

describe('RBAC System', () => {

    // Create mock users
    const adminUser: User = {
        id: '1',
        email: 'admin@example.com',
        role: 'admin',
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const regularUser: User = {
        id: '2',
        email: 'user@example.com',
        role: 'user',
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const guestUser: User = {
        id: '3',
        email: 'guest@example.com',
        role: 'guest',
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    describe('hasPermission', () => {
        it('allows admins to access everything', () => {
            expect(hasPermission(adminUser, 'delete:users')).toBe(true);
            expect(hasPermission('admin', 'write:posts')).toBe(true);
        });

        it('allows users to access regular features', () => {
            expect(hasPermission(regularUser, 'read:posts')).toBe(true);
            expect(hasPermission('user', 'write:posts')).toBe(true);
        });

        it('denies users from admin-only features', () => {
            expect(hasPermission(regularUser, 'delete:users')).toBe(false);
            expect(hasPermission('user', 'write:users')).toBe(false);
        });

        it('allows guests to read posts only', () => {
            expect(hasPermission(guestUser, 'read:posts')).toBe(true);
            expect(hasPermission('guest', 'write:posts')).toBe(false);
        });
    });

    describe('bulk permissions', () => {
        it('checks for ALL permissions correctly', () => {
            expect(hasAllPermissions('user', ['read:posts', 'write:posts'])).toBe(true);
            // User doesn't have delete:users
            expect(hasAllPermissions('user', ['read:posts', 'delete:users'])).toBe(false);
        });

        it('checks for ANY permissions correctly', () => {
            // User has read:posts so this is true even if they don't have delete:users
            expect(hasAnyPermission('user', ['read:posts', 'delete:users'])).toBe(true);
            // User has NEITHER of these
            expect(hasAnyPermission('user', ['delete:users', 'write:users'])).toBe(false);
        });
    });

    describe('configuration checks', () => {
        it('ensures permissions are defined for all roles', () => {
            const roles: Role[] = ['admin', 'user', 'guest'];
            roles.forEach(role => {
                expect(ROLE_PERMISSIONS[role]).toBeDefined();
                expect(Array.isArray(ROLE_PERMISSIONS[role])).toBe(true);
            });
        });
    });
});
