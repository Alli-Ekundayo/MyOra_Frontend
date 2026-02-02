import { useState } from 'react';
import { CheckCircle, Circle, Save, Loader2, Play } from 'lucide-react';
import Modal from '../common/Modal';
import SelfReflectionForm from '../forms/SelfReflectionForm';
import PlateScoreForm from '../forms/PlateScoreForm';

export default function TaskItem({ task, onToggle, onSaveGoal }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [goalText, setGoalText] = useState(task.data?.goal || '');
    const [isSaving, setIsSaving] = useState(false);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);

    // Check task types
    const isSmartGoalTask = task.id === 'set_smart_goal';
    const isReflectionTask = task.id === 'self_reflection';
    const isPlateScoreTask = task.id === 'healthy_plate_check';
    const isCompleted = task.status === 'completed';

    const handleCheckboxClick = () => {
        if ((isSmartGoalTask || isReflectionTask || isPlateScoreTask) && !isCompleted) {
            // Expand or Open Modal depending on type
            if (isSmartGoalTask) setIsExpanded(!isExpanded);
            if (isReflectionTask) {
                setModalType('reflection');
                setShowModal(true);
            }
            if (isPlateScoreTask) {
                setModalType('plate');
                setShowModal(true);
            }
        } else {
            onToggle(task.id);
        }
    };

    const handleSaveSmartGoal = async () => {
        if (!goalText.trim()) return;
        setIsSaving(true);
        await onSaveGoal(goalText);
        setIsSaving(false);
        setIsExpanded(false);
    };

    const handleFormComplete = () => {
        setShowModal(false);
        onToggle(task.id); // Mark as done after form
    };

    return (
        <>
            <div className={`
        border rounded-lg p-4 transition-all
        ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-myora-300'}
    `}>
                <div className="flex items-start gap-3">
                    <button
                        onClick={handleCheckboxClick}
                        disabled={isCompleted && isSmartGoalTask}
                        className="mt-0.5 flex-shrink-0 text-gray-400 hover:text-myora-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                            <Circle className="w-6 h-6" />
                        )}
                    </button>

                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className={`text-sm font-medium ${isCompleted ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                                {task.description || task.title}
                            </h4>

                            {/* CTA Button for complex tasks if not done */}
                            {!isCompleted && (isReflectionTask || isPlateScoreTask) && (
                                <button
                                    onClick={() => {
                                        setModalType(isReflectionTask ? 'reflection' : 'plate');
                                        setShowModal(true);
                                    }}
                                    className="ml-2 flex items-center text-xs bg-myora-100 text-myora-700 px-2 py-1 rounded hover:bg-myora-200"
                                >
                                    <Play className="w-3 h-3 mr-1" /> Start
                                </button>
                            )}
                        </div>

                        {/* SMART Goal Input Area */}
                        {isSmartGoalTask && isExpanded && !isCompleted && (
                            <div className="mt-3">
                                <p className="text-xs text-gray-500 mb-2">
                                    Specific, Measurable, Achievable, Relevant, Time-bound.
                                </p>
                                <textarea
                                    value={goalText}
                                    onChange={(e) => setGoalText(e.target.value)}
                                    placeholder="I will walk 30 minutes every morning before work for the next 2 weeks."
                                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-myora-500 focus:border-transparent outline-none mb-2"
                                    rows="3"
                                />
                                <button
                                    onClick={handleSaveSmartGoal}
                                    disabled={isSaving || !goalText.trim()}
                                    className="flex items-center text-xs bg-myora-600 text-white px-3 py-1.5 rounded hover:bg-myora-700 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
                                    Save Goal
                                </button>
                            </div>
                        )}

                        {/* Display saved goal if completed */}
                        {isSmartGoalTask && isCompleted && task.data?.goal && (
                            <div className="mt-2 text-sm text-green-700 italic bg-green-100 p-2 rounded">
                                "{task.data.goal}"
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={modalType === 'reflection' ? "Weekly Reflection" : "Healthy Plate Check"}
            >
                {modalType === 'reflection' && (
                    <SelfReflectionForm
                        onComplete={handleFormComplete}
                        onCancel={() => setShowModal(false)}
                    />
                )}
                {modalType === 'plate' && (
                    <PlateScoreForm
                        onComplete={handleFormComplete}
                        onCancel={() => setShowModal(false)}
                    />
                )}
            </Modal>
        </>
    );
}
