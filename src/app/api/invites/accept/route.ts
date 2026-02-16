import { authService } from "@/lib/auth-singleton";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { InviteService } from "@/modules/workspace/invite.service";
import { z } from "zod";

const acceptSchema = z.object({
    token: z.string().min(1),
});

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await authService.validateSession(token);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const result = acceptSchema.safeParse(body);
        if (!result.success) return NextResponse.json({ message: "Invalid input" }, { status: 400 });

        const { token: inviteToken } = result.data;

        const workspace = await InviteService.acceptInvite(inviteToken, user.id);

        return NextResponse.json({ success: true, workspace });

    } catch (error: any) {
        if (error.message.includes("Invalid")) return NextResponse.json({ message: error.message }, { status: 400 });
        if (error.message.includes("expired")) return NextResponse.json({ message: error.message }, { status: 410 });

        console.error("Accept Invite Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
