// frontend/src/app/verify-email/page.js
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyEmailApi, resendVerificationApi } from "@/api/user.api";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState("");
    const [resendEmail, setResendEmail] = useState("");
    const [resending, setResending] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link.");
            return;
        }

        const verify = async () => {
            try {
                const data = await verifyEmailApi(token);

                if (data.success) {
                    setStatus("success");
                } else {
                    setStatus("error");
                    setMessage(data.error || "Verification failed.");
                }
            } catch (error) {
                console.error("Verification error:", error);
                setStatus("error");
                setMessage(error.message || "An error occurred during verification.");
            }
        };

        verify();
    }, [token]);

    const handleResend = async () => {
        if (!resendEmail.trim()) {
            setResendMessage("Please enter your email address.");
            return;
        }

        setResending(true);
        setResendMessage("");

        try {
            const data = await resendVerificationApi(resendEmail.trim());
            setResendMessage(data.message || "A new verification email was sent.");
        } catch (error) {
            setResendMessage(error.message || "Unable to resend verification email.");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl border border-gray-100 text-center">
                {status === "verifying" && (
                    <>
                        <div className="w-16 h-16 border-4 border-[#003B4A]/20 border-t-[#003B4A] rounded-full animate-spin mx-auto mb-6"></div>
                        <h1 className="text-2xl font-black text-[#003B4A] mb-2">Verifying Your Email</h1>
                        <p className="text-gray-500 font-medium tracking-tight">Please wait while we confirm your account...</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">🎉</div>
                        <h1 className="text-3xl font-black text-[#003B4A] mb-4">Email Verified!</h1>
                        <p className="text-gray-500 font-medium mb-10 leading-relaxed text-lg">
                            Your account is now active. You can log in and start shopping.
                        </p>
                        <Link href="/login" className="block w-full bg-[#003B4A] text-white font-black py-4 rounded-2xl hover:bg-[#003B4A]/90 transition-all shadow-xl active:scale-95">
                            Go to Login
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">❌</div>
                        <h1 className="text-2xl font-black text-red-600 mb-4">Verification Error</h1>
                        <p className="text-gray-500 font-medium mb-6 leading-relaxed">
                            {message || "The verification link is invalid or has expired."}
                        </p>

                        <div className="space-y-3 mt-4">
                            <input
                                type="email"
                                value={resendEmail}
                                onChange={(event) => setResendEmail(event.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003B4A]/20"
                            />
                            <button
                                onClick={handleResend}
                                disabled={resending}
                                className="w-full bg-[#003B4A] text-white font-black py-3 rounded-2xl hover:bg-[#003B4A]/90 transition-all disabled:opacity-60"
                            >
                                {resending ? "Sending..." : "Resend Verification Email"}
                            </button>
                            {resendMessage && (
                                <p className="text-sm text-gray-600 font-medium">{resendMessage}</p>
                            )}
                        </div>

                        <Link href="/register" className="block w-full bg-gray-100 text-[#003B4A] font-black py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-95 mt-6">
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
