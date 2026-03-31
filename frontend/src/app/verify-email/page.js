// frontend/src/app/verify-email/page.js
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }

        const verify = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/auth/verify?token=${token}`);
                const data = await response.json();

                if (response.ok && data.success) {
                    setStatus('success');
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Verification failed.');
                }
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('error');
                setMessage('An error occurred during verification.');
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl border border-gray-100 text-center">
                {status === 'verifying' && (
                    <>
                        <div className="w-16 h-16 border-4 border-[#003B4A]/20 border-t-[#003B4A] rounded-full animate-spin mx-auto mb-6"></div>
                        <h1 className="text-2xl font-black text-[#003B4A] mb-2">Verifying Your Email</h1>
                        <p className="text-gray-500 font-medium tracking-tight">Please wait while we confirm your account...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                            🎉
                        </div>
                        <h1 className="text-3xl font-black text-[#003B4A] mb-4">Email Verified!</h1>
                        <p className="text-gray-500 font-medium mb-10 leading-relaxed text-lg">
                            Your account is now active. You can log in and start shopping.
                        </p>
                        <Link href="/login" className="block w-full bg-[#003B4A] text-white font-black py-4 rounded-2xl hover:bg-[#003B4A]/90 transition-all shadow-xl active:scale-95">
                            Go to Login
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                            ❌
                        </div>
                        <h1 className="text-2xl font-black text-red-600 mb-4">Verification Error</h1>
                        <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                            {message || 'The verification link is invalid or has expired.'}
                        </p>
                        <Link href="/register" className="block w-full bg-gray-100 text-[#003B4A] font-black py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-95">
                            Try Registering Again
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
