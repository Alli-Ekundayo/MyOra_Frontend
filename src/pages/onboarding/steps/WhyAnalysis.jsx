import { useState, useEffect } from 'react';
import { useOnboarding } from '../../../context/OnboardingContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { onboardingService } from '../../../services/onboardingService';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';

export default function WhyAnalysis() {
    const { formData } = useOnboarding();
    const { user, userId, refreshProfile } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [whyStatement, setWhyStatement] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        generatePlan();
    }, []);

    const generatePlan = async () => {
        try {
            if (!userId) return;

            // 1. Save Profile Data
            await onboardingService.saveProfile(userId, formData);

            // 2. Generate Why Statement
            const response = await onboardingService.generateWhyStatement(userId, formData);

            if (response.status === 'success') {
                setWhyStatement(response.draft);
            } else {
                throw new Error(response.message || 'Failed to generate plan');
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'Something went wrong while creating your plan.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await onboardingService.saveWhyStatement(userId, whyStatement);
            await refreshProfile();
            navigate('/'); // Go to dashboard
        } catch (err) {
            console.error("Save error details:", err.response?.data || err.message);
            setError('Failed to save your plan. Please try again.');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-12 text-center">
                <div className="w-16 h-16 bg-myora-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-myora-500 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing your profile...</h2>
                <p className="text-gray-500">Our AI is crafting your personalized "Why" statement.</p>
                <div className="mt-8 flex justify-center">
                    <Loader2 className="w-8 h-8 text-myora-500 animate-spin" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-12 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-myora-500 text-white px-6 py-2 rounded-lg"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your "Why" Statement</h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-myora-500 font-medium hover:text-myora-600"
                    >
                        Edit
                    </button>
                )}
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 mb-8">
                {isEditing ? (
                    <textarea
                        value={whyStatement}
                        onChange={(e) => setWhyStatement(e.target.value)}
                        className="w-full h-40 bg-white p-4 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-400 outline-none resize-none text-gray-800 leading-relaxed"
                    />
                ) : (
                    <p className="text-lg text-gray-800 leading-relaxed italic">
                        "{whyStatement}"
                    </p>
                )}
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                        Your plan will be saved to your profile
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                        We'll customize your daily dashboard
                    </li>
                    <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                        You can update this at any time
                    </li>
                </ul>
            </div>

            <div className="pt-2">
                <button
                    onClick={handleSave}
                    className="w-full bg-myora-500 hover:bg-myora-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    {isEditing ? 'Save Changes' : 'Accept & Continue'}
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

function CheckCircle2({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
    )
}
