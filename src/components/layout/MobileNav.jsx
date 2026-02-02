import { Menu } from 'lucide-react';

export default function MobileNav({ onMenuClick }) {
    return (
        <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 lg:hidden">
            <button
                type="button"
                className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-myora-500 -ml-4"
                onClick={onMenuClick}
            >
                <span className="sr-only">Open sidebar</span>
                <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 text-center pr-8">
                <span className="text-xl font-bold text-myora-500">MyOra</span>
            </div>
        </div>
    );
}
