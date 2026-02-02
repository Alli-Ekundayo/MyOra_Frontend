import ChatLayout from '../components/chat/ChatLayout';
import Breadcrumbs from '../components/common/Breadcrumbs';

export default function Chat() {
    return (
        <div className="h-full">
            <Breadcrumbs />
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900">AI Health Coach</h1>
            </div>
            <ChatLayout />
        </div>
    );
}
