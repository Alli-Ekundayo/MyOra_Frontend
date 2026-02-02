import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute() {
    const { user, isLinked, isOnboarded } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    // If they are not linked or onboarded, and not already on onboarding page
    if ((!isLinked || !isOnboarded) && !location.pathname.startsWith('/onboarding')) {
        return <Navigate to="/onboarding/step1" replace />;
    }

    return <Outlet />;
}
