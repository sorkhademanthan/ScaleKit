import { pgTable, text, timestamp, uuid, varchar, primaryKey } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("email_verified", { mode: "date" }), // Null until verified
    passwordHash: text("password_hash"), // Nullable for OAuth-only users
    name: text("name"), // Optional name
    image: text("image"), // Optional avatar URL
    bio: text("bio"), // Optional bio
    githubId: varchar("github_id", { length: 255 }).unique(), // Store GitHub User ID
    googleId: varchar("google_id", { length: 255 }).unique(), // Store Google User ID
    role: text("role").default("user").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verificationTokens = pgTable(
    "verification_tokens",
    {
        identifier: text("identifier").notNull(), // Usually email
        token: text("token").notNull().unique(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type VerificationToken = typeof verificationTokens.$inferSelect;
