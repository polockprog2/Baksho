// backend/src/lib/mail.js

/**
 * Mock Email Service for Development
 * In production, swap this with Resend, SendGrid, or nodemailer.
 */
export const sendVerificationEmail = async (email, token) => {
    const confirmLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

    console.log("------------------------------------------");
    console.log(`To: ${email}`);
    console.log("Subject: Verify your email");
    console.log(`Link: ${confirmLink}`);
    console.log("------------------------------------------");

    // In production, use your email provider here:
    // await resend.emails.send({
    //   from: 'onboarding@resend.dev',
    //   to: email,
    //   subject: 'Verify your email',
    //   html: `<p>Click <a href="${confirmLink}">here</a> to verify your email.</p>`
    // });

    return true;
};

export const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    console.log("------------------------------------------");
    console.log(`To: ${email}`);
    console.log("Subject: Reset your password");
    console.log(`Link: ${resetLink}`);
    console.log("------------------------------------------");

    return true;
};
