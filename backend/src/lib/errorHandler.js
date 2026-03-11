// backend/src/lib/errorHandler.js

import { NextResponse } from 'next/server';
import logger from './logger';
import { ZodError } from 'zod';

/**
 * Centered error handler for API routes
 * Categorizes errors and returns consistent JSON responses
 */
export function handleApiError(error, context = 'API Error') {
    logger.error(`${context}: ${error.message}`, {
        stack: error.stack,
        name: error.name
    });

    if (error instanceof ZodError) {
        return NextResponse.json({
            error: 'Validation failed',
            details: error.errors.map(err => ({
                path: err.path.join('.'),
                message: err.message
            }))
        }, { status: 400 });
    }

    if (error.code === 'P2002') {
        return NextResponse.json({
            error: 'Conflict: Unique constraint failed',
            field: error.meta?.target?.[0]
        }, { status: 409 });
    }

    if (error.name === 'UnauthorizedError' || error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (error.name === 'ForbiddenError' || error.message === 'Forbidden') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal Server Error'
            : error.message
    }, { status: 500 });
}
