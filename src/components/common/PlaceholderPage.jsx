export default function PlaceholderPage({ title }) {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500">This feature is coming soon.</p>
            </div>
        </div>
    );
}
