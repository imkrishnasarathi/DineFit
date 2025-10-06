import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mealLoggingService } from '../services/mealLoggingService';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    setError('');
    try {
      const favs = await mealLoggingService.getFavorites();
      if (import.meta.env.DEV) {
        console.log('📋 Loaded favorites:', favs);
      }
      
      // Transform favorites to recipe format if needed
      const transformedFavorites = favs.map(fav => ({
        id: fav.recipeId || fav.id,
        name: fav.name,
        image: fav.image,
        category: fav.category,
        cookingTime: fav.cookingTime,
        difficulty: fav.difficulty,
        source: fav.source,
        addedAt: fav.addedAt,
        ...fav.recipeData // Include full recipe data if available
      }));
      
      setFavorites(transformedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setError('Failed to load your favorite recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const handleRemoveFromFavorites = async (recipe) => {
    try {
      await mealLoggingService.removeFromFavorites(recipe.id);
      // Reload favorites to reflect changes
      await loadFavorites();
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Background */}
  <div className="absolute inset-0 bg-[hsl(var(--background))]"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-pink-200/20 to-rose-300/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-gradient-to-r from-red-200/15 to-pink-300/15 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Header */}
  <div className="text-center mb-8 backdrop-blur-sm bg-[hsl(var(--card))]/40 rounded-3xl p-6 sm:p-8 shadow-xl border border-[hsl(var(--border))]/20">
          <div className="flex items-center justify-between mb-4">
            <Link 
              to="/dashboard"
              className="p-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] transition-colors duration-200 backdrop-blur-sm bg-[hsl(var(--card))]/50 rounded-xl hover:bg-[hsl(var(--card))]/70"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              ❤️ My Favorites
            </h1>
            <div className="w-9"></div>
          </div>
          <p className="text-[hsl(var(--muted-foreground))]">Your saved recipes collection</p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[hsl(var(--muted))] border-t-[hsl(var(--primary))] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[hsl(var(--muted-foreground))]">Loading your favorites...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
      <div className="backdrop-blur-sm bg-[hsl(var(--destructive))]/20 border border-[hsl(var(--destructive))]/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">⚠️</div>
              <div>
        <h3 className="font-semibold text-[hsl(var(--destructive-foreground))]">Error Loading Favorites</h3>
        <p className="text-[hsl(var(--destructive-foreground))]">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Favorites grid */}
        {!loading && !error && (
          <>
            {favorites.length > 0 ? (
              <>
                <div className="backdrop-blur-sm bg-[hsl(var(--card))]/40 rounded-2xl p-4 mb-8 border border-[hsl(var(--border))]/30">
                  <h3 className="font-semibold text-[hsl(var(--card-foreground))] mb-2">📊 Your Collection</h3>
                  <div className="text-sm text-[hsl(var(--muted-foreground))]">
                    You have saved {favorites.length} recipe{favorites.length !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favorites.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onClick={handleRecipeClick}
                      onSave={handleRemoveFromFavorites}
                    />
                  ))}
                </div>
              </>
            ) : (
              /* Empty state */
                <div className="text-center py-12">
                <div className="text-6xl mb-4">💔</div>
                <h3 className="text-xl font-semibold text-[hsl(var(--card-foreground))] mb-2">No favorites yet</h3>
                <p className="text-[hsl(var(--muted-foreground))] mb-6">Start exploring recipes and save the ones you love!</p>
                <Link
                  to="/recipes"
                  className="inline-block px-6 py-3 bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] rounded-xl hover:brightness-95 transition-all duration-200 transform hover:scale-105"
                >
                  🔍 Discover Recipes
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleRemoveFromFavorites}
      />
    </div>
  );
};

export default Favorites;