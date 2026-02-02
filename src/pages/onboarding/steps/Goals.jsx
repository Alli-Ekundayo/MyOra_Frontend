import { useState } from 'react';
import { useOnboarding } from '../../../context/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle2 } from 'lucide-react';

const GOAL_OPTIONS = [
    "Weight Loss",
    "Muscle Gain",
    "Manage Stress",
    "Improve Sleep",
    "Increase Energy",
    "Better Digestion"
];

const DIET_OPTIONS = [
    "None",
    "Vegetarian",
    "Vegan",
    "Keto",
    "Paleo",
    "Gluten-Free",
    "Dairy-Free"
];

export default function Goals() {
    const { formData, updateData, nextStep, prevStep } = useOnboarding();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const [localData, setLocalData] = useState({
        health_goals: formData.health_goals || [],
        dietary_preferences: formData.dietary_preferences || []
    });

    const toggleSelection = (category, item) => {
        setLocalData(prev => {
            const current = prev[category];
            const updated = current.includes(item)
                ? current.filter(i => i !== item)
                : [...current, item];
            return { ...prev, [category]: updated };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (localData.health_goals.length === 0) {
            setError('Please select at least one health goal');
            return;
        }

        updateData({
            health_goals: localData.health_goals,
            dietary_preferences: localData.dietary_preferences
        });
        nextStep();
        navigate('/onboarding/step5');
    };

    const handleBack = () => {
        prevStep();
        navigate('/onboarding/step2');
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Goals & Preferences</h2>
            <p className="text-gray-500 mb-8">What do you want to achieve with MyOra?</p>

            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 block">Health Goals (Select all that apply)</label>
                    <div className="grid grid-cols-2 gap-3">
                        {GOAL_OPTIONS.map(goal => (
                            <button
                                key={goal}
                                type="button"
                                onClick={() => toggleSelection('health_goals', goal)}
                                className={`p-4 rounded-xl border text-left transition-all relative ${localData.health_goals.includes(goal)
                                    ? 'border-myora-500 bg-myora-50 text-myora-900 ring-1 ring-myora-500'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                    }`}
                            >
                                <span className="font-medium">{goal}</span>
                                {localData.health_goals.includes(goal) && (
                                    <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-myora-500" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 block">Dietary Preferences</label>
                    <div className="flex flex-wrap gap-2">
                        {DIET_OPTIONS.map(diet => (
                            <button
                                key={diet}
                                type="button"
                                onClick={() => toggleSelection('dietary_preferences', diet)}
                                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${localData.dietary_preferences.includes(diet)
                                    ? 'border-myora-500 bg-myora-500 text-white'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                                    }`}
                            >
                                {diet}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-6 flex gap-4">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-myora-500 hover:bg-myora-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                        Create My Plan
                    </button>
                </div>
            </form>
        </div>
    );
}
