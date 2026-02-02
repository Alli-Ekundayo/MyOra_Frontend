import apiClient from './api';

export const onboardingService = {
    saveProfile: async (userId, data) => {
        const response = await apiClient.post(`/onboarding/${userId}/profile`, data);
        return response.data;
    },

    generateWhyStatement: async (userId, data) => {
        const response = await apiClient.post(`/onboarding/${userId}/why/generate`, { onboarding_data: data });
        return response.data;
    },

    saveWhyStatement: async (userId, statement) => {
        const response = await apiClient.post(`/onboarding/${userId}/why/save`, { why_statement: statement });
        return response.data;
    }
};
