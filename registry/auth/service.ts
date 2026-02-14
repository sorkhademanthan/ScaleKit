import { User, UserRepository, Session, AuthResult } from './types';
import { hashPassword, verifyPassword } from './utils/password';
import { signToken, verifyToken } from './utils/jwt';
import crypto from 'crypto';

export class AuthError extends Error {
    constructor(public code: string, message: string) {
        super(message);
        this.name = 'AuthError';
    }
}

export class AuthService {
    constructor(private userRepository: UserRepository) { }

    /**
     * Registers a new user with the given email and password.
     */
    async register(email: string, password: string, role: User['role'] = 'user'): Promise<AuthResult> {
        // 1. Check if user already exists
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new AuthError('USER_EXISTS', 'User with this email already exists');
        }

        // 2. Hash password
        const passwordHash = await hashPassword(password);

        // 3. Create user
        const newUser: User = {
            id: crypto.randomUUID(),
            email,
            role,
            passwordHash,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const createdUser = await this.userRepository.create(newUser);

        // 4. Generate token
        const token = signToken({ userId: createdUser.id, role: createdUser.role });

        // 5. Return result (strip sensitive data)
        const { passwordHash: _, ...safeUser } = createdUser;
        return { user: safeUser, token };
    }

    /**
     * Authenticates a user with email and password.
     */
    async login(email: string, password: string): Promise<AuthResult> {
        // 1. Find user
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password');
        }

        // 2. Verify existence of password hash (OAuth users might not have one)
        if (!user.passwordHash) {
            throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password');
        }

        // 3. Verify password
        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) {
            throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password');
        }

        // 4. Generate token
        const token = signToken({ userId: user.id, role: user.role });

        // 5. Return result
        const { passwordHash: _, ...safeUser } = user;
        return { user: safeUser, token };
    }

    /**
     * Authenticates or Registers a user via OAuth provider (e.g. GitHub).
     */
    async loginWithGithub(email: string, githubId: string, name: string | null, avatarUrl: string | null): Promise<AuthResult> {
        // Shared logic, could be extracted to generic "loginWithOAuth" if providers grow

        let user: User | null = null;

        // Try to find by email first (common identifier)
        user = await this.userRepository.findByEmail(email);

        if (user) {
            // User exists.

            // Check if we need to update githubId or profile
            if (this.userRepository.update && (!user.githubId || !user.image || !user.name)) {
                user = await this.userRepository.update(user.id, {
                    githubId: user.githubId || githubId,
                    name: user.name || name,
                    image: user.image || avatarUrl
                });
            }
        } else {
            // Create new user
            const newUser: User = {
                id: crypto.randomUUID(),
                email,
                role: 'user',
                passwordHash: null, // No password for OAuth users
                githubId,
                name,
                image: avatarUrl,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            user = await this.userRepository.create(newUser);
        }

        // Generate token
        const token = signToken({ userId: user.id, role: user.role });
        const { passwordHash: _, ...safeUser } = user;
        return { user: safeUser, token };
    }

    /**
     * Authenticates or Registers a user via Google OAuth.
     */
    async loginWithGoogle(email: string, googleId: string, name: string | null, avatarUrl: string | null): Promise<AuthResult> {
        let user: User | null = null;

        // Try to find by email first
        user = await this.userRepository.findByEmail(email);

        if (user) {
            // User exists
            if (this.userRepository.update && (!user.googleId || !user.image || !user.name)) {
                user = await this.userRepository.update(user.id, {
                    googleId: user.googleId || googleId,
                    name: user.name || name,
                    image: user.image || avatarUrl
                });
            }
        } else {
            // Create new user
            const newUser: User = {
                id: crypto.randomUUID(),
                email,
                role: 'user',
                passwordHash: null,
                googleId,
                name,
                image: avatarUrl,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            user = await this.userRepository.create(newUser);
        }

        const token = signToken({ userId: user.id, role: user.role });
        const { passwordHash: _, ...safeUser } = user;
        return { user: safeUser, token };
    }

    /**
     * Validates a session token and returns the current user.
     */
    async validateSession(token: string): Promise<Omit<User, 'passwordHash'> | null> {
        const payload = verifyToken(token);

        if (!payload || !payload.userId) {
            return null;
        }

        const user = await this.userRepository.findById(payload.userId);
        if (!user) {
            return null;
        }

        const { passwordHash: _, ...safeUser } = user;
        return safeUser;
    }
}
