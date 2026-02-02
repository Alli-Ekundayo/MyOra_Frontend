import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import NetworkStatusBanner from '../common/NetworkStatusBanner';

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
            <NetworkStatusBanner />

            <div className="flex flex-1 overflow-hidden">
                {/* Desktop Sidebar */}
                <div className="hidden lg:flex lg:flex-shrink-0">
                    <div className="w-64 border-r border-gray-200 bg-white">
                        <Sidebar />
                    </div>
                </div>

                {/* Mobile Sidebar (Drawer) */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-40 flex lg:hidden">
                        <div
                            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
                            onClick={() => setSidebarOpen(false)}
                        ></div>

                        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transition-transform transform">
                            <div className="absolute top-0 right-0 -mr-12 pt-2">
                                <button
                                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="sr-only">Close sidebar</span>
                                    <svg className="h-6 w-6 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <Sidebar onClose={() => setSidebarOpen(false)} />
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="flex flex-col flex-1 w-0 overflow-hidden">
                    <MobileNav onMenuClick={() => setSidebarOpen(true)} />

                    <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
                        <div className="py-6">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <Outlet />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
