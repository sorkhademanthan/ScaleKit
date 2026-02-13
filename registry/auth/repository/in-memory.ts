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
        this.users.push(user);
        return user;
    }
}
