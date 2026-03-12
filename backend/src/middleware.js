import { NextResponse } from 'next/server'

// Simple in-memory rate limiter
const rateLimit = new Map()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_AUTH = 30 // 30 requests per minute for auth endpoints
const MAX_REQUESTS_API = 100 // 100 requests per minute for general API

function getRateLimitKey(request) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    return ip
}

function isRateLimited(key, maxRequests) {
    const now = Date.now()
    const windowData = rateLimit.get(key) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW }

    // Reset window if expired
    if (now > windowData.resetAt) {
        windowData.count = 0
        windowData.resetAt = now + RATE_LIMIT_WINDOW
    }

    windowData.count++
    rateLimit.set(key, windowData)

    // Clean up old entries periodically
    if (rateLimit.size > 10000) {
        for (const [k, v] of rateLimit) {
            if (now > v.resetAt) rateLimit.delete(k)
        }
    }

    return {
        limited: windowData.count > maxRequests,
        remaining: Math.max(0, maxRequests - windowData.count),
        resetAt: windowData.resetAt
    }
}

export function middleware(request) {
    const response = NextResponse.next()
    const pathname = request.nextUrl.pathname

    // Add CORS headers
    const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000'
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, { status: 200, headers: response.headers })
    }

    // Rate limiting
    const key = getRateLimitKey(request)
    const isAuthEndpoint = pathname.startsWith('/api/auth')
    const maxRequests = isAuthEndpoint ? MAX_REQUESTS_AUTH : MAX_REQUESTS_API
    const rateLimitKey = `${key}:${isAuthEndpoint ? 'auth' : 'api'}`

    const { limited, remaining, resetAt } = isRateLimited(rateLimitKey, maxRequests)

    response.headers.set('X-RateLimit-Limit', maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', new Date(resetAt).toISOString())

    if (limited) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            {
                status: 429,
                headers: {
                    'Retry-After': Math.ceil((resetAt - Date.now()) / 1000).toString(),
                    'X-RateLimit-Limit': maxRequests.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': new Date(resetAt).toISOString()
                }
            }
        )
    }

    return response
}

export const config = {
    matcher: '/api/:path*',
}
