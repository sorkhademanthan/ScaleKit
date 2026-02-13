import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(), // using password_hash in DB, passwordHash in code? No, Drizzle maps columns.
    role: text("role").default("user").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(), // Ideally use triggers or manual update
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
