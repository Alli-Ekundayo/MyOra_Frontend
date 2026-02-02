import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OnboardingProvider } from './context/OnboardingContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/common/ToastContainer';
import PrivateRoute from './components/auth/PrivateRoute';
import LoadingScreen from './components/common/LoadingScreen';

// Lazy load page components
const SignIn = lazy(() => import('./pages/auth/SignIn'));
const SignUp = lazy(() => import('./pages/auth/SignUp'));
const ConfirmSignUp = lazy(() => import('./pages/auth/ConfirmSignUp'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Chat = lazy(() => import('./pages/Chat'));
const Curriculum = lazy(() => import('./pages/Curriculum'));

const LinkWhatsApp = lazy(() => import('./pages/onboarding/steps/LinkWhatsApp'));

// Layouts and sub-steps
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));
const OnboardingLayout = lazy(() => import('./pages/onboarding/OnboardingLayout'));
const Demographics = lazy(() => import('./pages/onboarding/steps/Demographics'));
const HealthMetrics = lazy(() => import('./pages/onboarding/steps/HealthMetrics'));
const Goals = lazy(() => import('./pages/onboarding/steps/Goals'));
const WhyAnalysis = lazy(() => import('./pages/onboarding/steps/WhyAnalysis'));

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <OnboardingProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/confirm" element={<ConfirmSignUp />} />

                <Route element={<PrivateRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/curriculum" element={<Curriculum />} />
                    <Route path="/chat" element={<Chat />} />
                  </Route>

                  <Route path="/onboarding" element={<OnboardingLayout />}>
                    <Route path="step1" element={<LinkWhatsApp />} />
                    <Route path="step2" element={<Demographics />} />
                    <Route path="step3" element={<HealthMetrics />} />
                    <Route path="step4" element={<Goals />} />
                    <Route path="step5" element={<WhyAnalysis />} />
                  </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            <ToastContainer />
          </BrowserRouter>
        </OnboardingProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
