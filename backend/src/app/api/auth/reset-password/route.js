// backend/src/app/api/auth/reset-password/route.js
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req) {
    try {
        const { token, password } = await req.json()

        if (!token || !password) {
            return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
        }

        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token }
        })

        if (!verificationToken || new Date() > verificationToken.expires) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Update user password
        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { password: hashedPassword }
        })

        // Delete the token
        await prisma.verificationToken.delete({
            where: { token }
        })

        return NextResponse.json({ success: true, message: "Password reset successfully" })
    } catch (error) {
        console.error("Reset password error:", error)
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}
