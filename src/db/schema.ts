import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash"), // Nullable for OAuth-only users
    name: text("name"), // Optional name
    image: text("image"), // Optional avatar URL
    githubId: varchar("github_id", { length: 255 }).unique(), // Store GitHub User ID
    role: text("role").default("user").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
