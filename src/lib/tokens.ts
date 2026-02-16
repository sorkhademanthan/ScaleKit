import { db } from "@/db";
import { verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db
            .select()
            .from(verificationTokens)
            .where(eq(verificationTokens.identifier, email))
            .limit(1);

        return verificationToken[0];
    } catch {
        return null;
    }
};

export const getVerificationTokenByToken = async (token: string) => {
    try {
        const verificationToken = await db
            .select()
            .from(verificationTokens)
            .where(eq(verificationTokens.token, token))
            .limit(1);

        return verificationToken[0];
    } catch {
        return null;
    }
};

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 Hour

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await db
            .delete(verificationTokens)
            .where(eq(verificationTokens.identifier, email));
    }

    const verificationToken = await db
        .insert(verificationTokens)
        .values({
            identifier: email,
            token,
            expires,
        })
        .returning();

    return verificationToken[0];
};
