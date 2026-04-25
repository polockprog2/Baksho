"use client";

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
    useEffect(() => {
        console.error('Global application error:', error);
    }, [error]);

    return (
        <html lang="en">
            <body>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
                    <div className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl border border-red-100 max-w-lg w-full text-center">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <span className="text-5xl">💥</span>
                        </div>
                        
                        <h2 className="text-3xl font-black text-[#003B4A] mb-4 tracking-tight">Critical System Error</h2>
                        
                        <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                            The application encountered an unrecoverable error. Please refresh the page to try again.
                        </p>
                        
                        <button
                            onClick={() => reset()}
                            className="px-8 py-4 bg-[#003B4A] text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#002B36] transition-all shadow-xl hover:-translate-y-1 w-full"
                        >
                            Refresh Application
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
