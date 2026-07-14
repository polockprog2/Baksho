// backend/src/lib/mail.js
import { Resend } from "resend";

const getBaseUrl = () => {
    return process.env.FRONTEND_URL || process.env.APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
};

const getResendClient = () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        return null;
    }
    return new Resend(apiKey);
};

const buildEmailTemplate = (title, message, actionLabel, actionUrl, footerText = "If you did not request this, you can safely ignore this email.") => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
            <h2 style="margin-bottom: 12px; color: #003B4A;">${title}</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #374151;">${message}</p>
            <a href="${actionUrl}" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #003B4A; color: #ffffff; text-decoration: none; border-radius: 999px; font-weight: 700;">${actionLabel}</a>
            <p style="font-size: 13px; color: #6b7280;">${footerText}</p>
        </div>
    `;
};

export const sendVerificationEmail = async (email, token) => {
    const confirmLink = `${getBaseUrl()}/verify-email?token=${token}`;
    const resend = getResendClient();

    if (!resend) {
        console.info(`[mail] Verification email skipped. RESEND_API_KEY missing. Link: ${confirmLink}`);
        return false;
    }

    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM || "onboarding@resend.dev",
            to: email,
            subject: "Verify your email address",
            html: buildEmailTemplate(
                "Welcome to Our Store",
                "Please click the button below to verify your email address and activate your account.",
                "Verify Email",
                confirmLink
            )
        });
        return true;
    } catch (error) {
        console.error("Error sending verification email:", error);
        return false;
    }
};

export const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `${getBaseUrl()}/reset-password?token=${token}`;
    const resend = getResendClient();

    if (!resend) {
        console.info(`[mail] Password reset email skipped. RESEND_API_KEY missing. Link: ${resetLink}`);
        return false;
    }

    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM || "onboarding@resend.dev",
            to: email,
            subject: "Reset your password",
            html: buildEmailTemplate(
                "Password Reset Request",
                "You requested to reset your password. Click the button below to set a new password.",
                "Reset Password",
                resetLink,
                "If you did not request this, you can safely ignore this email."
            )
        });
        return true;
    } catch (error) {
        console.error("Error sending password reset email:", error);
        return false;
    }
};

export const sendWelcomeSubscriptionEmail = async (email) => {
    const resend = getResendClient();

    if (!resend) {
        console.info(`[mail] Subscription email skipped. RESEND_API_KEY missing for ${email}`);
        return false;
    }

    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM || "onboarding@resend.dev",
            to: email,
            subject: "Thanks for subscribing!",
            html: buildEmailTemplate(
                "You're on the list!",
                "Thank you for subscribing to our newsletter. We'll keep you updated with the latest products, news, and exclusive offers.",
                "Explore Products",
                `${getBaseUrl()}/products`
            )
        });
        return true;
    } catch (error) {
        console.error("Error sending subscription email:", error);
        return false;
    }
};
