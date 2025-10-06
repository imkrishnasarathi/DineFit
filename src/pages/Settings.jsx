import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
const Settings = () => {
    const { user, userProfile, updateProfile, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const handleQuickUpdate = async (field, value) => {
        setIsLoading(true);
        try {
            console.log(`Updating ${field} to:`, value);
            await updateProfile({ 
                ...userProfile, // Include existing profile data
                [field]: value,
                updatedAt: new Date().toISOString()
            });
            console.log(`Successfully updated ${field}`);
        } catch (error) {
            console.error('Quick update failed:', error);
            if (error.message.includes('Database not found') || error.message.includes('Collection not found')) {
                alert('Database setup required. Please contact support.');
            } else {
                alert(`Failed to update ${field}: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };
    const tabs = [
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'health', label: 'Food Preferences', icon: '�️' },
        { id: 'preferences', label: 'Cooking', icon: '👨‍🍳' },
        { id: 'account', label: 'Account', icon: '🔒' }
    ];
    return (
        <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
            
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
            
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-emerald-200/20 to-teal-300/20 dark:from-emerald-800/15 dark:to-teal-800/15 rounded-full blur-3xl animate-float"></div>
                <div className="absolute top-1/3 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-200/15 to-blue-300/15 dark:from-cyan-800/10 dark:to-blue-800/10 rounded-full blur-3xl animate-float-delayed"></div>
                <div className="absolute -bottom-32 left-1/4 w-72 h-72 bg-gradient-to-r from-teal-200/20 to-emerald-300/20 dark:from-teal-800/15 dark:to-emerald-800/15 rounded-full blur-3xl animate-float-slow"></div>
                
                <div className="absolute top-20 right-20 w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 dark:from-emerald-600 dark:to-teal-600 transform rotate-45 animate-spin-slow opacity-10 dark:opacity-20"></div>
                <div className="absolute bottom-32 left-16 w-6 h-16 bg-gradient-to-b from-cyan-400 to-blue-500 dark:from-cyan-600 dark:to-blue-600 transform -skew-y-12 animate-sway opacity-15 dark:opacity-25"></div>
            </div>
            
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                
                <div className="text-center mb-8 backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 dark:border-gray-700/20">
                    <div className="flex items-center justify-between mb-4">
                        <Link 
                            to="/dashboard"
                            className="p-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-700/70"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                            Settings
                        </h1>
                        <div className="w-9"></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">Manage your profile and preferences</p>
                </div>
                
                <div className="mb-8">
                    <div className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 rounded-2xl p-2 shadow-lg border border-white/30 dark:border-gray-700/30">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`p-3 rounded-xl font-medium transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                                    }`}
                                >
                                    <div className="text-lg mb-1">{tab.icon}</div>
                                    <div className="text-sm">{tab.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 rounded-3xl p-6 sm:p-8 shadow-xl border border-white/30 dark:border-gray-700/30">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Age</label>
                                    <input
                                        type="number"
                                        min="13"
                                        max="120"
                                        defaultValue={userProfile?.age || ''}
                                        onBlur={(e) => handleQuickUpdate('age', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                                        placeholder="25"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                                    <select
                                        defaultValue={userProfile?.gender || ''}
                                        onChange={(e) => handleQuickUpdate('gender', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'health' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Food Preferences & Restrictions</h2>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Food Allergies & Intolerances</h3>
                                <div className="mb-4">
                                    <textarea
                                        defaultValue={userProfile?.allergies || ''}
                                        onBlur={(e) => handleQuickUpdate('allergies', e.target.value)}
                                        placeholder="e.g., peanuts, shellfish, dairy, gluten, eggs..."
                                        rows="3"
                                        className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 resize-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                    />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Foods You Dislike</h3>
                                <div className="mb-4">
                                    <textarea
                                        defaultValue={userProfile?.dislikedFoods || ''}
                                        onBlur={(e) => handleQuickUpdate('dislikedFoods', e.target.value)}
                                        placeholder="e.g., mushrooms, seafood, spicy food, cilantro..."
                                        rows="3"
                                        className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 resize-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                    />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Dietary Preferences</h3>
                                <div className="mb-4">
                                    <textarea
                                        defaultValue={userProfile?.dietaryPreferences || ''}
                                        onBlur={(e) => handleQuickUpdate('dietaryPreferences', e.target.value)}
                                        placeholder="e.g., Vegetarian, Vegan, Keto, Gluten-Free..."
                                        rows="2"
                                        className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 resize-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                    />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Favorite Cuisines</h3>
                                <div className="mb-4">
                                    <textarea
                                        defaultValue={userProfile?.favoriteCuisines || ''}
                                        onBlur={(e) => handleQuickUpdate('favoriteCuisines', e.target.value)}
                                        placeholder="e.g., Italian, Mexican, Chinese, Indian..."
                                        rows="2"
                                        className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 resize-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'preferences' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Cooking Preferences</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meals per Day</label>
                                    <select
                                        defaultValue={userProfile?.mealsPerDay || '3'}
                                        onChange={(e) => handleQuickUpdate('mealsPerDay', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="2">2 meals</option>
                                        <option value="3">3 meals</option>
                                        <option value="4">4 meals</option>
                                        <option value="5">5 meals</option>
                                        <option value="6">6+ meals</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cooking Time Preference</label>
                                    <select
                                        defaultValue={userProfile?.cookingTime || ''}
                                        onChange={(e) => handleQuickUpdate('cookingTime', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="">Select preference</option>
                                        <option value="quick">Quick & Easy (15 min or less)</option>
                                        <option value="moderate">Moderate (15-45 min)</option>
                                        <option value="elaborate">Take Your Time (45+ min)</option>
                                        <option value="no_cooking">Minimal/No Cooking</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'account' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Account Settings</h2>
                            <div className="space-y-4">
                                <div className="bg-gray-50/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-xl p-4">
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Account Information</h3>
                                    <p className="text-gray-600 dark:text-gray-300">Email: {user?.email}</p>
                                    <p className="text-gray-600 dark:text-gray-300">Name: {user?.name}</p>
                                    <p className="text-gray-600 dark:text-gray-300">Member since: {new Date(user?.$createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => logout()}
                                        className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        Sign Out
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Delete Account</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Are you sure you want to delete your account? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                }}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Settings;
