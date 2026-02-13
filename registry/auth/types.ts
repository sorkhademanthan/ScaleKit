export type Role = 'admin' | 'user' | 'guest';

export type Permission =
    | 'read:users'
    | 'write:users'
    | 'delete:users'
    | 'read:posts'
    | 'write:posts';

export interface User {
    id: string;
    email: string;
    role: Role;
    passwordHash: string; // Stored securely
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
}
