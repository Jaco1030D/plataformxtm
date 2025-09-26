import React from "react";

interface LoadingOverlayProps {
    open: boolean
    label?: string
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ open, label = "Carregando" }) => {
    if (!open) return null;

    return (
        <div
            aria-busy={true}
            aria-live="polite"
            aria-label={label}
            role="status"
            className="fixed inset-0 z-50 flex items-center justify-center"
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            <div className="relative z-10 flex flex-col items-center gap-3 rounded-xl bg-white/95 px-6 py-5 shadow-lg border border-gray-200">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                <span className="text-sm text-gray-700">{label}…</span>
            </div>
        </div>
    );
};

export default LoadingOverlay;


