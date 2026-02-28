import prisma from "@/lib/prisma"
import { loginSchema } from "@/lib/validations"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req) {
    try {
        const body = await req.json()
        const validated = loginSchema.parse(body)

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: validated.email }
        })

        if (!user || !user.password) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(validated.password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
        }

        // Return user without password
        const userWithoutPassword = { ...user }
        delete userWithoutPassword.password
        return NextResponse.json({
            success: true,
            user: {
                ...userWithoutPassword,
                isAdmin: userWithoutPassword.role === "ADMIN"
            }
        })
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json({ error: error.message || "Login failed" }, { status: 400 })
    }
}
