import React, { useState, useEffect } from 'react';
import { advancedRecipeService } from '../services/advancedRecipeService';
import { mealLoggingService } from '../services/mealLoggingService';
const RecipeModal = ({ recipe, isOpen, onClose, onSave }) => {
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [isFavorited, setIsFavorited] = useState(false);
  const [isCooked, setIsCooked] = useState(false);
  useEffect(() => {
    if (isOpen && recipe) {
      fetchRecipeDetails();
      setIsFavorited(mealLoggingService.isFavorited(recipe.id));
      setIsCooked(false); // Reset cooked status when modal opens
    }
  }, [isOpen, recipe]);
  const fetchRecipeDetails = async () => {
    setIsLoading(true);
    try {
      const details = await advancedRecipeService.getRecipeDetails(recipe.id);
      setRecipeDetails(details);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleFavoriteToggle = () => {
    const newFavoriteStatus = mealLoggingService.toggleFavorite(recipe);
    setIsFavorited(newFavoriteStatus);
  };
  const handleCookRecipe = () => {
    const mealType = mealLoggingService.suggestMealType();
    const loggedMeal = mealLoggingService.logMeal(recipe, mealType);
    if (loggedMeal) {
      setIsCooked(true);
      setTimeout(() => setIsCooked(false), 3000);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        
        <div className="relative">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="absolute top-4 left-4 flex space-x-2">
            
            <button
              onClick={handleFavoriteToggle}
              className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center space-x-2 ${
                isFavorited 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white'
              }`}
            >
              <svg className="w-4 h-4" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>
            </button>
            
            <button
              onClick={handleCookRecipe}
              disabled={isCooked}
              className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center space-x-2 ${
                isCooked
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isCooked ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                )}
              </svg>
              <span>{isCooked ? 'Cooked!' : 'Cook This'}</span>
            </button>
          </div>
          
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
          
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{recipe.name}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              {recipeDetails?.prepTime && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Prep: {recipeDetails.prepTime}
                </span>
              )}
              {recipe.cookingTime && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Total: {recipe.cookingTime}
                </span>
              )}
              {recipeDetails?.servings && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  {recipeDetails.servings}
                </span>
              )}
              {recipe.category && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                  {recipe.category}
                </span>
              )}
              {recipe.area && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {recipe.area}
                </span>
              )}
            </div>
            
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading recipe details...</p>
              </div>
            </div>
          )}
          
          {recipeDetails && (
            <>
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`px-4 py-2 font-medium transition-colors duration-200 ${
                    activeTab === 'ingredients'
                      ? 'text-emerald-600 border-b-2 border-emerald-600'
                      : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  Ingredients
                </button>
                <button
                  onClick={() => setActiveTab('instructions')}
                  className={`px-4 py-2 font-medium transition-colors duration-200 ${
                    activeTab === 'instructions'
                      ? 'text-emerald-600 border-b-2 border-emerald-600'
                      : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  Instructions
                </button>
              </div>
              
              {activeTab === 'ingredients' && (
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {recipeDetails.ingredients?.length > 0 ? (
                      recipeDetails.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-xl">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                          <span className="text-gray-800">
                            {ingredient.original || `${ingredient.amount || ''} ${ingredient.unit || ''} ${ingredient.name || ''}`.trim()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center text-gray-500 py-8">
                        No ingredients available for this recipe.
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === 'instructions' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h3>
                  <div className="space-y-4">
                    {Array.isArray(recipeDetails.instructions) && recipeDetails.instructions.length > 0 ? (
                      recipeDetails.instructions.map((instruction, index) => (
                        <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                          <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                            {instruction.number || index + 1}
                          </div>
                          <div className="text-gray-800 leading-relaxed">
                            {instruction.step || instruction}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="text-gray-800 leading-relaxed">
                          {typeof recipeDetails.instructions === 'string' 
                            ? recipeDetails.instructions 
                            : 'Instructions not available for this recipe.'
                          }
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {recipe.videoUrl && (
                    <div className="mt-6">
                      <a
                        href={recipe.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                        </svg>
                        Watch Video Tutorial
                      </a>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default RecipeModal;
