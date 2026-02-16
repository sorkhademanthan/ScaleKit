import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is missing. Logging verification link:", confirmLink);
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
