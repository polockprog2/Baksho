// frontend/src/app/reset-password/page.js
"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setStatus('error');
            setMessage('Password must be at least 6 characters.');
            return;
        }

        setStatus('loading');

        try {
            const response = await fetch('http://localhost:3001/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });
            const data = await response.json();

            if (response.ok) {
                setStatus('success');
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to reset password.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('An error occurred.');
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl p-10 text-center shadow-xl">
                    <h1 className="text-2xl font-black text-red-600 mb-4">Missing Token</h1>
                    <p className="text-gray-500 mb-8 font-medium">This link is invalid. Please request a new password reset.</p>
                    <Link href="/forgot-password" title="forgot password link" className="block w-full bg-[#003B4A] text-white font-black py-4 rounded-2xl hover:bg-[#003B4A]/90 transition-all shadow-xl">
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F7F2] flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
                {status === 'success' ? (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                            🛡️
                        </div>
                        <h1 className="text-2xl font-black text-[#003B4A] mb-4">Password reset!</h1>
                        <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                            Your password has been changed successfully. You can now log in with your new password.
                        </p>
                        <Link href="/login" className="block w-full bg-[#003B4A] text-white font-black py-4 rounded-2xl hover:bg-[#003B4A]/90 transition-all shadow-xl">
                            Go to Login
                        </Link>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-black text-[#003B4A] mb-2">Reset Password</h1>
                        <p className="text-gray-500 text-sm font-medium mb-8">Enter your new password below.</p>

                        {status === 'error' && (
                            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 text-sm text-red-600 font-semibold">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-2xl bg-[#F9F7F2] border border-transparent focus:bg-white focus:border-[#003B4A]/20 outline-none transition-all text-[#003B4A] font-bold"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-2xl bg-[#F9F7F2] border border-transparent focus:bg-white focus:border-[#003B4A]/20 outline-none transition-all text-[#003B4A] font-bold"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-[#003B4A] text-white font-black py-4 rounded-2xl hover:bg-[#003B4A]/90 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
