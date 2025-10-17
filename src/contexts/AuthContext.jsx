import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account, databases } from '../appwriteClient';
import { Query } from 'appwrite';
import { mealLoggingService } from '../services/mealLoggingService';
import { validatePassword } from '../utils/validation';

const AuthContext = createContext();
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState('Loading DineFit...');
    useEffect(() => {
        const quickInit = async () => {
            const quickTimeout = setTimeout(() => {
                setLoading(false);
                setUser(null);
            }, 5000); // Increased timeout to allow for profile loading
            try {
                const currentUser = await account.get();
                if (import.meta.env.DEV) {
                    console.log('User session found:', currentUser);
                }
                setUser(currentUser);
                mealLoggingService.setCurrentUser(currentUser);
                setError(null);
                try {
                    await getUserProfile(currentUser.$id);
                } catch (profileError) {
                    console.warn('Failed to load profile on first try, retrying...');
                    setTimeout(async () => {
                        try {
                            await getUserProfile(currentUser.$id);
                        } catch (retryError) {
                            console.warn('Profile loading failed after retry:', retryError);
                        }
                    }, 1000);
                }
                clearTimeout(quickTimeout);
                setLoading(false);
            } catch (error) {
                console.log('No active session, continuing as guest');
                setUser(null);
                setUserProfile(null);
                setError(null);
                clearTimeout(quickTimeout);
                setLoading(false);
            }
        };
        quickInit();
    }, []);
    const checkUserSession = async () => {
        try {
            console.log('Checking user session...');
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Session check timeout')), 5000);
            });
            const sessionPromise = account.get();
            const currentUser = await Promise.race([sessionPromise, timeoutPromise]);
            console.log('User found:', currentUser);
            setUser(currentUser);
            mealLoggingService.setCurrentUser(currentUser);
            setError(null);
        } catch (error) {
            console.log('No user session found or timeout occurred:', error.message);
            if (import.meta.env.DEV && (error.message.includes('timeout') || error.message.includes('network'))) {
                console.log('Development mode: continuing without authentication');
            }
            setUser(null);
            setError(null);
        } finally {
            console.log('Setting loading to false');
            setLoading(false);
        }
    };
    const login = async (email, password) => {
        try {
            console.log('Starting login process...');
            console.log('Using endpoint:', import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1');
            setError(null);
            // Network connectivity will be tested during the actual login attempt
            console.log('Attempting to create session...');
            const loginPromise = account.createEmailPasswordSession(email, password);
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Login is taking longer than expected. Please try again.')), 20000);
            });
            const session = await Promise.race([loginPromise, timeoutPromise]);
            console.log('Session created successfully:', session);
            console.log('Fetching user data...');
            const userPromise = account.get();
            const userTimeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('User data fetch timeout')), 10000);
            });
            const currentUser = await Promise.race([userPromise, userTimeoutPromise]);
            console.log('Login successful, user:', currentUser);
            setUser(currentUser);
            mealLoggingService.setCurrentUser(currentUser);
            setError(null);
            await getUserProfile(currentUser.$id);
            
            // Check if user has localStorage data to migrate
            try {
                const hasLocalData = localStorage.getItem('dinefit_meal_logs') || localStorage.getItem('dinefit_favorites');
                if (hasLocalData) {
                    console.log('🔄 Local data detected, starting migration...');
                    await mealLoggingService.migrateUserData();
                    console.log('✅ Migration completed, clearing local storage...');
                    await mealLoggingService.clearLocalStorageData();
                }
            } catch (migrationError) {
                console.warn('Migration failed but continuing with login:', migrationError);
            }
            
            return currentUser;
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message);
            if (error.message.includes('timeout') || error.message.includes('Network timeout')) {
                throw new Error('Connection is slow or unavailable. Please check your internet and try again.');
            } else if (error.message.includes('Unable to connect')) {
                throw new Error(error.message);
            } else if (error.message.includes('Invalid credentials') || error.message.includes('invalid_credentials') || error.message.includes('Invalid `password` param') || error.message.includes('password') || error.message.includes('email')) {
                throw new Error('Incorrect email or password');
            } else if (error.message.includes('user_invalid')) {
                throw new Error('Incorrect email or password');
            } else if (error.message.includes('rate_limit')) {
                throw new Error('Too many login attempts. Please wait a moment and try again.');
            } else {
                throw new Error('Incorrect email or password');
            }
        }
    };
    const logout = async () => {
        try {
            await account.deleteSession('current');
            console.log('Session deleted successfully');
            setUser(null);
            mealLoggingService.setCurrentUser(null);
            setUserProfile(null);
            setError(null);
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            setUser(null);
            mealLoggingService.setCurrentUser(null);
            setUserProfile(null);
            navigate('/');
            throw error;
        }
    };
    const signup = async (email, password, name = '') => {
        try {
            // Validate password strength before creating account
            console.log('Validating password strength...');
            const passwordValidation = validatePassword(password);
            console.log('Password validation result:', passwordValidation);
            
            if (!passwordValidation.isValid) {
                console.log('Password validation failed:', passwordValidation.message);
                throw new Error(passwordValidation.message);
            }
            
            const validName = name && name.trim() ? name.trim() : 'User';
            console.log('Creating user account with validated password...');
            const user = await account.create('unique()', email, password, validName);
            console.log('User account created:', user);
            await login(email, password);
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    };
    const getUserProfile = async (userId) => {
        try {
            console.log('Attempting to fetch user profile for user ID:', userId);
            const profiles = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID || 'dinefit-db',
                import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID || 'profiles',
                [
                    Query.equal('userId', userId)
                ]
            );
            if (profiles.documents && profiles.documents.length > 0) {
                const profile = profiles.documents[0]; // Get the first (and should be only) profile
                console.log('Profile found:', profile);
                setUserProfile(profile);
                return profile;
            } else {
                console.log('No profile found for user, will need to create one');
                setUserProfile(null);
                return null;
            }
        } catch (error) {
            console.log('Profile fetch error:', error.message);
            if (error.message.includes('database_not_found') || error.message.includes('collection_not_found')) {
                console.warn('Database or collection not found. Please check Appwrite setup.');
            } else {
                console.warn('Unexpected error fetching profile:', error);
            }
            setUserProfile(null);
            return null;
        }
    };
    const updateProfile = async (profileData) => {
        try {
            if (!user) throw new Error('User not authenticated');
            console.log('Updating profile for user:', user.$id);
            console.log('Profile data:', profileData);
            const profile = {
                userId: user.$id,
                ...profileData,
                updatedAt: new Date().toISOString()
            };
            let savedProfile;
            if (userProfile && userProfile.$id) {
                console.log('Updating existing profile with ID:', userProfile.$id);
                savedProfile = await databases.updateDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID || 'dinefit-db',
                    import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID || 'profiles',
                    userProfile.$id,
                    profile
                );
                console.log('Profile updated successfully');
            } else {
                console.log('Creating new profile for user');
                savedProfile = await databases.createDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID || 'dinefit-db',
                    import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID || 'profiles',
                    'unique()',
                    {
                        ...profile,
                        createdAt: new Date().toISOString()
                    }
                );
                console.log('New profile created successfully');
            }
            setUserProfile(savedProfile);
            console.log('Profile saved successfully to database:', savedProfile);
            return savedProfile;
        } catch (error) {
            console.error('Profile update failed:', error);
            if (error.message.includes('database_not_found')) {
                throw new Error('Database not found. Please check the Appwrite database setup.');
            } else if (error.message.includes('collection_not_found')) {
                throw new Error('Profile collection not found. Please check the Appwrite collection setup.');
            } else if (error.message.includes('permission')) {
                throw new Error('Permission denied. Please check database permissions.');
            } else if (error.message.includes('document_invalid_structure')) {
                throw new Error('Invalid profile data structure. Please check the data format.');
            } else {
                throw new Error(`Profile update failed: ${error.message}`);
            }
        }
    };
    const deleteProfile = async () => {
        try {
            if (!userProfile) return;
            await databases.deleteDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID || 'dinefit-db',
                import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID || 'profiles',
                userProfile.$id
            );
            setUserProfile(null);
            console.log('Profile deleted successfully');
        } catch (error) {
            console.error('Profile deletion failed:', error);
            throw error;
        }
    };
    const guestLogin = async () => {
        try { 
            setError(null);
            
            const guestUser = {
                $id: 'guest_' + Date.now(),
                name: 'Guest User',
                email: 'guest@dinefit.local',
                isGuest: true,
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString()
            };
         
            setUser(guestUser);
            mealLoggingService.setCurrentUser(guestUser);
            setError(null);
           
            const guestProfile = {
                $id: 'guest_profile_' + Date.now(),
                userId: guestUser.$id,
                allergies: 'None specified',
                dietaryPreferences: 'None specified',
                favoriteCuisines: 'All cuisines',
                cookingTime: '30 minutes',
                mealsPerDay: '3',
                isGuest: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            setUserProfile(guestProfile);
           
            return guestUser;
        } catch (error) {
            console.error('Guest login error:', error);
            setError('Failed to start guest session');
            throw new Error('Failed to start guest session');
        }
    };

    const value = {
        user,
        userProfile,
        login,
        logout,
        signup,
        guestLogin,
        updateProfile,
        getUserProfile,
        deleteProfile,
        loading,
        error,
        isAuthenticated: !!user,
        hasProfile: !!userProfile,
        isGuest: user?.isGuest || false
    };
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border border-[hsl(var(--border))] border-t-[hsl(var(--primary))] mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-[hsl(var(--foreground))] mb-2">{loadingMessage}</p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">If this takes too long, please refresh the page</p>
                </div>
            </div>
        );
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
