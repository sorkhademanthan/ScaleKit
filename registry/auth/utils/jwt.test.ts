import { signToken, verifyToken } from './jwt';
import { describe, it, expect } from 'vitest';

describe('JWT Utils', () => {
    const payload = { userId: '123', role: 'admin' };

    it('signs and verifies tokens', () => {
        const token = signToken(payload);
        const decoded = verifyToken(token);
        expect(decoded).toBeTruthy();
        expect(decoded?.userId).toBe('123');
        expect(decoded?.role).toBe('admin');
    });

    it('returns null for invalid tokens', () => {
        expect(verifyToken('invalid-token')).toBeNull();
    });
});
