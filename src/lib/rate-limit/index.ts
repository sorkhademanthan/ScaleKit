
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check environment variables first
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// In-Memory fallback for development without Redis
const cache = new Map();

// Simple In-Memory Fallback Implementation
interface RateLimiter {
    limit: (identifier: string) => Promise<{ success: boolean; limit: number; remaining: number; reset: number }>;
}

class InMemoryRatelimit implements RateLimiter {
    private requests: Map<string, { count: number, expires: number }> = new Map();
    private tokenLimit: number; // Renamed to avoid collision with method name
    private windowMs: number;

    constructor(limit: number, windowStr: string) {
        this.tokenLimit = limit;
        // Parse window string (e.g., "10 s", "1 m")
        const [val, unit] = windowStr.split(' ');
        const multiplier = unit === 's' ? 1000 : unit === 'm' ? 60000 : 3600000;
        this.windowMs = parseInt(val) * multiplier;
    }

    async limit(identifier: string) {
        const now = Date.now();
        const record = this.requests.get(identifier);

        if (!record || now > record.expires) {
            this.requests.set(identifier, { count: 1, expires: now + this.windowMs });
            return { success: true, limit: this.tokenLimit, remaining: this.tokenLimit - 1, reset: now + this.windowMs };
        }

        if (record.count >= this.tokenLimit) {
            return { success: false, limit: this.tokenLimit, remaining: 0, reset: record.expires };
        }

        record.count += 1;
        return { success: true, limit: this.tokenLimit, remaining: this.tokenLimit - record.count, reset: record.expires };
    }
}

// Helper to create rate limiter
const createRateLimiter = (requests: number, window: `${number} s` | `${number} m` | `${number} h`): RateLimiter => {
    if (redisUrl && redisToken) {
        const redis = new Redis({
            url: redisUrl,
            token: redisToken,
        });

        return new Ratelimit({
            redis: redis,
            limiter: Ratelimit.slidingWindow(requests, window),
            ephemeralCache: cache,
        });
    }

    // In-Memory Fallback
    return new InMemoryRatelimit(requests, window);
};

// Define limits for different scenarios
const limiters = {
    api: createRateLimiter(20, "10 s"), // Relaxed for dashboard usage
    auth: createRateLimiter(5, "1 m"),
    public: createRateLimiter(20, "1 m"),
};

/**
 * Validates rate limit for a given identifier (IP or User ID)
 */
export async function checkRateLimit(identifier: string, type: 'api' | 'auth' | 'public' = 'api') {
    const limiter = limiters[type];
    return await limiter.limit(identifier);
}
