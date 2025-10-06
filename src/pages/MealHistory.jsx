import React, { useEffect, useState } from 'react'
import mealLoggingService from '../services/mealLoggingService';
import RecipeModal from '../components/RecipeModal';
import { Link } from 'react-router-dom';

export default function MealHistory() {
  const [allMeals, setAllMeals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);


  const loadMealData = async() => {
    const meals = await mealLoggingService.getAllMealLogs();
    setAllMeals(meals)
  }

  const handleModal = (meal) => {
    console.log(meal)
    setShowModal(true)
    setSelectedRecipe(meal)
  }

  useEffect(() => {
    loadMealData()
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-emerald-200/20 to-teal-300/20 dark:from-emerald-800/15 dark:to-teal-800/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-200/15 to-blue-300/15 dark:from-cyan-800/10 dark:to-blue-800/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute -bottom-32 left-1/4 w-72 h-72 bg-gradient-to-r from-teal-200/20 to-emerald-300/20 dark:from-teal-800/15 dark:to-emerald-800/15 rounded-full blur-3xl animate-float-slow"></div>
        
        <div className="absolute top-20 right-20 w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 dark:from-emerald-600 dark:to-teal-600 transform rotate-45 animate-spin-slow opacity-10 dark:opacity-20"></div>
        <div className="absolute bottom-32 left-16 w-6 h-16 bg-gradient-to-b from-cyan-400 to-blue-500 dark:from-cyan-600 dark:to-blue-600 transform -skew-y-12 animate-sway opacity-15 dark:opacity-25"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8 backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 dark:border-gray-700/20">
          <div className='flex flex-row items-center justify-center'>
            <span className="text-2xl sm:text-3xl lg:text-4xl mr-2">🍴</span>
            <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent'>All your tasty meals</h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
            Browse through your complete meal history and rediscover your favorite recipes
          </p>
        </div>

        {/* Meals grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {allMeals.length === 0 ? (
            <div className="col-span-full text-center py-12 backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No meals yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Start logging your meals to see them here!</p>
              <Link
                to="/recipes"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Discover Recipes
              </Link>
            </div>
          ) : (
            allMeals.map((meal) => (
              <div key={meal.id} className="group backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/30 dark:border-gray-700/30 hover:border-emerald-200/50 dark:hover:border-emerald-700/50 cursor-pointer transform hover:-translate-y-1" onClick={() => handleModal(meal)}>
                  <div className="flex items-center">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0 overflow-hidden">
                          <img
                              src={meal.image}
                              alt={meal.name}
                              className="w-full h-full object-cover rounded-full"
                          />
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-lg">{meal.name}</h3>
                              <span className="font-medium text-emerald-600 dark:text-emerald-400 text-sm ml-2 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">{meal.type}</span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                              <span className="mr-1">⏱️</span>
                              {meal.cookingTime}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{meal.ingredients}</p>
                      </div>
                  </div>
              </div>
            ))
          )}
        </div>

        {/* Back button */}
        <div className="text-center mt-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="mr-2">←</span>
            Back to Dashboard
          </Link>
        </div>
      </div>

      <RecipeModal
          recipe={selectedRecipe}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={() => {}}
      />
    </div>
  )
}
