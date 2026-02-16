import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;

if (redisUrl && redisToken) {
    redis = new Redis({
        url: redisUrl,
        token: redisToken,
    });
} else {
    // Only warn in production, otherwise it's just noisy in dev
    if (process.env.NODE_ENV === 'production') {
        console.warn("Redis credentials missing! Rate limiting is disabled.");
    }
}

export { redis };

export const rateLimit = async (identifier: string) => {
    // If Redis is not configured, bypass rate limiting (Fail Open)
    if (!redis) {
        // console.log("Rate limit bypassed (Redis not configured)"); 
        return { success: true, remaining: 10 };
    }

    // Basic rate limit: 3 requests per hour
    const limit = 3;
    const duration = 60 * 60; // 1 hour in seconds
    const key = `rate_limit:${identifier}`;

    try {
        const requests = await redis.incr(key);
        if (requests === 1) {
            await redis.expire(key, duration);
        }

        return {
            success: requests <= limit,
            remaining: Math.max(0, limit - requests),
        };
    } catch (error) {
        console.error("Redis Rate Limit Error:", error);
        // Fail open on Redis error so we don't block users
        return { success: true, remaining: 1 };
    }
};
