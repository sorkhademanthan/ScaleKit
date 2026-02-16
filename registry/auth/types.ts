export type Role = 'admin' | 'user' | 'guest';

export type Permission =
    // User Management
    | 'read:users'
    | 'write:users'
    | 'delete:users'
    // Content Management (Posts/Articles)
    | 'read:posts'
    | 'write:posts'
    | 'delete:posts'
    // System Settings
    | 'manage:settings'
    | 'view:analytics'
    // User Self-Management
    | 'manage:profile';

export interface User {
    id: string;
    email: string;
    emailVerified?: Date | null;
    role: Role;
    passwordHash: string | null; // Stored securely, now nullable for OAuth
    name?: string | null;
    image?: string | null;
    bio?: string | null;
    githubId?: string | null;
    googleId?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Session {
    userId: string;
    expiresAt: Date;
    token?: string;
}

export interface AuthResult {
    user: Omit<User, 'passwordHash'>;
    token: string;
}

export type AuthError = {
    code: string;
    message: string;
}

export interface UserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(user: User): Promise<User>;
    update?(id: string, data: Partial<User>): Promise<User>;
}
