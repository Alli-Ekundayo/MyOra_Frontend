import { WifiOff } from 'lucide-react';
import useNetworkStatus from '../../hooks/useNetworkStatus';

export default function NetworkStatusBanner() {
    const isOnline = useNetworkStatus();

    if (isOnline) return null;

    return (
        <div className="bg-red-500 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center animate-pulse">
            <WifiOff className="w-4 h-4 mr-2" />
            You are currently offline. Changes may not be saved.
        </div>
    );
}
