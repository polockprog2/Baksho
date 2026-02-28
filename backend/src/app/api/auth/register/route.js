import prisma from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

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
        console.error("Register error:", error)
        return NextResponse.json({ error: error.message || "Registration failed" }, { status: 400 })
    }
}
