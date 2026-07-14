// frontend/src/app/forgot-password/page.js
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { forgotPasswordApi } from '@/api/user.api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const data = await forgotPasswordApi(email);
            setStatus('success');
            setMessage(data.message);
        } catch (error) {
            setStatus('error');
            setMessage(error.message || 'Failed to send reset link.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F7F2] flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
                        <span className="text-4xl font-black text-[#003B4A] tracking-tighter">
                            📦Baksho<span className="text-[#003B4A]/80 text-xs font-black relative -top-3">®</span>
                        </span>
                    </Link>
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
                    {status === 'success' ? (
                        <div className="text-center py-4">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                                📧
                            </div>
                            <h1 className="text-2xl font-black text-[#003B4A] mb-4">Check Your Inbox</h1>
                            <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                                {message}
                            </p>
                            <Link href="/login" className="block w-full bg-[#003B4A] text-white font-black py-4 rounded-2xl hover:bg-[#003B4A]/90 transition-all shadow-xl active:scale-95">
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8 text-center md:text-left">
                                <h1 className="text-2xl font-black text-[#003B4A] mb-2">Forgot Password?</h1>
                                <p className="text-gray-500 text-sm font-medium">No worries, we'll send you reset instructions.</p>
                            </div>

                            {status === 'error' && (
                                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 text-sm text-red-600 font-semibold">
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl bg-[#F9F7F2] border border-transparent focus:bg-white focus:border-[#003B4A]/20 focus:ring-4 focus:ring-[#003B4A]/5 outline-none transition-all text-[#003B4A] font-bold"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-[#003B4A] text-white font-black py-4 rounded-2xl hover:bg-[#003B4A]/90 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                                >
                                    {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>

                            <Link href="/login" className="block text-center mt-8 text-gray-500 text-sm font-black hover:text-[#003B4A] transition-colors">
                                ← Back to Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
