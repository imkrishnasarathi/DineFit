import React, { useState, useEffect } from 'react';
import { mealLoggingService } from '../services/mealLoggingService';

const RecipeCard = ({ recipe, onClick, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    setIsFavorited(mealLoggingService.isFavorited(recipe.id));
  }, [recipe.id]);

  const handleSave = async (e) => {
    e.stopPropagation(); // Prevent card click
    setIsLoading(true);
    try {
      const newFavoriteStatus = mealLoggingService.toggleFavorite(recipe);
      setIsFavorited(newFavoriteStatus);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000); // Reset after 2 seconds
      await onSave?.(recipe);
    } catch (error) {
      console.error('Error saving recipe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="backdrop-blur-sm bg-white/40 rounded-2xl shadow-lg border border-white/30 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col h-full"
      onClick={() => onClick?.(recipe)}
    >
      
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        
        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
            isFavorited 
              ? 'bg-red-500 text-white' 
              : isSaved 
              ? 'bg-green-500 text-white' 
              : 'bg-white/70 text-gray-600 hover:bg-white/90 hover:text-red-500'
          }`}
          title={isFavorited ? 'Remove from favorites' : isSaved ? 'Added to favorites!' : 'Add to favorites'}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          ) : isSaved ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>
        
        {recipe.category && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
            {recipe.category}
          </div>
        )}
        
        {recipe.difficulty && (
          <div className={`absolute bottom-3 left-3 px-2 py-1 text-xs font-medium rounded-full ${
            recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
            recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {recipe.difficulty}
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-200">
          {recipe.name}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {recipe.cookingTime}
          </span>
          {recipe.area && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {recipe.area}
            </span>
          )}
        </div>
        
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{recipe.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <button className="w-full mt-auto px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg">
          View Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;