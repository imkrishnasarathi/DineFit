import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
const ProfileSetup = ({ isFirstTime = false, onComplete, onSkip }) => {
    const { user, userProfile, updateProfile } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        allergies: '',
        dietaryPreferences: '',
        dislikedFoods: '',
        favoriteCuisines: '',
        mealsPerDay: '3',
        cookingTime: ''
    });
    useEffect(() => {
        if (userProfile) {
            console.log('Loading existing profile data:', userProfile);
            setFormData({
                age: userProfile.age || '',
                gender: userProfile.gender || '',
                allergies: userProfile.allergies || '',
                dietaryPreferences: userProfile.dietaryPreferences || '',
                dislikedFoods: userProfile.dislikedFoods || '',
                favoriteCuisines: userProfile.favoriteCuisines || '',
                mealsPerDay: userProfile.mealsPerDay || '3',
                cookingTime: userProfile.cookingTime || ''
            });
        }
    }, [userProfile]);
    const cuisineOptions = [
        'Italian', 'Mexican', 'Chinese', 'Indian', 'Thai', 'Japanese',
        'Mediterranean', 'American', 'French', 'Korean', 'Middle Eastern', 'Other'
    ];
    const dietaryOptions = [
        'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo',
        'Gluten-Free', 'Dairy-Free', 'Low Carb', 'High Protein', 'Halal', 'Kosher'
    ];
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const handleArrayToggle = (field, value) => {
        const currentValues = formData[field] ? formData[field].split(', ').filter(v => v.trim()) : [];
        let newValues;
        if (currentValues.includes(value)) {
            newValues = currentValues.filter(item => item !== value);
        } else {
            newValues = [...currentValues, value];
        }
        setFormData(prev => ({
            ...prev,
            [field]: newValues.join(', ')
        }));
    };
    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };
    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };
    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            console.log('Saving profile data to Appwrite database:', formData);
            const profileDataWithTimestamp = {
                ...formData,
                age: formData.age ? parseInt(formData.age, 10) : null, // Convert age to integer
                createdAt: userProfile?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            console.log('Processed profile data:', profileDataWithTimestamp);
            await updateProfile(profileDataWithTimestamp);
            console.log('Profile saved successfully to database');
            onComplete && onComplete();
        } catch (error) {
            console.error('Profile update failed:', error);
            if (error.message.includes('Database not found') || error.message.includes('Collection not found')) {
                alert('Database setup required. Please contact support or check your configuration.');
            } else if (error.message.includes('permission')) {
                alert('Permission denied. Please check your database permissions.');
            } else {
                alert(`Failed to save profile: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };
    const isStepValid = () => {
        switch (currentStep) {
            case 1:
                return formData.age && formData.gender;
            case 2:
                return true; // Food preferences are optional
            case 3:
                return true; // Meal preferences are optional
            default:
                return false;
        }
    };
    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--card-foreground))] mb-2">
                    Basic Information
                </h2>
                <p className="text-[hsl(var(--muted-foreground))]">Just a few details to personalize your recipes</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-[hsl(var(--card-foreground))] mb-2">Age</label>
                    <input
                        type="number"
                        min="13"
                        max="120"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        className="w-full px-4 py-3 bg-[hsl(var(--input))] backdrop-blur-sm border border-[hsl(var(--border))] rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
                        placeholder="Enter your age"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[hsl(var(--card-foreground))] mb-2">Gender</label>
                    <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full px-4 py-3 bg-[hsl(var(--input))] backdrop-blur-sm border border-[hsl(var(--border))] rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
        </div>
    );
    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--card-foreground))] mb-2">
                    Food Preferences & Restrictions
                </h2>
                <p className="text-[hsl(var(--muted-foreground))]">Help us recommend the perfect recipes for you</p>
            </div>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-[hsl(var(--card-foreground))] mb-2">Food Allergies & Intolerances</label>
                    <textarea
                        value={formData.allergies}
                        onChange={(e) => handleInputChange('allergies', e.target.value)}
                        placeholder="e.g., peanuts, shellfish, dairy, gluten, eggs..."
                        rows="3"
                        className="w-full px-4 py-3 bg-[hsl(var(--input))] backdrop-blur-sm border border-[hsl(var(--border))] rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Separate multiple items with commas</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[hsl(var(--card-foreground))] mb-4">Dietary Preferences</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {dietaryOptions.map((option) => (
                            <div
                                key={option}
                                onClick={() => handleArrayToggle('dietaryPreferences', option)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 text-center ${
                                    formData.dietaryPreferences.includes(option)
                                        ? 'border-[hsl(var(--primary))] bg-[hsl(var(--card))]/70 backdrop-blur-sm text-[hsl(var(--primary))]'
                                        : 'border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 backdrop-blur-sm hover:border-[hsl(var(--primary))]'
                                }`}
                            >
                                <span className="text-sm font-medium">{option}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[hsl(var(--card-foreground))] mb-2">Foods You Dislike</label>
                    <textarea
                        value={formData.dislikedFoods}
                        onChange={(e) => handleInputChange('dislikedFoods', e.target.value)}
                        placeholder="e.g., mushrooms, seafood, spicy food, cilantro..."
                        rows="3"
                        className="w-full px-4 py-3 bg-[hsl(var(--input))] backdrop-blur-sm border border-[hsl(var(--border))] rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Separate multiple items with commas</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-4">Favorite Cuisines</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {cuisineOptions.map((cuisine) => (
                            <div
                                key={cuisine}
                                onClick={() => handleArrayToggle('favoriteCuisines', cuisine)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 text-center ${
                                    formData.favoriteCuisines.includes(cuisine)
                                        ? 'border-[hsl(var(--primary))] bg-[hsl(var(--card))]/70 backdrop-blur-sm text-[hsl(var(--primary))]'
                                        : 'border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 backdrop-blur-sm hover:border-[hsl(var(--primary))]'
                                }`}
                            >
                                <span className="text-sm font-medium">{cuisine}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--card-foreground))] mb-2">
                    Cooking Preferences
                </h2>
                <p className="text-[hsl(var(--muted-foreground))]">Tell us about your cooking style and preferences</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">Meals per Day</label>
                    <select
                        value={formData.mealsPerDay}
                        onChange={(e) => handleInputChange('mealsPerDay', e.target.value)}
                        className="w-full px-4 py-3 bg-[hsl(var(--input))] backdrop-blur-sm border border-[hsl(var(--border))] rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
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
                        value={formData.cookingTime}
                        onChange={(e) => handleInputChange('cookingTime', e.target.value)}
                        className="w-full px-4 py-3 bg-[hsl(var(--input))] backdrop-blur-sm border border-[hsl(var(--border))] rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
                    >
                        <option value="">Select cooking time</option>
                        <option value="quick">Quick & Easy (15 min or less)</option>
                        <option value="moderate">Moderate (15-45 min)</option>
                        <option value="elaborate">Take Your Time (45+ min)</option>
                        <option value="no_cooking">Minimal/No Cooking</option>
                    </select>
                </div>
            </div>
        </div>
    );
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[hsl(var(--card)/0.9)] backdrop-blur-md rounded-3xl shadow-2xl border border-[hsl(var(--border))] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 sm:p-8 lg:p-10">
                    
                    <div className="mb-8">
                        <div className="flex justify-between text-sm text-[hsl(var(--muted-foreground))] mb-2">
                            <span>Step {currentStep} of 3</span>
                            <span>{Math.round((currentStep / 3) * 100)}% Complete</span>
                        </div>
                        <div className="w-full bg-[hsl(var(--muted))] rounded-full h-2">
                            <div 
                                className="bg-[hsl(var(--primary))] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(currentStep / 3) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                    
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-[hsl(var(--border))]">
                        <div className="flex gap-3">
                            {currentStep > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="px-6 py-3 text-[hsl(var(--muted-foreground))] bg-[hsl(var(--card))]/70 backdrop-blur-sm rounded-xl hover:bg-[hsl(var(--card))]/90 transition-all duration-200 border border-[hsl(var(--border))]"
                                >
                                    Back
                                </button>
                            )}
                            {isFirstTime && (
                                <button
                                    onClick={onSkip}
                                    className="px-6 py-3 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--card-foreground))] transition-colors duration-200"
                                >
                                    Skip for now
                                </button>
                            )}
                        </div>
                        <button
                            onClick={handleNext}
                            disabled={!isStepValid() || isLoading}
                            className="px-8 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:brightness-105"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </div>
                            ) : currentStep === 3 ? (
                                'Complete Setup'
                            ) : (
                                'Next'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProfileSetup;
