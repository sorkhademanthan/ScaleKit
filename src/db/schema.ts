import { pgTable, text, timestamp, uuid, varchar, primaryKey, uniqueIndex, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm"; // Add relations

// Define Enums
export const roleEnum = pgEnum('role', ['owner', 'admin', 'member']);
export const inviteStatusEnum = pgEnum('invite_status', ['pending', 'accepted']);

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
    lastActiveWorkspaceId: uuid("last_active_workspace_id"), // For UX: Switcher Memory
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workspaces = pgTable("workspaces", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    logoUrl: text("logo_url"),
    inviteCode: text("invite_code").unique(), // For public join links optionally
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const members = pgTable("members", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    role: roleEnum("role").default('member').notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (t) => ({
    // Use uniqueIndex instead of primaryKey because 'id' is already the PK
    unq: uniqueIndex("members_user_workspace_unique").on(t.userId, t.workspaceId),
}));

export const invitations = pgTable("invitations", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    email: text("email").notNull(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    role: roleEnum("role").default('member').notNull(),
    token: text("token").notNull().unique(), // Hashed or random secure string
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    status: inviteStatusEnum("status").default('pending').notNull(),
    inviterId: uuid("inviter_id").references(() => users.id, { onDelete: "set null" }), // Who sent it
    createdAt: timestamp("created_at").defaultNow().notNull(),
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

export const passwordResetTokens = pgTable("password_reset_tokens", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(), // Hashed version stored
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// RELATIONS
export const usersRelations = relations(users, ({ one, many }) => ({
    members: many(members),
    createdWorkspaces: many(members), // Technicaly, ownership is determined by role in members, but we might want this if we had a creator_id on workspace
}));

export const workspacesRelations = relations(workspaces, ({ many }) => ({
    members: many(members),
    invitations: many(invitations),
}));

export const membersRelations = relations(members, ({ one }) => ({
    user: one(users, {
        fields: [members.userId],
        references: [users.id],
    }),
    workspace: one(workspaces, {
        fields: [members.workspaceId],
        references: [workspaces.id],
    }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
    workspace: one(workspaces, {
        fields: [invitations.workspaceId],
        references: [workspaces.id],
    }),
    inviter: one(users, {
        fields: [invitations.inviterId],
        references: [users.id],
    }),
}));

// TYPES
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
export type Member = typeof members.$inferSelect;
export type Invitation = typeof invitations.$inferSelect;
