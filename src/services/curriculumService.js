import apiClient from './api';

export const curriculumService = {
    getCurrentWeek: async (userId) => {
        const response = await apiClient.get(`/curriculum/${userId}/current`);
        return response.data;
    },

    getProgress: async (userId) => {
        const response = await apiClient.get(`/curriculum/${userId}/progress`);
        return response.data;
    },

    completeTask: async (userId, taskId, data = {}) => {
        const response = await apiClient.post(`/curriculum/${userId}/task/${taskId}`, {
            status: 'completed',
            data
        });
        return response.data;
    },

    saveSmartGoal: async (userId, weekId, goalText) => {
        const response = await apiClient.post(`/curriculum/${userId}/goals/smart`, {
            goal_text: goalText,
            week_id: weekId
        });
        return response.data;
    }
};
