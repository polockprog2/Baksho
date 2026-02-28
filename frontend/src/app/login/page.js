"use client";

import { Suspense } from 'react';
import LoginContent from './login-content';

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
            <div className="text-center">
                <div className="text-4xl mb-4">📦</div>
                <p className="text-gray-600 font-bold">Loading...</p>
            </div>
        </div>}>
            <LoginContent />
        </Suspense>
    );
}
