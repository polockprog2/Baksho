import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { sendVerificationEmail } from "@/lib/mail"
import crypto from "crypto"
import logger from "@/lib/logger"

const GENERIC_MESSAGE = "If an account exists and is unverified, a new verification email was sent."

export async function POST(req) {
    try {
        const { email } = await req.json()
        const normalizedEmail = String(email).trim().toLowerCase()

        if (!normalizedEmail) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        })

        if (!user || user.emailVerified) {
            return NextResponse.json({
                success: true,
                message: GENERIC_MESSAGE
            })
        }

        const token = crypto.randomBytes(32).toString("hex")
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        await prisma.verificationToken.deleteMany({
            where: { identifier: normalizedEmail }
        })

        await prisma.verificationToken.create({
            data: {
                identifier: normalizedEmail,
                token,
                expires
            }
        })

        const sent = await sendVerificationEmail(normalizedEmail, token)
        if (!sent) {
            logger.warn("Resend verification email skipped or failed", { email: normalizedEmail })
        }

        return NextResponse.json({
            success: true,
            message: GENERIC_MESSAGE
        })
    } catch (error) {
        logger.error("Resend verification error", { message: error.message })
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}
