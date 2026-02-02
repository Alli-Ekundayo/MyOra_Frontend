import { useState } from 'react';
import { useOnboarding } from '../../../context/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { Ruler, Weight, Activity } from 'lucide-react';

export default function HealthMetrics() {
    const { formData, updateData, nextStep, prevStep } = useOnboarding();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const [localData, setLocalData] = useState({
        height_cm: formData.height_cm,
        weight_kg: formData.weight_kg,
        activity_level: formData.activity_level
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!localData.height_cm || !localData.weight_kg || !localData.activity_level) {
            setError('Please fill in all fields');
            return;
        }

        updateData({
            height_cm: parseFloat(localData.height_cm),
            weight_kg: parseFloat(localData.weight_kg),
            activity_level: localData.activity_level
        });
        nextStep();
        navigate('/onboarding/step4');
    };

    const handleBack = () => {
        prevStep();
        navigate('/onboarding/step1');
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Health Metrics</h2>
            <p className="text-gray-500 mb-8">Let's get a baseline for your physical health.</p>

            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                        <div className="relative">
                            <Ruler className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="number"
                                name="height_cm"
                                value={localData.height_cm}
                                onChange={handleChange}
                                className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-myora-500 focus:border-transparent outline-none"
                                placeholder="175"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                        <div className="relative">
                            <Weight className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="number"
                                name="weight_kg"
                                value={localData.weight_kg}
                                onChange={handleChange}
                                className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-myora-500 focus:border-transparent outline-none"
                                placeholder="70"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
                    <div className="space-y-3">
                        {[
                            { value: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
                            { value: 'light', label: 'Lightly Active', desc: 'Exercise 1-3 times/week' },
                            { value: 'moderate', label: 'Moderately Active', desc: 'Exercise 3-5 times/week' },
                            { value: 'very', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' }
                        ].map((option) => (
                            <label
                                key={option.value}
                                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${localData.activity_level === option.value
                                    ? 'border-myora-500 bg-myora-50 ring-1 ring-myora-500'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="activity_level"
                                    value={option.value}
                                    checked={localData.activity_level === option.value}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">{option.label}</div>
                                    <div className="text-sm text-gray-500">{option.desc}</div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${localData.activity_level === option.value ? 'border-myora-500' : 'border-gray-300'
                                    }`}>
                                    {localData.activity_level === option.value && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-myora-500" />
                                    )}
                                </div>
                            </label>
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
                        Next Step
                    </button>
                </div>
            </form>
        </div>
    );
}
