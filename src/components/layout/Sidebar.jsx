import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, MessageSquare, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Curriculum', href: '/curriculum', icon: BookOpen },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'Profile', href: '/profile', icon: User },
];

export default function Sidebar({ onClose }) {
    const location = useLocation();
    const { signOut } = useAuth();

    const handleLinkClick = () => {
        // If onClose is provided (mobile drawer mode), call it
        if (onClose) onClose();
    }

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
                <span className="text-2xl font-bold text-myora-500">MyOra</span>
            </div>

            <div className="flex-1 flex flex-col justify-between overflow-y-auto w-full">
                <nav className="flex-1 px-4 py-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={handleLinkClick}
                                className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive
                                        ? 'bg-myora-50 text-myora-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                            >
                                <item.icon
                                    className={`
                        mr-3 flex-shrink-0 h-6 w-6 transition-colors
                        ${isActive ? 'text-myora-500' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={() => {
                            handleLinkClick();
                            signOut();
                        }}
                        className="w-full group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-red-500" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
