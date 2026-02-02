import { useState } from 'react';
import { useOnboarding } from '../../../context/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Smile } from 'lucide-react';

export default function Demographics() {
    const { formData, updateData, nextStep } = useOnboarding();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const [localData, setLocalData] = useState({
        name: formData.name,
        age: formData.age,
        gender: formData.gender
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!localData.name || !localData.age || !localData.gender) {
            setError('Please fill in all fields');
            return;
        }

        updateData({ ...localData, age: parseInt(localData.age) });
        nextStep();
        navigate('/onboarding/step3');
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
            <p className="text-gray-500 mb-8">This helps us personalize your MyOra plan.</p>

            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            name="name"
                            value={localData.name}
                            onChange={handleChange}
                            className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-myora-500 focus:border-transparent outline-none"
                            placeholder="Your name"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="number"
                                name="age"
                                value={localData.age}
                                onChange={handleChange}
                                className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-myora-500 focus:border-transparent outline-none"
                                placeholder="Years"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <div className="relative">
                            <select
                                name="gender"
                                value={localData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-myora-500 focus:border-transparent outline-none bg-white"
                            >
                                <option value="">Select...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        className="w-full bg-myora-500 hover:bg-myora-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                        Next Step
                    </button>
                </div>
            </form>
        </div>
    );
}
