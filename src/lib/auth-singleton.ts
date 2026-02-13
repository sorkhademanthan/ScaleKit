import { AuthService, AuthError } from '@registry/auth/service';
import { InMemoryUserRepository } from '@registry/auth/repository/in-memory';

// In a real app, you'd instantiate this with a DrizzleRepository
// For now, we use the InMemory one, but keep it a singleton across requests
// NOTE: In Next.js dev mode slightly tricky because of HMR, but okay for prototype
const globalForAuth = global as unknown as { authService: AuthService };

const repository = new InMemoryUserRepository();

export const authService = globalForAuth.authService || new AuthService(repository);

// Re-export AuthError for use in API routes
export { AuthError } from '@registry/auth/service';

if (process.env.NODE_ENV !== 'production') globalForAuth.authService = authService;
