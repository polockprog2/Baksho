"use client";

import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

export default function ErrorMessage({
    type = 'error',
    message = '',
    title = '',
    onRetry,
    showIcon = true
}) {
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;

    const config = {
        error: {
            icon: '⚠️',
            color: 'red',
            defaultTitle: 'Oops!',
            defaultMessage: 'Something went wrong. Please try again later.'
        },
        warning: {
            icon: '🔔',
            color: 'amber',
            defaultTitle: 'Heads up!',
            defaultMessage: 'There was a minor issue processing your request.'
        },
        info: {
            icon: '💡',
            color: 'blue',
            defaultTitle: 'Information',
            defaultMessage: 'Please follow the instructions on the screen.'
        }
    };

    const style = config[type] || config.error;
    const displayTitle = title || style.defaultTitle;
    const displayMessage = message || style.defaultMessage;

    return (
        <div className={`flex flex-col items-center justify-center gap-6 p-12 bg-white rounded-[2.5rem] shadow-xl shadow-${style.color}-500/5 border border-${style.color}-50 relative overflow-hidden text-center`}>
            <div className={`absolute top-0 left-0 w-full h-1 bg-${style.color}-500`}></div>

            {showIcon && (
                <div className={`text-${style.color}-500 text-6xl animate-pulse mb-2`}>
                    {style.icon}
                </div>
            )}

            <div>
                <h3 className="text-2xl font-black text-[#003B4A] mb-2 uppercase tracking-wider">
                    {displayTitle}
                </h3>
                <p className="text-gray-400 font-bold max-w-xs mx-auto leading-relaxed">
                    {displayMessage}
                </p>
            </div>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="bg-[#003B4A] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#003B4A]/90 transition-all shadow-xl shadow-[#003B4A]/10 active:scale-95"
                >
                    {t.try_again || 'Try Again'}
                </button>
            )}
        </div>
    );
}
