import apiClient from './api';

export const phase1Service = {
    saveSelfReflection: async (userId, data) => {
        const response = await apiClient.post(`/phase1/self-reflection`, { user_id: userId, ...data });
        return response.data;
    },

    saveFatAudit: async (userId, data) => {
        const response = await apiClient.post(`/phase1/fat-audit`, { user_id: userId, ...data });
        return response.data;
    },

    saveActivityAudit: async (userId, data) => {
        const response = await apiClient.post(`/phase1/activity-audit`, { user_id: userId, ...data });
        return response.data;
    },

    saveMealPattern: async (userId, data) => {
        const response = await apiClient.post(`/phase1/meal-pattern`, { user_id: userId, ...data });
        return response.data;
    },

    scorePlate: async (userId, data) => {
        const response = await apiClient.post(`/phase1/plate-score`, { user_id: userId, ...data });
        return response.data;
    }
};
