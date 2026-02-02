import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { curriculumService } from '../services/curriculumService';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import ProgressBar from '../components/curriculum/ProgressBar';
import Modal from '../components/common/Modal';
import PlateScoreForm from '../components/forms/PlateScoreForm';

export default function Dashboard() {
    const { user, userId, profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [showPlateModal, setShowPlateModal] = useState(false);

    useEffect(() => {
        async function loadSummary() {
            if (!userId) return;
            try {
                const [progressData, weekData] = await Promise.all([
                    curriculumService.getProgress(userId),
                    curriculumService.getCurrentWeek(userId)
                ]);
                setData({
                    progress: progressData.total_progress_percent,
                    weekId: weekData.week_id,
                    weekTitle: weekData.title,
                    tasksCompleted: weekData.tasks.filter(t => t.status === 'completed').length,
                    totalTasks: weekData.tasks.length
                });
            } catch (e) {
                console.error("Dashboard summary load failed", e);
            } finally {
                setLoading(false);
            }
        }
        loadSummary();
    }, [user]);

    return (
        <div>
            <Breadcrumbs />
            <div className="md:flex md:items-center md:justify-between mb-6">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Hello, {profile?.name || user?.username}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">Welcome back to your dashboard.</p>
                </div>
            </div>

            {loading ? (
                <div className="animate-pulse flex space-x-4">
                    <div className="rounded-lg bg-gray-200 h-24 w-full"></div>
                    <div className="rounded-lg bg-gray-200 h-24 w-full"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                        {/* Progress Card */}
                        <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate mb-4">You are in Phase 1</dt>
                            <dd className="mt-1">
                                <ProgressBar progress={data?.progress || 0} />
                            </dd>
                            <div className="mt-4">
                                <Link to="/curriculum" className="text-sm font-medium text-myora-600 hover:text-myora-500 flex items-center">
                                    View Full Plan <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </div>

                        {/* Current Week Card */}
                        <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <dt className="text-sm font-medium text-gray-500 truncate">Current Focus</dt>
                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                    Week {data?.weekId || 1}
                                </span>
                            </div>
                            <dd className="mt-1 text-xl font-semibold text-gray-900 mb-2">
                                {data?.weekTitle || "Loading..."}
                            </dd>
                            <div className="flex items-center text-sm text-gray-500">
                                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                                {data?.tasksCompleted || 0} / {data?.totalTasks || 0} tasks completed
                            </div>
                            <div className="mt-4">
                                <Link to="/curriculum" className="text-sm font-medium text-myora-600 hover:text-myora-500 flex items-center">
                                    Continue Learning <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </div>

                        {/* Coach Chat Card */}
                        <div className="bg-white overflow-hidden shadow rounded-lg p-6 border-l-4 border-myora-500">
                            <dt className="text-sm font-medium text-gray-500 truncate mb-2">AI Health Coach</dt>
                            <dd className="mt-1 text-gray-900 text-sm">
                                "Remember to log your water intake today!"
                            </dd>
                            <div className="mt-4">
                                <Link to="/chat" className="text-sm font-medium text-myora-600 hover:text-myora-500 flex items-center">
                                    Chat Now <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick Tools */}
                    <div className="mb-8 p-6 bg-white rounded-lg shadow">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Tools</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => setShowPlateModal(true)}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-myora-300 hover:bg-myora-50 transition-colors"
                            >
                                <div className="bg-green-100 p-2 rounded-full mr-3 text-green-600">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <span className="block font-medium text-gray-900">Plate Calculator</span>
                                    <span className="block text-xs text-gray-500">Score your meal balance</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </>
            )}

            <Modal onClose={() => setShowPlateModal(false)} isOpen={showPlateModal} title="Healthy Plate Check">
                <PlateScoreForm onCancel={() => setShowPlateModal(false)} onComplete={() => setShowPlateModal(false)} />
            </Modal>
        </div>
    );
}
