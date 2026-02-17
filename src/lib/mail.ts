import { Resend } from "resend";
import { ResetPasswordEmail } from "@/emails/reset-password";
import { InviteEmail } from "@/emails/invite-email";
import { render } from "@react-email/render";

// Initialize Resend safely
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    if (!resend) {
        console.warn("RESEND_API_KEY is missing. VERIFICATION LINK:", confirmLink);
        return;
    }

    try {
        await resend.emails.send({
            from: "ScaleKit <onboarding@resend.dev>", // Or your verified domain
            to: email,
            subject: "Confirm your email",
            html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
        });
    } catch (error) {
        console.error("Failed to send email:", error);
    }
};

export const sendPasswordResetEmail = async (email: string, token: string, name?: string) => {
    const resetLink = `${domain}/auth/reset-password?token=${token}`;

    if (!resend) {
        console.warn("RESEND_API_KEY is missing. RESET LINK:", resetLink);
        return;
    }

    try {
        // Explicitly render to HTML string to avoid Next.js/Resend rendering issues
        const emailHtml = await render(
            ResetPasswordEmail({ userFirstname: name, resetPasswordLink: resetLink })
        );

        await resend.emails.send({
            from: "ScaleKit <onboarding@resend.dev>",
            to: email,
            subject: "Reset your password",
            html: emailHtml, // Send as HTML string, not 'react' component
        });
    } catch (error: any) {
        console.error("Failed to send reset email:", error);

        // Fallback logging if email send fails (so you can still test locally even if key is invalid/fails)
        console.warn("FALLBACK RESET LINK LOG:", resetLink);
    }
};

export const sendInviteEmail = async (email: string, inviteToken: string, inviterName: string, workspaceName: string) => {
    const inviteLink = `${domain}/invites/${inviteToken}`;

    if (!resend) {
        console.warn("RESEND_API_KEY is missing. INVITE LINK:", inviteLink);
        return;
    }

    try {
        const emailHtml = await render(
            InviteEmail({ inviterName, workspaceName, inviteLink })
        );

        await resend.emails.send({
            from: "ScaleKit <onboarding@resend.dev>",
            to: email,
            subject: `Join ${workspaceName} on ScaleKit`,
            html: emailHtml,
        });
    } catch (error: any) {
        console.error("Failed to send invite email:", error);
        console.warn("FALLBACK INVITE LINK LOG:", inviteLink);
    }
};
