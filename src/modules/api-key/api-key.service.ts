import { db } from "@/db";
import { apiKeys } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";
import { ActivityService } from "@/modules/activity/activity.service";

/**
 * Service to manage API Keys.
 * 
 * Keys are generated with a prefix `sk_live_`.
 * We store a SHA-256 hash of the full key.
 * We also store the first few chars (prefix) to easily identify/list them, 
 * but our schema stores `keyPrefix` which we can use for the standard "sk_live_..." 
 * coupled with a `...Last4` concept if we wanted, but let's stick to storing:
 * - name: "My production key"
 * - keyPrefix: "sk_live_1234..." (Wait, storing prefix might expose too much?)
 * 
 * Better approach:
 * - Full Key: `sk_live_<32_random_bytes_hex>`
 * - Hashed: `sha256(Full Key)` stored in `keyHash`
 * - Prefix: `sk_live_` + first 4 chars of random part? stored in `keyPrefix` for display?
 *   Actually, typically we just display `sk_live_...e4a1` (last 4).
 *   Let's store `keyPrefix` as the masked version for display: `sk_live_...<last4>`
 */
export class ApiKeyService {

    // 1. Create API Key
    static async createKey(workspaceId: string, userId: string, name: string) {
        // Generate Token
        const randomBytes = crypto.randomBytes(32).toString('hex');
        const token = `sk_live_${randomBytes}`;

        // Hash it
        const hash = crypto.createHash('sha256').update(token).digest('hex');

        // Mask for display (e.g., "sk_live_...abcd")
        const last4 = token.slice(-4);
        const masked = `sk_live_...${last4}`;

        await db.insert(apiKeys).values({
            workspaceId,
            name,
            keyHash: hash,
            keyPrefix: masked,
        });

        // Log Activity
        await ActivityService.log(
            workspaceId,
            userId,
            "apikey.created",
            "apikey",
            masked,
            { name }
        );

        // Return the FULL token one-time
        return token;
    }

    // 2. List Keys
    static async listKeys(workspaceId: string) {
        return await db.query.apiKeys.findMany({
            where: eq(apiKeys.workspaceId, workspaceId),
            orderBy: [desc(apiKeys.createdAt)],
            columns: {
                id: true,
                name: true,
                keyPrefix: true, // This is the masked version
                lastUsedAt: true,
                createdAt: true,
            }
        });
    }

    // 3. Revoke Key
    static async revokeKey(workspaceId: string, userId: string, keyId: string) {
        // Get key to log name
        const key = await db.query.apiKeys.findFirst({
            where: eq(apiKeys.id, keyId),
        });

        if (key) {
            await db.delete(apiKeys).where(eq(apiKeys.id, keyId));

            await ActivityService.log(
                workspaceId,
                userId,
                "apikey.revoked",
                "apikey",
                key.keyPrefix, // Log the masked key
                { name: key.name }
            );
        }
    }

    // 4. Validate Key (for Middleware/API)
    static async validateKey(token: string) {
        const hash = crypto.createHash('sha256').update(token).digest('hex');

        const key = await db.query.apiKeys.findFirst({
            where: eq(apiKeys.keyHash, hash),
            with: {
                workspace: true
            }
        });

        if (key) {
            // Async update lastUsedAt so we don't block
            // fire & forget
            db.update(apiKeys)
                .set({ lastUsedAt: new Date() })
                .where(eq(apiKeys.id, key.id))
                .catch(err => console.error("Failed to update api key lastUsedAt", err));

            return key;
        }
        return null;
    }
}
