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
    <>
      <div className='flex flex-row items-center justify-center mt-5'>
        <span className="text-2xl sm:text-3xl lg:text-4xl mr-2">🍴</span>
        <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-center text-transparent'>All your tasty meals</h2>
      </div>
      <div className="grid grid-cols-1 m-10 lg:grid-cols-2 gap-4">

          {allMeals.map((meal) => (
              <div key={meal.id} className="flex items-center p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200 border border-gray-100 cursor-pointer" onClick={() => handleModal(meal)}>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <img
                          src={meal.image}
                          alt={meal.name}
                          className="w-full h-full object-cover rounded-full"
                      />
                  </div>
                  <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{meal.name}</h3>
                          <span className="font-medium text-emerald-600 text-sm ml-2">{meal.type}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{meal.cookingTime}</p>
                      <p className="text-xs text-gray-400 truncate">{meal.ingredients}</p>
                  </div>
              </div>
          ))}
          <RecipeModal
              recipe={selectedRecipe}
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onSave={() => {}}
          />
      </div>
    </>
  )
}
