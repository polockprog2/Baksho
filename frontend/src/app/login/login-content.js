"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

export default function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');
    const { login } = useUser();
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = t.email_req || 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t.email_invalid || 'Invalid email format';
        }

        if (!formData.password) {
            newErrors.password = t.password_req || 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = t.password_min || 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);
        setErrors({});

        const result = await login(formData.email, formData.password);

        if (result.success) {
            router.push(redirect || '/');
        } else {
            setErrors({ submit: result.error });
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#F9F7F2] flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo or Brand Name */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
                        <span className="text-4xl font-black text-[#003B4A] tracking-tighter">
                            📦Baksho<span className="text-[#003B4A]/80 text-xs font-black relative -top-3">®</span>
                        </span>
                    </Link>
                </div>

                {/* Main Login Card */}
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
                    <div className="mb-8">
                        <h1 className="text-2xl font-black text-[#003B4A] mb-2">{t.welcome_back}</h1>
                        <p className="text-gray-500 text-sm font-medium">{t.login_subtitle}</p>
                    </div>

                    {/* Error Message */}
                    {errors.submit && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
                            <p className="text-sm text-red-600 font-semibold flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.submit}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                {t.email_label}
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={`w-full px-5 py-3.5 rounded-2xl bg-[#F9F7F2] border ${errors.email ? 'border-red-500/50 ring-4 ring-red-500/5' : 'border-transparent'} focus:bg-white focus:border-[#003B4A]/20 focus:ring-4 focus:ring-[#003B4A]/5 outline-none transition-all duration-300 text-[#003B4A] font-bold text-sm placeholder-gray-400`}
                                placeholder="name@company.com"
                            />
                            {errors.email && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                {t.password_label}
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className={`w-full px-5 py-3.5 rounded-2xl bg-[#F9F7F2] border ${errors.password ? 'border-red-500/50 ring-4 ring-red-500/5' : 'border-transparent'} focus:bg-white focus:border-[#003B4A]/20 focus:ring-4 focus:ring-[#003B4A]/5 outline-none transition-all duration-300 text-[#003B4A] font-bold text-sm placeholder-gray-400`}
                                placeholder="••••••••••••"
                            />
                            {errors.password && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center group cursor-pointer">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-200 transition-all checked:border-[#003B4A] checked:bg-[#003B4A]"
                                    />
                                    <svg className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="ml-3 text-sm font-bold text-gray-500 group-hover:text-[#003B4A] transition-colors">{t.remember_me}</span>
                            </label>
                            <a href="#" className="text-sm font-bold text-[#003B4A] hover:opacity-70 transition-opacity">
                                {t.forgot_password}
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-4 bg-[#003B4A] text-white font-black py-4 rounded-2xl hover:bg-[#003B4A]/90 active:scale-[0.98] transition-all duration-300 shadow-xl shadow-[#003B4A]/10 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                        >
                            {isLoading ? '...' : t.sign_in}
                        </button>
                    </form>

                    {/* Social Login / Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
                            <span className="px-4 bg-white text-gray-300">{t.or_continue}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button className="flex items-center justify-center py-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </button>
                        <button className="flex items-center justify-center py-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                            <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                        </button>
                    </div>

                    <p className="text-center text-gray-500 text-sm font-bold">
                        {t.no_account}{' '}
                        <Link href="/register" className="text-[#003B4A] hover:underline transition-all">
                            {t.sign_up}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
