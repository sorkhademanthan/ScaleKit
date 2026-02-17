
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env BEFORE any other imports that might use env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.join(__dirname, "../.env") });

async function main() {
    console.log("🧪 Testing Workspaces & Invites (Dynamic Import Fix)...");

    // Dynamically import dependencies AFTER env is loaded
    const { db } = await import("../src/db/index");
    const { users, workspaces, members, invitations } = await import("../src/db/schema");
    const { eq } = await import("drizzle-orm");
    const { WorkspaceService } = await import("../src/modules/workspace/workspace.service");
    const { InviteService } = await import("../src/modules/workspace/invite.service");

    const testEmail = "test-owner-script@example.com";

    // 1. Get or Create a Test User
    let testUser = await db.query.users.findFirst({
        where: eq(users.email, testEmail)
    });

    if (!testUser) {
        console.log("Creating test owner...");
        const [newUser] = await db.insert(users).values({
            email: testEmail,
            name: "Test Owner Script",
            role: "user"
        }).returning();
        testUser = newUser;
    }
    console.log(`✅ Test User: ${testUser.id}`);

    // 2. Create Workspace
    const slug = `test-ws-${Date.now()}`;
    console.log(`Creating workspace: ${slug}...`);
    try {
        const workspace = await WorkspaceService.createWorkspace(testUser.id, "Test Script Workspace", slug);
        console.log(`✅ Workspace Created: ${workspace.id} (${workspace.slug})`);

        // 3. Verify Membership
        const role = await WorkspaceService.getMemberRole(testUser.id, workspace.id);
        console.log(`✅ Member Role in DB: ${role}`);

        if (role !== 'owner') {
            console.error("❌ ERROR: Role mismatch. Expected owner, got " + role);
            process.exit(1);
        }

        // 4. Invite Logic
        const inviteEmail = `invitee-${Date.now()}@example.com`;
        console.log(`Sending invite to ${inviteEmail}...`);

        const invite = await InviteService.sendInvite(testUser.id, workspace.id, inviteEmail, 'member');
        console.log(`✅ Invite Created: ${invite.token}`);

    } catch (e: any) {
        console.error("❌ Operation Failed:", e.message);
        console.error(e);
        process.exit(1);
    }

    console.log("🎉 Test Suite Complete!");
    process.exit(0);
}

main();
