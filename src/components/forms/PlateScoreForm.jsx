import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { phase1Service } from '../../services/phase1Service';
import { Save, Loader2, Camera, Info } from 'lucide-react';

export default function PlateScoreForm({ onComplete, onCancel }) {
    const { user, userId } = useAuth();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Input, 2: Result
    const [result, setResult] = useState(null);

    const [portions, setPortions] = useState({
        vegetables: 33,
        protein: 33,
        carbs: 34
    });
    const [notes, setNotes] = useState('');

    // Auto-balance other sliders when one changes (simple approach: maintain sum 100)
    // But for better UX, maybe just independent sliders that color red if sum != 100?
    // Let's stick to independent sliders for input simplicity, but visualize validation

    const total = portions.vegetables + portions.protein + portions.carbs;
    const isValid = total >= 95 && total <= 105;

    const handleSimulateCamera = () => {
        setLoading(true);
        // Simulate analysis delay
        setTimeout(() => {
            setPortions({ vegetables: 45, protein: 30, carbs: 25 });
            setNotes("AI detected: Grilled chicken salad with quinoa.");
            setLoading(false);
        }, 1500);
    };

    const calculateScore = async () => {
        if (!isValid) return;
        try {
            setLoading(true);
            const data = await phase1Service.scorePlate(userId, {
                vegetables_percent: portions.vegetables,
                protein_percent: portions.protein,
                carbs_percent: portions.carbs,
                notes
            });
            setResult(data);
            setStep(2);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (step === 2) {
        return (
            <div className="text-center space-y-6">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <span className="text-3xl font-bold text-green-600">{result.score}/10</span>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900">Health Score</h3>
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg text-left text-sm text-gray-600">
                        <ul className="list-disc pl-5 space-y-1">
                            {result.feedback.map((f, i) => (
                                <li key={i}>{f}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <button
                    onClick={onComplete}
                    className="w-full inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-myora-600 hover:bg-myora-700"
                >
                    Done
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                    Aim for 50% Vegetables, 25% Protein, and 25% Carbs.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2 flex justify-center">
                    <button
                        onClick={handleSimulateCamera}
                        disabled={loading}
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-500 hover:text-myora-600"
                    >
                        {loading ? (
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        ) : (
                            <Camera className="w-8 h-8 mb-2" />
                        )}
                        <span className="text-sm font-medium">Take Photo to Analyze</span>
                        <span className="text-xs text-gray-400 mt-1">(Simulated)</span>
                    </button>
                </div>

                <div className="col-span-2 space-y-4">
                    <div>
                        <label className="flex justify-between text-sm font-medium text-gray-700">
                            Vegetables
                            <span className="text-myora-600">{portions.vegetables}%</span>
                        </label>
                        <input
                            type="range" min="0" max="100"
                            value={portions.vegetables}
                            onChange={(e) => setPortions({ ...portions, vegetables: parseInt(e.target.value) })}
                            className="w-full accent-green-500"
                        />
                    </div>

                    <div>
                        <label className="flex justify-between text-sm font-medium text-gray-700">
                            Protein
                            <span className="text-myora-600">{portions.protein}%</span>
                        </label>
                        <input
                            type="range" min="0" max="100"
                            value={portions.protein}
                            onChange={(e) => setPortions({ ...portions, protein: parseInt(e.target.value) })}
                            className="w-full accent-red-500"
                        />
                    </div>

                    <div>
                        <label className="flex justify-between text-sm font-medium text-gray-700">
                            Carbs
                            <span className="text-myora-600">{portions.carbs}%</span>
                        </label>
                        <input
                            type="range" min="0" max="100"
                            value={portions.carbs}
                            onChange={(e) => setPortions({ ...portions, carbs: parseInt(e.target.value) })}
                            className="w-full accent-yellow-500"
                        />
                    </div>

                    <div className={`text-right text-xs ${isValid ? 'text-green-600' : 'text-red-500 font-bold'}`}>
                        Total: {total}% {isValid ? '✓' : '(Must be close to 100%)'}
                    </div>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                    <textarea
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
                        placeholder="E.g. Caesar salad without croutons"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    onClick={calculateScore}
                    disabled={loading || !isValid}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-myora-600 hover:bg-myora-700 disabled:opacity-50"
                >
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Calculate Score
                </button>
            </div>
        </div>
    );
}
