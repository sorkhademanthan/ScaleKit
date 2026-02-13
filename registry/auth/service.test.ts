import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService, AuthError } from './service';
import { UserRepository, User } from './types';
import { hashPassword } from './utils/password';
import { signToken } from './utils/jwt';

// Mock Repository
class MockUserRepository implements UserRepository {
    private users: User[] = [];

    async findByEmail(email: string): Promise<User | null> {
        return this.users.find(u => u.email === email) || null;
    }

    async findById(id: string): Promise<User | null> {
        return this.users.find(u => u.id === id) || null;
    }

    async create(user: User): Promise<User> {
        this.users.push(user);
        return user;
    }
}

describe('AuthService', () => {
    let service: AuthService;
    let repository: MockUserRepository;

    beforeEach(() => {
        repository = new MockUserRepository();
        service = new AuthService(repository);
    });

    describe('register', () => {
        it('creates a new user successfully', async () => {
            const result = await service.register('test@example.com', 'password123');

            expect(result.user.email).toBe('test@example.com');
            expect(result.token).toBeDefined();
            expect((result.user as any).passwordHash).toBeUndefined(); // Should be stripped

            const savedUser = await repository.findByEmail('test@example.com');
            expect(savedUser).toBeDefined();
        });

        it('prevents duplicate emails', async () => {
            await service.register('test@example.com', 'password123');

            await expect(
                service.register('test@example.com', 'anotherPass')
            ).rejects.toThrow(AuthError);
        });
    });

    describe('login', () => {
        it('authenticates valid credentials', async () => {
            // Setup
            await service.register('test@example.com', 'password123');

            // Test
            const result = await service.login('test@example.com', 'password123');
            expect(result.user.email).toBe('test@example.com');
            expect(result.token).toBeDefined();
        });

        it('rejects invalid password', async () => {
            await service.register('test@example.com', 'password123');

            await expect(
                service.login('test@example.com', 'wrongPass')
            ).rejects.toThrow('Invalid email or password');
        });

        it('rejects non-existent user', async () => {
            await expect(
                service.login('ghost@example.com', 'password123')
            ).rejects.toThrow('Invalid email or password');
        });
    });

    describe('validateSession', () => {
        it('returns user for valid token', async () => {
            const { token, user } = await service.register('test@example.com', 'password123');

            const sessionUser = await service.validateSession(token);
            expect(sessionUser).toBeDefined();
            expect(sessionUser?.id).toBe(user.id);
        });

        it('returns null for invalid token', async () => {
            const result = await service.validateSession('invalid.token.here');
            expect(result).toBeNull();
        });
    });
});
