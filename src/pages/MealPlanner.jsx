import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mealPlannerService } from '../services/mealPlannerService';
import RecipeModal from '../components/RecipeModal';
import MealPlanCard from '../components/MealPlanCard';
import SavedMealPlans from '../components/SavedMealPlans';

const MealPlanner = () => {
  const { user, userProfile } = useAuth();
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState(1);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [replacingMeal, setReplacingMeal] = useState(null);
  const [showSavedPlans, setShowSavedPlans] = useState(false);

  const plannerOptions = {
    days: [1, 3, 7],
    calorieTargets: {
      light: { min: 1200, max: 1500, label: 'Weight Loss (1200-1500 cal)' },
      moderate: { min: 1500, max: 2000, label: 'Maintenance (1500-2000 cal)' },
      heavy: { min: 2000, max: 2500, label: 'Weight Gain (2000-2500 cal)' }
    }
  };

  useEffect(() => {
    // Auto-generate a plan on component mount if user has profile
    if (userProfile) {
      generateInitialPlan();
    }
  }, [userProfile]);

  const generateInitialPlan = async () => {
    if (!userProfile) return;
    
    setLoading(true);
    try {
      const plan = await mealPlannerService.generateMealPlan(userProfile, selectedDays);
      setMealPlan(plan);
    } catch (error) {
      console.error('Error generating initial plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewPlan = async () => {
    setLoading(true);
    try {
      const plan = await mealPlannerService.generateMealPlan(userProfile, selectedDays);
      setMealPlan(plan);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      alert('Error generating meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const replaceMeal = async (day, mealType) => {
    if (!mealPlan) return;
    
    setReplacingMeal({ day, mealType });
    try {
      const updatedPlan = await mealPlannerService.replaceMeal(mealPlan.id, day, mealType, userProfile);
      setMealPlan(updatedPlan);
    } catch (error) {
      console.error('Error replacing meal:', error);
      alert('Error replacing meal. Please try again.');
    } finally {
      setReplacingMeal(null);
    }
  };

  const savePlan = async () => {
    if (!mealPlan) return;
    
    try {
      const success = await mealPlannerService.saveMealPlan(mealPlan.id, userProfile, user?.$id);
      if (success) {
        alert('Meal plan saved successfully!');
      } else {
        alert('Error saving meal plan.');
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Error saving meal plan.');
    }
  };

  const exportPlan = (format) => {
    if (!mealPlan) return;
    
    try {
      mealPlannerService.exportMealPlan(mealPlan, format);
    } catch (error) {
      console.error('Error exporting plan:', error);
      alert('Error exporting meal plan.');
    }
  };

  const openRecipeDetails = (meal) => {
    setSelectedMeal(meal);
    setShowRecipeModal(true);
  };

  const loadSavedPlan = (plan) => {
    setMealPlan(plan);
    setShowSavedPlans(false);
  };





  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100"></div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-emerald-200/20 to-teal-300/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-200/15 to-blue-300/15 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute -bottom-32 left-1/4 w-72 h-72 bg-gradient-to-r from-teal-200/20 to-emerald-300/20 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8 backdrop-blur-sm bg-white/30 rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
            🗓️ Meal Planner
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-6">
            Plan your meals based on your dietary preferences
          </p>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Days:</label>
              <select 
                value={selectedDays} 
                onChange={(e) => setSelectedDays(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {plannerOptions.days.map(day => (
                  <option key={day} value={day}>
                    {day} day{day > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={generateNewPlan}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate New Plan'}
            </button>
            
            <button
              onClick={() => setShowSavedPlans(true)}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              📋 View Saved Plans
            </button>
          </div>
        </div>

        {/* Meal Plan Display */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-lg text-gray-600">Generating your personalized meal plan...</p>
          </div>
        )}

        {mealPlan && !loading && (
          <div className="space-y-8">
            {/* Plan Summary */}
            <div className="backdrop-blur-sm bg-white/40 rounded-2xl p-6 shadow-lg border border-white/30">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-600">{mealPlan.days}</div>
                  <div className="text-sm text-gray-600">Days</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-teal-600">{mealPlan.avgCaloriesPerDay}</div>
                  <div className="text-sm text-gray-600">Avg Calories/Day</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-600">{mealPlan.totalCalories}</div>
                  <div className="text-sm text-gray-600">Total Calories</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Object.values(mealPlan.meals.day1 || {}).filter(meal => meal).length}
                  </div>
                  <div className="text-sm text-gray-600">Meals/Day</div>
                </div>
              </div>
            </div>

            {/* Days */}
            {Array.from({ length: mealPlan.days }, (_, index) => {
              const day = index + 1;
              const dayKey = `day${day}`;
              const dayMeals = mealPlan.meals[dayKey] || {};

              return (
                <div key={day} className="backdrop-blur-sm bg-white/30 rounded-2xl p-6 shadow-lg border border-white/20">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Day {day}
                    {day === 1 && ' (Today)'}
                    {day === 2 && ' (Tomorrow)'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(dayMeals).map(([mealType, meal]) => (
                      <MealPlanCard
                        key={mealType}
                        meal={meal}
                        mealType={mealType}
                        day={day}
                        onReplace={replaceMeal}
                        onViewDetails={openRecipeDetails}
                        isReplacing={replacingMeal?.day === day && replacingMeal?.mealType === mealType}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={savePlan}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
              >
                💾 Save Plan
              </button>
              
              <button
                onClick={() => exportPlan('text')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg"
              >
                📄 Export as Text
              </button>
              
              <button
                onClick={() => exportPlan('json')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
              >
                💾 Export as JSON
              </button>
            </div>
          </div>
        )}

        {/* No Profile Warning */}
        {!userProfile && !loading && (
          <div className="text-center backdrop-blur-sm bg-gradient-to-r from-orange-100/50 to-red-100/50 rounded-3xl p-8 shadow-xl border border-orange-200/30">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h2 className="text-2xl font-bold text-orange-800 mb-4">Profile Setup Required</h2>
            <p className="text-lg text-orange-700 mb-6">
              To generate personalized meal plans, please complete your profile setup first. 
              This helps us understand your dietary preferences and restrictions.
            </p>
            <a 
              href="/settings" 
              className="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors duration-200"
            >
              Complete Profile Setup
            </a>
          </div>
        )}
      </div>

      {/* Recipe Modal */}
      {showRecipeModal && selectedMeal && (
        <RecipeModal
          recipe={selectedMeal}
          onClose={() => {
            setShowRecipeModal(false);
            setSelectedMeal(null);
          }}
        />
      )}

      {/* Saved Plans Modal */}
      {showSavedPlans && (
        <SavedMealPlans
          onSelectPlan={loadSavedPlan}
          onClose={() => setShowSavedPlans(false)}
        />
      )}
    </div>
  );
};

export default MealPlanner;