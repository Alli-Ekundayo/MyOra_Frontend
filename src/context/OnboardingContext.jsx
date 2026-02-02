import { createContext, useContext, useState } from 'react';

const OnboardingContext = createContext({});

export function OnboardingProvider({ children }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        height_cm: '',
        weight_kg: '',
        activity_level: '',
        phone_number: '',
        dietary_preferences: [],
        health_goals: [],
    });

    const updateData = (newData) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    const nextStep = () => setCurrentStep((prev) => prev + 1);
    const prevStep = () => setCurrentStep((prev) => prev - 1);

    const value = {
        currentStep,
        formData,
        updateData,
        nextStep,
        prevStep,
        setStep: setCurrentStep,
    };

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    );
}

export const useOnboarding = () => useContext(OnboardingContext);
