import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { phase1Service } from '../../services/phase1Service';
import { sanitizeInput } from '../../utils/security';
import { Save, Loader2 } from 'lucide-react';

export default function SelfReflectionForm({ onComplete, onCancel }) {
    const { user, userId } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        change_meaning: '',
        biggest_challenge: '',
        support_needed: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Sanitize inputs
            const sanitizedData = {
                change_meaning: sanitizeInput(formData.change_meaning),
                biggest_challenge: sanitizeInput(formData.biggest_challenge),
                support_needed: sanitizeInput(formData.support_needed)
            };

            await phase1Service.saveSelfReflection(userId, sanitizedData);
            addToast("Reflection saved successfully!", "success");
            if (onComplete) onComplete();
        } catch (err) {
            console.error(err);
            addToast("Failed to save reflection. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What does making this change mean to you?
                </label>
                <textarea
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-myora-500 focus:border-myora-500 sm:text-sm"
                    value={formData.change_meaning}
                    onChange={(e) => setFormData({ ...formData, change_meaning: e.target.value })}
                ></textarea>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What do you foresee as your biggest challenge?
                </label>
                <textarea
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-myora-500 focus:border-myora-500 sm:text-sm"
                    value={formData.biggest_challenge}
                    onChange={(e) => setFormData({ ...formData, biggest_challenge: e.target.value })}
                ></textarea>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What kind of support do you need right now?
                </label>
                <textarea
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-myora-500 focus:border-myora-500 sm:text-sm"
                    value={formData.support_needed}
                    onChange={(e) => setFormData({ ...formData, support_needed: e.target.value })}
                ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-myora-600 hover:bg-myora-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-myora-500 disabled:opacity-50"
                >
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Reflection
                </button>
            </div>
        </form>
    );
}
