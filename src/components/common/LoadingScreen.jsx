import { Loader2 } from 'lucide-react';

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999]">
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                <div className="flex items-center mb-6">
                    <span className="text-4xl font-bold text-myora-600">MyOra</span>
                </div>
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-10 h-10 text-myora-500 animate-spin" />
                    <p className="text-sm font-medium text-gray-500 tracking-wide">
                        Optimizing your experience...
                    </p>
                </div>
            </div>

            {/* Subtle background glow effect using brand color */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-myora-100 rounded-full blur-3xl opacity-30 -z-10"></div>
        </div>
    );
}
