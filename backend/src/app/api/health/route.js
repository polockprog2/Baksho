import prisma from "@/lib/prisma"
import logger from "@/lib/logger"

/**
 * GET /api/health
 * Health check endpoint for Docker, load balancers, and uptime monitors.
 * Returns 200 if the server and database are healthy, 503 if the DB is down.
 */
export async function GET() {
    const start = Date.now()
    try {
        await prisma.$queryRaw`SELECT 1`
        const latency = Date.now() - start

        logger.info("Health check passed", { dbLatencyMs: latency })

        return Response.json({
            status: "ok",
            db: "connected",
            dbLatencyMs: latency,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        logger.error("Health check failed — DB unreachable", { message: error.message })

        return Response.json(
            {
                status: "error",
                db: "disconnected",
                error: "Database connection failed",
                timestamp: new Date().toISOString()
            },
            { status: 503 }
        )
    }
}
