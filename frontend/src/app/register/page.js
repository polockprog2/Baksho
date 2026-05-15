"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import { isValidEmail, isValidPhone } from '@/utils/helpers';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useUser();
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error for this field
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = t.first_name_req || 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = t.last_name_req || 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = t.email_req || 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = t.email_invalid || 'Invalid email format';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = t.phone_req || 'Phone number is required';
        } else if (!isValidPhone(formData.phone)) {
            newErrors.phone = t.phone_invalid || 'Invalid phone format';
        }
        if (!formData.password) {
            newErrors.password = t.password_req || 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = t.password_min || 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t.password_mismatch || 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        const result = await register({
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            phone: formData.phone,
            password: formData.password
        });

        if (result.success) {
            setIsRegistered(true);
            window.scrollTo(0, 0);
        } else {
            setErrors({ general: result.error });
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#F9F7F2] flex flex-col items-center justify-center p-4 py-12">
            <div className="max-w-xl w-full">
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
                        <span className="text-4xl font-black text-[#003B4A] tracking-tighter">
                            📦Baksho<span className="text-[#003B4A]/80 text-xs font-black relative -top-3">®</span>
                        </span>
                    </Link>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
                    {/* Success Message */}
                    {isRegistered ? (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce">
                                ✅
                            </div>
                            <h2 className="text-2xl font-black text-[#003B4A] mb-4">Check Your Email!</h2>
                            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                                We've sent a verification link to <span className="text-[#003B4A] font-bold">{formData.email}</span>. 
                                Please click the link to activate your account.
                            </p>
                            <Link href="/login" className="inline-block bg-[#003B4A] text-white font-black px-10 py-4 rounded-2xl hover:bg-[#003B4A]/90 transition-all shadow-xl active:scale-95">
                                Go to Login
                            </Link>
                        </div>
                    ) : (
                        <>
                        <div className="mb-8">
                            <h1 className="text-2xl font-black text-[#003B4A] mb-2">{t.create_account}</h1>
                            <p className="text-gray-500 text-sm font-medium">Join our community for the best shopping experience.</p>
                        </div>

                        {/* Error Message */}
                        {errors.general && (
                            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
                                <p className="text-sm text-red-600 font-semibold">{errors.general}</p>
                            </div>
                        )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                    {t.first_name}
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`w-full px-5 py-3.5 rounded-2xl bg-[#F9F7F2] border transition-all duration-300 text-[#003B4A] font-bold text-sm ${errors.firstName ? 'border-red-500/50 bg-red-50/30' : 'border-transparent focus:bg-white focus:border-[#003B4A]/20'}`}
                                    placeholder="John"
                                />
                                {errors.firstName && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.firstName}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                    {t.last_name}
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`w-full px-5 py-3.5 rounded-2xl bg-[#F9F7F2] border transition-all duration-300 text-[#003B4A] font-bold text-sm ${errors.lastName ? 'border-red-500/50 bg-red-50/30' : 'border-transparent focus:bg-white focus:border-[#003B4A]/20'}`}
                                    placeholder="Doe"
                                />
                                {errors.lastName && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.lastName}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                {t.email_label}
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-5 py-3.5 rounded-2xl bg-[#F9F7F2] border transition-all duration-300 text-[#003B4A] font-bold text-sm ${errors.email ? 'border-red-500/50 bg-red-50/30' : 'border-transparent focus:bg-white focus:border-[#003B4A]/20'}`}
                                placeholder="name@company.com"
                            />
                            {errors.email && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                {t.phone_number}
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full px-5 py-3.5 rounded-2xl bg-[#F9F7F2] border transition-all duration-300 text-[#003B4A] font-bold text-sm ${errors.phone ? 'border-red-500/50 bg-red-50/30' : 'border-transparent focus:bg-white focus:border-[#003B4A]/20'}`}
                                placeholder="+49 XXX XXXXXXX"
                            />
                            {errors.phone && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.phone}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                    {t.password_label}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-5 py-3.5 rounded-2xl bg-[#F9F7F2] border transition-all duration-300 text-[#003B4A] font-bold text-sm ${errors.password ? 'border-red-500/50 bg-red-50/30' : 'border-transparent focus:bg-white focus:border-[#003B4A]/20'}`}
                                    placeholder="••••••••"
                                />
                                {errors.password && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.password}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                    {t.confirm_password}
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full px-5 py-3.5 rounded-2xl bg-[#F9F7F2] border transition-all duration-300 text-[#003B4A] font-bold text-sm ${errors.confirmPassword ? 'border-red-500/50 bg-red-50/30' : 'border-transparent focus:bg-white focus:border-[#003B4A]/20'}`}
                                    placeholder="••••••••"
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        <div className="flex items-start pt-2">
                            <div className="relative flex items-center justify-center mt-1">
                                <input
                                    type="checkbox"
                                    required
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-200 transition-all checked:border-[#003B4A] checked:bg-[#003B4A]"
                                />
                                <svg className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="ml-3 text-sm font-bold text-gray-500">
                                {t.agree_terms}
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-4 bg-[#003B4A] text-white font-black py-4 rounded-2xl hover:bg-[#003B4A]/90 active:scale-[0.98] transition-all duration-300 shadow-xl shadow-[#003B4A]/10 disabled:opacity-50"
                        >
                            {isLoading ? '...' : t.create_account}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-gray-500 text-sm font-bold mt-10">
                        {t.already_account}{' '}
                        <Link href="/login" className="text-[#003B4A] hover:underline transition-all">
                            {t.sign_in}
                        </Link>
                    </p>
                    </>
                    )}
                </div>
            </div>
        </div>
    );
}
