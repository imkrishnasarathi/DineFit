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
      setIsCooked(false);
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

  // 🆕 NEW: Export ingredients list as .txt file
  const handleExportIngredients = () => {
    if (!recipeDetails?.ingredients || recipeDetails.ingredients.length === 0) {
      alert("No ingredients available for this recipe!");
      return;
    }

    const fileContent = [
      `🧾 Shopping List for "${recipe.name}"`,
      "",
      ...recipeDetails.ingredients.map((ing) =>
        ing.original ||
        `${ing.amount || ''} ${ing.unit || ''} ${ing.name || ''}`.trim()
      ),
    ].join("\n");

    const blob = new Blob([fileContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${recipe.name.replace(/\s+/g, "_")}_shopping_list.txt`;
    link.click();
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

          {/* 🆕 Added Export Button */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            
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

            {/* 🆕 New Export List Button */}
            <button
              onClick={handleExportIngredients}
              className="px-4 py-2 rounded-full transition-all duration-200 flex items-center space-x-2 bg-emerald-500 text-white hover:bg-emerald-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v6m0-6V4m0 8l-3 3m3-3l3 3" />
              </svg>
              <span>Export List</span>
            </button>
          </div>
        </div>

        {/* Rest of your modal UI (ingredients, instructions, etc.) remains unchanged */}
        {/* ⬇️ */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
          {/* existing recipeDetails rendering remains as is */}
          ...
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
