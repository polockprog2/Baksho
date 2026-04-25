import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

/**
 * Middleware wrapper for API route handlers that require authentication.
 * Usage: export default withAuth(handler)
 */
export function withAuth(handler) {
  return async function wrappedHandler(...args) {
    // Detect if first arg is NextRequest (for route handlers)
    const req = args[0]
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    // Attach session to req for downstream usage if needed
    req.session = session
    return handler(...args)
  }
}

/**
 * Middleware wrapper for admin-only API route handlers.
 * Usage: export default withAdminAuth(handler)
 */
export function withAdminAuth(handler) {
  return async function wrappedHandler(...args) {
    const req = args[0]
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    req.session = session
    return handler(...args)
  }
}
