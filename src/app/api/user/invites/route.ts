import { authService } from "@/lib/auth-singleton";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { InviteService } from "@/modules/workspace/invite.service";

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await authService.validateSession(token);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // Fetch invites sent to the user's email
        const invites = await InviteService.getUserInvites(user.email);
        return NextResponse.json({ invites });

    } catch (error) {
        console.error("Get User Invites Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
