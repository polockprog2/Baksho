// backend/src/app/api/auth/verify/route.js
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import logger from "@/lib/logger"

export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
        return NextResponse.json({ error: "Missing token" }, { status: 400 })
    }

    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token }
        })

        if (!verificationToken) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 })
        }

        if (new Date() > verificationToken.expires) {
            await prisma.verificationToken.delete({ where: { token } })
            return NextResponse.json({ error: "Token expired" }, { status: 400 })
        }

        // Update user
        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { emailVerified: new Date() }
        })

        // Delete token
        await prisma.verificationToken.delete({ where: { token } })

        return NextResponse.json({ success: true, message: "Email verified successfully" })
    } catch (error) {
        logger.error("Verification error", { message: error.message })
        return NextResponse.json({ error: "Verification failed" }, { status: 500 })
    }
}
