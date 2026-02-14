import { User, UserRepository } from '../types';

export class InMemoryUserRepository implements UserRepository {
    private users: User[] = [];

    async findByEmail(email: string): Promise<User | null> {
        return this.users.find(u => u.email === email) || null;
    }

    async findById(id: string): Promise<User | null> {
        return this.users.find(u => u.id === id) || null;
    }

    async create(user: User): Promise<User> {
        // Ensure new fields are handled if present (interface matches)
        this.users.push(user);
        return user;
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) throw new Error('User not found');

        const updatedUser = { ...this.users[index], ...data, updatedAt: new Date() };
        this.users[index] = updatedUser as User; // Cast to ensure
        return updatedUser as User;
    }
}
