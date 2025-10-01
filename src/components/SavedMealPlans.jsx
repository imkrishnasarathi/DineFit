import React, { useState, useEffect } from 'react';
import { mealPlannerService } from '../services/mealPlannerService';

const SavedMealPlans = ({ onSelectPlan, onClose }) => {
  const [savedPlans, setSavedPlans] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedPlans();
  }, []);

  const loadSavedPlans = async () => {
    try {
      const plans = mealPlannerService.getSavedPlans();
      setSavedPlans(plans);
    } catch (error) {
      console.error('Error loading saved plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = (planId) => {
    if (window.confirm('Are you sure you want to delete this meal plan?')) {
      try {
        const plans = mealPlannerService.getSavedPlans();
        delete plans[planId];
        localStorage.setItem('savedMealPlans', JSON.stringify(plans));
        setSavedPlans(plans);
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const planEntries = Object.entries(savedPlans);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Saved Meal Plans</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <p className="mt-2 text-gray-600">Loading saved plans...</p>
            </div>
          ) : planEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-4 block">📋</span>
              <h3 className="text-xl font-medium mb-2">No saved meal plans</h3>
              <p>Create and save a meal plan to see it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {planEntries.map(([planId, plan]) => (
                <div key={planId} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {plan.name || `${plan.days}-Day Plan`}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Created: {formatDate(plan.createdAt)}
                      </p>
                      {plan.savedAt && (
                        <p className="text-sm text-gray-500">
                          Saved: {formatDate(plan.savedAt)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deletePlan(planId)}
                      className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"
                      title="Delete plan"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center mb-4 text-sm">
                    <div>
                      <div className="font-semibold text-emerald-600">{plan.days}</div>
                      <div className="text-gray-500">Days</div>
                    </div>
                    <div>
                      <div className="font-semibold text-teal-600">{plan.avgCaloriesPerDay || 'N/A'}</div>
                      <div className="text-gray-500">Avg Cal/Day</div>
                    </div>
                    <div>
                      <div className="font-semibold text-cyan-600">
                        {Object.values(plan.meals?.day1 || {}).filter(meal => meal).length || 0}
                      </div>
                      <div className="text-gray-500">Meals/Day</div>
                    </div>
                  </div>

                  {/* Preview of Day 1 meals */}
                  {plan.meals?.day1 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Day 1 Preview:</h4>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        {Object.entries(plan.meals.day1).map(([mealType, meal]) => (
                          meal && (
                            <div key={mealType} className="truncate">
                              <span className="font-medium capitalize">{mealType}:</span> {meal.name}
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => onSelectPlan(plan)}
                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    Load This Plan
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="text-sm text-gray-600">
            <p>💡 Tip: Click "Load This Plan" to view and modify any saved meal plan.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedMealPlans;