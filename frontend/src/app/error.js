"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
            <div className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl border border-red-100 max-w-lg w-full text-center">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <span className="text-5xl">🚨</span>
                </div>
                
                <h2 className="text-3xl font-black text-[#003B4A] mb-4 tracking-tight">Oops! Something went wrong</h2>
                
                <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                    We apologize for the inconvenience. An unexpected error occurred while loading this page.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-8 py-4 bg-[#003B4A] text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#002B36] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="px-8 py-4 bg-gray-100 text-[#003B4A] rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-200 transition-all"
                    >
                        Go Home
                    </Link>
                </div>
                
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-10 p-4 bg-gray-50 rounded-xl text-left overflow-auto max-h-48 border border-gray-100">
                        <p className="text-xs font-mono text-red-500 font-bold whitespace-pre-wrap">
                            {error.message}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
