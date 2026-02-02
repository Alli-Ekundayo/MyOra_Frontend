import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../context/OnboardingContext';
import { useAuth } from '../../../context/AuthContext';
import { Phone, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../../services/api';

export default function LinkWhatsApp() {
    const { formData, updateData, nextStep } = useOnboarding();
    const { refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState(formData.phone_number || '');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('phone'); // 'phone' or 'verify'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/request-otp', { phone_number: phoneNumber });
            setStep('verify');
            updateData({ phone_number: phoneNumber });
            setSuccess('OTP sent! Please check your WhatsApp.');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to send OTP. Please check the number.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/link', {
                phone_number: phoneNumber,
                otp: otp
            });

            if (response.data.status === 'success') {
                setSuccess('Account linked successfully!');
                await refreshProfile();
                // Wait a moment for the user to see the success message
                setTimeout(() => {
                    nextStep();
                    navigate('/onboarding/step2');
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Connect MyOra</h2>
                <p className="text-gray-600">Connect your WhatsApp to sync your health data and chats.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-center gap-3 text-red-700">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 flex items-center gap-3 text-green-700">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">{success}</p>
                </div>
            )}

            {step === 'phone' ? (
                <form onSubmit={handleRequestOtp} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            WhatsApp Number
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+234..."
                                className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-myora-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                            Enter your number in international format (e.g., +2348012345678)
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !phoneNumber}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-myora-600 text-white rounded-xl font-semibold hover:bg-myora-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-myora-200"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Send Verification Code
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Verification Code
                        </label>
                        <input
                            type="text"
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="123456"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-2xl tracking-[1em] font-mono focus:ring-2 focus:ring-myora-500 focus:border-transparent transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setStep('phone')}
                            className="mt-4 text-sm text-myora-600 hover:text-myora-700 font-medium"
                        >
                            Change Phone Number
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.length < 6}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-myora-600 text-white rounded-xl font-semibold hover:bg-myora-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-myora-200"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Link Account
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>
            )}

            <div className="mt-8 pt-8 border-t border-gray-100 flex items-center gap-3 text-gray-500 italic">
                <CheckCircle2 className="w-5 h-5 text-myora-400" />
                <p className="text-xs">Connecting your accounts allows us to personalize your experience across both platforms.</p>
            </div>
        </div>
    );
}
