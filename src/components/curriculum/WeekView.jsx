import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { curriculumService } from '../../services/curriculumService';
import TaskItem from './TaskItem';
import ProgressBar from './ProgressBar';
import { Loader2, AlertCircle, BookOpen } from 'lucide-react';

export default function WeekView() {
    const { user, userId } = useAuth();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            if (!userId) return;

            setLoading(true);
            const [weekData, progressData] = await Promise.all([
                curriculumService.getCurrentWeek(userId),
                curriculumService.getProgress(userId)
            ]);

            setData(weekData);
            setProgress(progressData.total_progress_percent);
        } catch (err) {
            console.error(err);
            setError("Failed to load curriculum. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleTaskToggle = async (taskId) => {
        // Optimistic update mechanism could go here, 
        // but for simplicity we'll just call API then re-fetch or local update
        try {
            // Find current status
            const task = data.tasks.find(t => t.id === taskId);
            if (task.status === 'completed') return; // Cannot un-complete in this simple view

            await curriculumService.completeTask(userId, taskId);

            // Local update
            setData(prev => ({
                ...prev,
                tasks: prev.tasks.map(t =>
                    t.id === taskId ? { ...t, status: 'completed' } : t
                )
            }));
        } catch (err) {
            console.error("Failed to complete task", err);
        }
    };

    const handleSaveGoal = async (goalText) => {
        try {
            await curriculumService.saveSmartGoal(userId, data.week_id, goalText);
            // Local update
            // Re-fetch to be safe and get consistent state
            fetchData();
        } catch (err) {
            console.error("Failed to save goal", err);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-myora-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-lg flex items-center text-red-700">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-myora-100 p-2 rounded-lg text-myora-600">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-myora-600 uppercase tracking-wide">
                            Phase {data.phase} • Week {data.week_id}
                        </h2>
                        <h1 className="text-2xl font-bold text-gray-900">{data.title}</h1>
                    </div>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                    {data.description}
                </p>

                <ProgressBar progress={progress} />
            </div>

            {/* Tasks */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">This Week's Tasks</h3>
                <div className="space-y-3">
                    {data.tasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={handleTaskToggle}
                            onSaveGoal={handleSaveGoal}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
