import prisma from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import logger from "@/lib/logger"

export async function POST(req) {
    try {
        const body = await req.json()
        const validated = registerSchema.parse(body)

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validated.email }
        })

        if (existingUser) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validated.password, 10)

        // Create user
        const user = await prisma.user.create({
            data: {
                email: validated.email,
                name: validated.name,
                password: hashedPassword,
                phone: validated.phone,
                role: "CUSTOMER"
            }
        })

        // Generate verification token
        const verificationToken = await prisma.verificationToken.create({
            data: {
                identifier: validated.email,
                token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
            }
        })

        // Send verification email
        const { sendVerificationEmail } = await import("@/lib/mail")
        await sendVerificationEmail(validated.email, verificationToken.token)

        // Return user without password
        const userWithoutPassword = { ...user }
        delete userWithoutPassword.password
        return NextResponse.json({
            success: true,
            user: {
                ...userWithoutPassword,
                isAdmin: userWithoutPassword.role === "ADMIN"
            }
        }, { status: 201 })
    } catch (error) {
        logger.error("Register error", { message: error.message })
        return NextResponse.json({ error: error.message || "Registration failed" }, { status: 400 })
    }
}
