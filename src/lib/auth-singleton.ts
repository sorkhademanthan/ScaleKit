import { AuthService, AuthError } from '@registry/auth/service';
import { InMemoryUserRepository } from '@registry/auth/repository/in-memory';
import { DrizzleUserRepository } from '@registry/auth/repository/drizzle';
import { checkDbConnection } from '@/db'; // Use @/db -> src/db/index.ts

const globalForAuth = global as unknown as { authService: AuthService | undefined };

// Define a proxy-like service that lazily initializes the real service
class LazyAuthService {
    private service: AuthService | null = null;
    private initializationPromise: Promise<void> | null = null;

    // Use in-memory by default until proven otherwise
    private fallbackRepository = new InMemoryUserRepository();
    private fallbackService = new AuthService(this.fallbackRepository);

    private async getService(): Promise<AuthService> {
        // If we have strict mode initialized service, use it.
        if (this.service) return this.service;

        // If init is in progress, wait
        if (this.initializationPromise) {
            await this.initializationPromise;
            return this.service || this.fallbackService;
        }

        // Start initialization
        this.initializationPromise = (async () => {
            // Check existing global instance first (for HMR)
            if (globalForAuth.authService) {
                this.service = globalForAuth.authService;
                return;
            }

            console.log("🔄 Initializing Auth Service...");
            const dbConnected = process.env.DATABASE_URL && await checkDbConnection();

            if (dbConnected) {
                console.log("🔥 Using Postgres Database Repository");
                const repo = new DrizzleUserRepository();
                this.service = new AuthService(repo);
            } else {
                console.warn("⚠️ Database connection failed or missing. Using In-Memory Repository.");
                this.service = this.fallbackService;
            }

            // Save to global for HMR
            if (process.env.NODE_ENV !== 'production') {
                globalForAuth.authService = this.service;
            }
        })();

        await this.initializationPromise;
        return this.service || this.fallbackService;
    }

    // Proxy methods compatible with AuthService interface
    async register(email: string, password: string, role: string = 'user'): Promise<any> {
        const svc = await this.getService();
        return svc.register(email, password, role as any);
    }

    async login(email: string, password: string): Promise<any> {
        const svc = await this.getService();
        return svc.login(email, password);
    }

    async validateSession(token: string): Promise<any> {
        const svc = await this.getService();
        return svc.validateSession(token);
    }

    // Explicitly proxy the new loginWithGithub method
    async loginWithGithub(email: string, githubId: string, name: string | null, avatarUrl: string | null): Promise<any> {
        const svc = await this.getService();
        return svc.loginWithGithub(email, githubId, name, avatarUrl);
    }

    // Explicitly proxy the new loginWithGoogle method
    async loginWithGoogle(email: string, googleId: string, name: string | null, avatarUrl: string | null): Promise<any> {
        const svc = await this.getService();
        return svc.loginWithGoogle(email, googleId, name, avatarUrl);
    }
}

export const authService = new LazyAuthService() as unknown as AuthService;
// Casting as unknown as AuthService allows usage as AuthService, 
// though technically methods are async and return Promises. 
// Wait, AuthService methods return Promises anyway. So interface matches.
// But LazyAuthService has extra private members. That's fine.

// Re-export AuthError for use in API routes
export { AuthError } from '@registry/auth/service';
