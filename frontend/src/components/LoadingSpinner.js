export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className={`${sizeClasses[size]} border-[3px] border-[#F9F7F2] border-t-[#003B4A] rounded-full animate-spin`}></div>
            {text && <p className="text-[#003B4A] font-black uppercase tracking-[0.2em] text-[10px]">{text}</p>}
        </div>
    );
}
