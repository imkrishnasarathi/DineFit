import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
const Settings = () => {
    const { user, userProfile, updateProfile, updateEmail, updateName, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    // Edit profile form state
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        age: '',
        gender: '',
        password: ''
    });
    const [editFormErrors, setEditFormErrors] = useState({});
    const [editFormLoading, setEditFormLoading] = useState(false);
    const [editFormSuccess, setEditFormSuccess] = useState(false);
    
    // Initialize edit form data when user data is available
    React.useEffect(() => {
        if (user && userProfile) {
            setEditFormData({
                name: user.name || '',
                email: user.email || '',
                // ensure input receives a string; DB keeps integer
                age: (userProfile.age !== undefined && userProfile.age !== null)
                    ? String(userProfile.age)
                    : '',
                gender: userProfile.gender || '',
                password: ''
            });
        }
    }, [user, userProfile]);
    
    // Form validation
    const validateEditForm = () => {
        const errors = {};
        
        if (!editFormData.name.trim()) {
            errors.name = 'Name is required';
        } else if (editFormData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }
        
        if (!editFormData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        if (editFormData.age && (isNaN(editFormData.age) || editFormData.age < 13 || editFormData.age > 120)) {
            errors.age = 'Age must be between 13 and 120';
        }
        
        // Password is required only if email is being changed
        if (editFormData.email !== user?.email && !editFormData.password.trim()) {
            errors.password = 'Current password is required to change email';
        }
        
        setEditFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    // Handle edit form submission
    const handleEditProfileSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateEditForm()) {
            return;
        }
        
        setEditFormLoading(true);
        setEditFormErrors({});
        setEditFormSuccess(false);
        
        try {
            // Convert age to integer for backend (Appwrite) schema
            const normalizedAge = editFormData.age === ''
                ? null
                : parseInt(editFormData.age, 10);

            // Update profile data (age and gender)
            await updateProfile({
                ...userProfile,
                // Only include age if valid or null; avoid sending empty string
                age: Number.isNaN(normalizedAge) ? null : normalizedAge,
                gender: editFormData.gender,
                updatedAt: new Date().toISOString()
            });
            
            // Update name if it has changed
            if (editFormData.name !== user.name) {
                await updateName(editFormData.name);
            }
            
            // Update email if it has changed
            if (editFormData.email !== user.email) {
                await updateEmail(editFormData.email, editFormData.password);
            }
            
            setEditFormSuccess(true);
            setIsEditingProfile(false);
            
            // Clear success message after 3 seconds
            setTimeout(() => setEditFormSuccess(false), 3000);
            
        } catch (error) {
            console.error('Profile update failed:', error);
            setEditFormErrors({ 
                submit: error.message || 'Failed to update profile. Please try again.' 
            });
        } finally {
            setEditFormLoading(false);
        }
    };
    
    // Handle form input changes
    const handleEditFormChange = (field, value) => {
        setEditFormData(prev => ({ ...prev, [field]: value }));
        // Clear field-specific error when user starts typing
        if (editFormErrors[field]) {
            setEditFormErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    
    // Reset edit form
    const resetEditForm = () => {
        if (user && userProfile) {
            setEditFormData({
                name: user.name || '',
                email: user.email || '',
                age: userProfile.age || '',
                gender: userProfile.gender || '',
                password: ''
            });
        }
        setEditFormErrors({});
        setIsEditingProfile(false);
        setEditFormSuccess(false);
    };
    
    const handleQuickUpdate = async (field, value) => {
        setIsLoading(true);
        try {
            console.log(`Updating ${field} to:`, value);
            // Coerce numeric fields to integers to satisfy schema
            let coercedValue = value;
            if (field === 'age') {
                if (value === '' || value === null || value === undefined) {
                    coercedValue = null;
                } else {
                    const parsed = parseInt(value, 10);
                    coercedValue = Number.isNaN(parsed) ? null : parsed;
                }
            }
            await updateProfile({
                ...userProfile, // Include existing profile data
                [field]: coercedValue,
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
            
            <div className="absolute inset-0 bg-[hsl(var(--background))]"></div>
            
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-emerald-200/20 to-teal-300/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute top-1/3 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-200/15 to-blue-300/15 rounded-full blur-3xl animate-float-delayed"></div>
            </div>
            
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                
                <div className="text-center mb-8 backdrop-blur-sm bg-[hsl(var(--card))]/40 rounded-3xl p-6 sm:p-8 shadow-xl border border-[hsl(var(--border))]/20">
                    <div className="flex items-center justify-between mb-4">
                        <Link 
                            to="/dashboard"
                            className="p-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors duration-200 backdrop-blur-sm bg-[hsl(var(--card))]/50 rounded-xl hover:bg-[hsl(var(--card))]/70"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Settings
                        </h1>
                        <div className="w-9"></div>
                    </div>
                    <p className="text-[hsl(var(--muted-foreground))]">Manage your profile and preferences</p>
                </div>
                
                <div className="mb-8">
                    <div className="backdrop-blur-sm bg-[hsl(var(--card))]/50 rounded-2xl p-2 shadow-lg border border-[hsl(var(--border))]">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`p-3 rounded-xl font-medium transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-[hsl(var(--primary-foreground))] shadow-lg'
                                            : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))]/60'
                                    }`}
                                >
                                    <div className="text-lg mb-1">{tab.icon}</div>
                                    <div className="text-sm">{tab.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="backdrop-blur-sm bg-[hsl(var(--card))]/50 rounded-3xl p-6 sm:p-8 shadow-xl border border-[hsl(var(--border))]">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-[hsl(var(--card-foreground))] mb-6">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">Age</label>
                                    <input
                                        type="number"
                                        min="13"
                                        max="120"
                                        defaultValue={userProfile?.age || ''}
                                        onBlur={(e) => handleQuickUpdate('age', e.target.value)}
                                        className="w-full px-4 py-3 bg-[hsl(var(--input))] border border-[hsl(var(--border))] rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))/0.24] text-[hsl(var(--card-foreground))]"
                                        placeholder="25"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">Gender</label>
                                    <select
                                        defaultValue={userProfile?.gender || ''}
                                        onChange={(e) => handleQuickUpdate('gender', e.target.value)}
                                        className="w-full px-4 py-3 bg-[hsl(var(--input))] border border-[hsl(var(--border))] rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))/0.24] text-[hsl(var(--card-foreground))]"
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
                            <h2 className="text-2xl font-bold text-[hsl(var(--card-foreground))] mb-6">Food Preferences & Restrictions</h2>
                            <div>
                                <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))] mb-3">Food Allergies & Intolerances</h3>
                                <div className="mb-4">
                                    <textarea
                                        defaultValue={userProfile?.allergies || ''}
                                        onBlur={(e) => handleQuickUpdate('allergies', e.target.value)}
                                        placeholder="e.g., peanuts, shellfish, dairy, gluten, eggs..."
                                        rows="3"
                                        className="w-full px-4 py-3 bg-[hsl(var(--input))] border border-[hsl(var(--border))] rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))/0.24] resize-none text-[hsl(var(--card-foreground))]"
                                    />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))] mb-3">Foods You Dislike</h3>
                                <div className="mb-4">
                                    <textarea
                                        defaultValue={userProfile?.dislikedFoods || ''}
                                        onBlur={(e) => handleQuickUpdate('dislikedFoods', e.target.value)}
                                        placeholder="e.g., mushrooms, seafood, spicy food, cilantro..."
                                        rows="3"
                                        className="w-full px-4 py-3 bg-[hsl(var(--input))] border border-[hsl(var(--border))] rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))/0.24] resize-none text-[hsl(var(--card-foreground))]"
                                    />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))] mb-3">Dietary Preferences</h3>
                                <div className="mb-4">
                                    <textarea
                                        defaultValue={userProfile?.dietaryPreferences || ''}
                                        onBlur={(e) => handleQuickUpdate('dietaryPreferences', e.target.value)}
                                        placeholder="e.g., Vegetarian, Vegan, Keto, Gluten-Free..."
                                        rows="2"
                                        className="w-full px-4 py-3 bg-[hsl(var(--input))] border border-[hsl(var(--border))] rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))/0.24] resize-none text-[hsl(var(--card-foreground))]"
                                    />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))] mb-3">Favorite Cuisines</h3>
                                <div className="mb-4">
                                    <textarea
                                        defaultValue={userProfile?.favoriteCuisines || ''}
                                        onBlur={(e) => handleQuickUpdate('favoriteCuisines', e.target.value)}
                                        placeholder="e.g., Italian, Mexican, Chinese, Indian..."
                                        rows="2"
                                        className="w-full px-4 py-3 bg-[hsl(var(--input))] border border-[hsl(var(--border))] rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))/0.24] resize-none text-[hsl(var(--card-foreground))]"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'preferences' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-[hsl(var(--card-foreground))] mb-6">Cooking Preferences</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">Meals per Day</label>
                                    <select
                                        defaultValue={userProfile?.mealsPerDay || '3'}
                                        onChange={(e) => handleQuickUpdate('mealsPerDay', e.target.value)}
                                        className="w-full px-4 py-3 bg-[hsl(var(--input))] border border-[hsl(var(--border))] rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))/0.24] text-[hsl(var(--card-foreground))]"
                                    >
                                        <option value="2">2 meals</option>
                                        <option value="3">3 meals</option>
                                        <option value="4">4 meals</option>
                                        <option value="5">5 meals</option>
                                        <option value="6">6+ meals</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">Cooking Time Preference</label>
                                    <select
                                        defaultValue={userProfile?.cookingTime || ''}
                                        onChange={(e) => handleQuickUpdate('cookingTime', e.target.value)}
                                        className="w-full px-4 py-3 bg-[hsl(var(--input))] border border-[hsl(var(--border))] rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))/0.24] text-[hsl(var(--card-foreground))]"
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
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-[hsl(var(--card-foreground))]">Account Settings</h2>
                                {!isEditingProfile && (
                                    <button
                                        onClick={() => setIsEditingProfile(true)}
                                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 font-medium"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                            
                            {/* Success Message */}
                            {editFormSuccess && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Profile updated successfully!
                                    </div>
                                </div>
                            )}
                            
                            {!isEditingProfile ? (
                                // View Mode
                                <div className="space-y-4">
                                    <div className="bg-[hsl(var(--card))]/50 backdrop-blur-sm rounded-xl p-4 border border-[hsl(var(--border))]">
                                        <h3 className="font-semibold text-[hsl(var(--card-foreground))] mb-2">Account Information</h3>
                                        <p className="text-[hsl(var(--muted-foreground))]">Email: {user?.email}</p>
                                        <p className="text-[hsl(var(--muted-foreground))]">Name: {user?.name}</p>
                                        <p className="text-[hsl(var(--muted-foreground))]">Age: {userProfile?.age || 'Not specified'}</p>
                                        <p className="text-[hsl(var(--muted-foreground))]">Gender: {userProfile?.gender || 'Not specified'}</p>
                                        <p className="text-[hsl(var(--muted-foreground))]">Member since: {new Date(user?.$createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={() => logout()}
                                            className="flex-1 px-6 py-3 bg-[hsl(var(--muted-foreground))] text-[hsl(var(--card))] rounded-xl hover:brightness-95 transition-colors duration-200"
                                        >
                                            Sign Out
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="flex-1 px-6 py-3 bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] rounded-xl hover:brightness-95 transition-colors duration-200"
                                        >
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Edit Mode
                                <form onSubmit={handleEditProfileSubmit} className="space-y-6">
                                    <div className="bg-[hsl(var(--card))]/50 backdrop-blur-sm rounded-xl p-6 border border-[hsl(var(--border))]">
                                        <h3 className="font-semibold text-[hsl(var(--card-foreground))] mb-4">Edit Profile Information</h3>
                                        
                                        {/* Name Field */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                value={editFormData.name}
                                                onChange={(e) => handleEditFormChange('name', e.target.value)}
                                                className={`w-full px-4 py-3 bg-[hsl(var(--input))] border rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))/0.24] text-[hsl(var(--card-foreground))] ${
                                                    editFormErrors.name ? 'border-red-500' : 'border-[hsl(var(--border))]'
                                                }`}
                                                placeholder="Enter your name"
                                                disabled={editFormLoading}
                                            />
                                            {editFormErrors.name && (
                                                <p className="text-red-500 text-sm mt-1">{editFormErrors.name}</p>
                                            )}
                                        </div>
                                        
                                        {/* Email Field */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={editFormData.email}
                                                onChange={(e) => handleEditFormChange('email', e.target.value)}
                                                className={`w-full px-4 py-3 bg-[hsl(var(--input))] border rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))/0.24] text-[hsl(var(--card-foreground))] ${
                                                    editFormErrors.email ? 'border-red-500' : 'border-[hsl(var(--border))]'
                                                }`}
                                                placeholder="Enter your email"
                                                disabled={editFormLoading}
                                            />
                                            {editFormErrors.email && (
                                                <p className="text-red-500 text-sm mt-1">{editFormErrors.email}</p>
                                            )}
                                            
                                        </div>
                                        
                                        {/* Password Field - Only show if email is being changed */}
                                        {editFormData.email !== user?.email && (
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={editFormData.password}
                                                    onChange={(e) => handleEditFormChange('password', e.target.value)}
                                                    className={`w-full px-4 py-3 bg-[hsl(var(--input))] border rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))/0.24] text-[hsl(var(--card-foreground))] ${
                                                        editFormErrors.password ? 'border-red-500' : 'border-[hsl(var(--border))]'
                                                    }`}
                                                    placeholder="Enter your current password"
                                                    disabled={editFormLoading}
                                                />
                                                {editFormErrors.password && (
                                                    <p className="text-red-500 text-sm mt-1">{editFormErrors.password}</p>
                                                )}
                                                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                                                    Required to change email address
                                                </p>
                                            </div>
                                        )}
                                        
                                        {/* Age Field */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">
                                                Age
                                            </label>
                                            <input
                                                type="number"
                                                min="13"
                                                max="120"
                                                value={editFormData.age}
                                                onChange={(e) => handleEditFormChange('age', e.target.value)}
                                                className={`w-full px-4 py-3 bg-[hsl(var(--input))] border rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))/0.24] text-[hsl(var(--card-foreground))] ${
                                                    editFormErrors.age ? 'border-red-500' : 'border-[hsl(var(--border))]'
                                                }`}
                                                placeholder="Enter your age"
                                                disabled={editFormLoading}
                                            />
                                            {editFormErrors.age && (
                                                <p className="text-red-500 text-sm mt-1">{editFormErrors.age}</p>
                                            )}
                                        </div>
                                        
                                        {/* Gender Field */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">
                                                Gender
                                            </label>
                                            <select
                                                value={editFormData.gender}
                                                onChange={(e) => handleEditFormChange('gender', e.target.value)}
                                                className="w-full px-4 py-3 bg-[hsl(var(--input))] border border-[hsl(var(--border))] rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))/0.24] text-[hsl(var(--card-foreground))]"
                                                disabled={editFormLoading}
                                            >
                                                <option value="">Select gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        
                                        {/* Submit Error */}
                                        {editFormErrors.submit && (
                                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl">
                                                {editFormErrors.submit}
                                            </div>
                                        )}
                                        
                                        {/* Form Actions */}
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                type="submit"
                                                disabled={editFormLoading}
                                                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {editFormLoading ? 'Updating...' : 'Save Changes'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={resetEditForm}
                                                disabled={editFormLoading}
                                                className="flex-1 px-6 py-3 bg-[hsl(var(--muted-foreground))] text-[hsl(var(--card))] rounded-xl hover:brightness-95 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[hsl(var(--card))] rounded-2xl p-6 max-w-md w-full border border-[hsl(var(--border))]">
                        <h3 className="text-xl font-bold text-[hsl(var(--card-foreground))] mb-4">Delete Account</h3>
                        <p className="text-[hsl(var(--muted-foreground))] mb-6">
                            Are you sure you want to delete your account? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 bg-[hsl(var(--input))] text-[hsl(var(--card-foreground))] rounded-lg hover:brightness-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                }}
                                className="flex-1 px-4 py-2 bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] rounded-lg hover:brightness-95"
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
