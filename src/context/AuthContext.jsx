import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, signIn, signUp, signOut, confirmSignUp } from 'aws-amplify/auth';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [profile, setProfile] = useState(null);

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);

            // Fetch profile from backend
            try {
                const response = await api.get(`/user/${currentUser.userId}`);
                setProfile(response.data);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            }
        } catch (error) {
            setUser(null);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    }

    const value = {
        user,
        profile,
        loading,
        userId: profile?.user_id || user?.userId || user?.username,
        isLinked: !!profile?.is_linked,
        isOnboarded: !!profile?.onboarded,
        refreshProfile: async () => {
            if (user) {
                // Use the best available ID for strongly consistent fetch
                const idToFetch = profile?.user_id || user.userId;
                const response = await api.get(`/user/${idToFetch}`);
                setProfile(response.data);
                return response.data;
            }
        },
        signIn: async (username, password) => {
            const result = await signIn({ username, password });
            await checkUser();
            return result;
        },
        signUp: async ({ username, password }) => {
            return await signUp({
                username,
                password,
                options: {
                    userAttributes: {
                        email: username,
                    },
                    autoSignIn: true,
                },
            });
        },
        confirmSignUp: async ({ username, code }) => {
            const result = await confirmSignUp({ username, confirmationCode: code });
            return result;
        },
        signOut: async () => {
            await signOut();
            setUser(null);
        },
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
