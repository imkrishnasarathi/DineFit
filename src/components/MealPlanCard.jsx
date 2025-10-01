import React from 'react';

const MealPlanCard = ({ meal, mealType, day, onReplace, onViewDetails, isReplacing }) => {
  const getMealTypeIcon = (type) => {
    const icons = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙',
      snack: '🍎'
    };
    return icons[type] || '🍽️';
  };

  const formatCalories = (calories) => {
    return calories ? `${calories} cal` : 'N/A';
  };

  if (!meal) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{getMealTypeIcon(mealType)}</span>
            <div>
              <h4 className="font-semibold text-gray-800 capitalize">{mealType}</h4>
              <p className="text-sm text-gray-500">No meal planned</p>
            </div>
          </div>
        </div>
        <div className="text-center py-8 text-gray-400">
          <span className="text-3xl mb-2 block">🍽️</span>
          <p>No meal planned</p>
          <button
            onClick={() => onReplace(day, mealType)}
            className="mt-2 text-emerald-600 hover:text-emerald-800 text-sm font-medium"
          >
            Add meal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{getMealTypeIcon(mealType)}</span>
          <div>
            <h4 className="font-semibold text-gray-800 capitalize">{mealType}</h4>
            <p className="text-sm text-gray-500">{formatCalories(meal.estimatedCalories)}</p>
          </div>
        </div>
        <button
          onClick={() => onReplace(day, mealType)}
          disabled={isReplacing}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors disabled:opacity-50 p-1 rounded hover:bg-blue-50"
          title="Replace this meal"
        >
          {isReplacing ? (
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </button>
      </div>
      
      <div 
        className="cursor-pointer"
        onClick={() => onViewDetails(meal)}
      >
        {meal.image && (
          <img 
            src={meal.image} 
            alt={meal.name}
            className="w-full h-32 object-cover rounded-lg mb-3"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <h5 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-emerald-600 transition-colors">
          {meal.name}
        </h5>
        <div className="flex justify-between text-sm text-gray-600 mb-3">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {meal.cookingTime || 'N/A'}
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {meal.servings || 1}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
            {meal.difficulty || 'Medium'}
          </span>
          {meal.vegetarian && (
            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              Vegetarian
            </span>
          )}
          {meal.vegan && (
            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              Vegan
            </span>
          )}
          {meal.glutenFree && (
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              Gluten-Free
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlanCard;