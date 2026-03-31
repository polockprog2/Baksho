// backend/src/app/api/auth/forgot-password/route.js
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { sendPasswordResetEmail } from "@/lib/mail"
import crypto from "crypto"

export async function POST(req) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        // For security, always return success even if user doesn't exist
        if (!user) {
            return NextResponse.json({ success: true, message: "If an account exists with that email, a reset link has been sent." })
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString("hex")
        const expires = new Date(Date.now() + 3600000) // 1 hour

        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires
            }
        })

        await sendPasswordResetEmail(email, token)

        return NextResponse.json({ success: true, message: "If an account exists with that email, a reset link has been sent." })
    } catch (error) {
        console.error("Forgot password error:", error)
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}
