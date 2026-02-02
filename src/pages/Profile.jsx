import { useAuth } from '../context/AuthContext';
import Breadcrumbs from '../components/common/Breadcrumbs';

export default function Profile() {
    const { user, signOut } = useAuth();

    // In a real app, we might fetch the full profile from the backend here
    // For now, we show what we have in the Auth context

    return (
        <div>
            <Breadcrumbs />

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and account settings.</p>
                    </div>
                    <button
                        onClick={signOut}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
                    >
                        Sign Out
                    </button>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Username</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.username || 'N/A'}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {user?.signInDetails?.loginId || user?.username || 'N/A'}
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Account Status</dt>
                            <dd className="mt-1 text-sm text-green-600 sm:mt-0 sm:col-span-2 font-semibold">Active</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Onboarding Data</h4>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                To view or edit your health plan details, a new settings endpoint would be needed.
                                Currently, this data is stored in the backend.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
