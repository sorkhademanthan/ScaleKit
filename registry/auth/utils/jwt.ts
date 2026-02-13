import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'scalekit-secret-key-change-me';

export interface TokenPayload {
    userId: string;
    role: string;
    iat?: number;
    exp?: number;
}

export const signToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>, expiresIn: string | number = '1h'): string => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, SECRET_KEY) as TokenPayload;
    } catch {
        return null;
    }
};
