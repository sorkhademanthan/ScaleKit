import { redirect } from "next/navigation";

export async function GET() {
    const clientId = process.env.GITHUB_CLIENT_ID;

    if (!clientId) {
        return new Response("GitHub Client ID not configured", { status: 500 });
    }

    const redirectUri = "https://github.com/login/oauth/authorize";
    const params = new URLSearchParams({
        client_id: clientId,
        scope: "read:user user:email",
        // Avoid state for simplicity in MVP, but recommend adding state for security later
    });

    return redirect(`${redirectUri}?${params.toString()}`);
}
