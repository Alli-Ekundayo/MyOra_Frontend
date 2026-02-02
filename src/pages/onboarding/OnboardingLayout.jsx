import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import { Check, User, Activity, Target, BrainCircuit, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

const steps = [
    { id: 1, name: 'Link WhatsApp', icon: Phone },
    { id: 2, name: 'About You', icon: User },
    { id: 3, name: 'Health Metrics', icon: Activity },
    { id: 4, name: 'Goals', icon: Target },
    { id: 5, name: 'MyOra Plan', icon: BrainCircuit },
];

export default function OnboardingLayout() {
    const { currentStep, setStep } = useOnboarding();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Sync currentStep with URL
        const stepMatch = location.pathname.match(/step(\d+)/);
        if (stepMatch) {
            const stepNum = parseInt(stepMatch[1]);
            if (stepNum !== currentStep) {
                setStep(stepNum);
            }
        }

        // If accessing layout directly, start at step 1
        if (location.pathname === '/onboarding' || location.pathname === '/onboarding/') {
            navigate('/onboarding/step1');
        }
    }, [location, navigate, currentStep, setStep]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full" />
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-myora-500 -translate-y-1/2 rounded-full transition-all duration-300 ease-in-out"
                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        />

                        <div className="relative flex justify-between">
                            {steps.map((step) => {
                                const isCompleted = currentStep > step.id;
                                const isCurrent = currentStep === step.id;

                                return (
                                    <div key={step.id} className="flex flex-col items-center">
                                        <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 bg-white transition-all duration-300
                      ${isCompleted || isCurrent ? 'border-myora-500 text-myora-500' : 'border-gray-300 text-gray-400'}
                      ${isCurrent ? 'ring-4 ring-myora-50' : ''}
                    `}>
                                            {isCompleted ? (
                                                <Check className="w-6 h-6" />
                                            ) : (
                                                <step.icon className="w-5 h-5" />
                                            )}
                                        </div>
                                        <span className={`
                      mt-2 text-xs font-medium transition-colors duration-300
                      ${isCompleted || isCurrent ? 'text-myora-900' : 'text-gray-400'}
                    `}>
                                            {step.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
