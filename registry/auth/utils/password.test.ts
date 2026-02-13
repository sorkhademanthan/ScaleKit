import { hashPassword, verifyPassword } from './password';
import { describe, it, expect } from 'vitest';

describe('Password Utils', () => {
    it('hashes passwords securely', async () => {
        const password = 'mySecretPassword123';
        const hash = await hashPassword(password);
        expect(hash).not.toBe(password);
        expect(hash.length).toBeGreaterThan(10);
    });

    it('verifies correct passwords', async () => {
        const password = 'mySecretPassword123';
        const hash = await hashPassword(password);
        expect(await verifyPassword(password, hash)).toBe(true);
    });

    it('rejects incorrect passwords', async () => {
        const password = 'mySecretPassword123';
        const hash = await hashPassword(password);
        expect(await verifyPassword('wrongPassword', hash)).toBe(false);
    });
});
