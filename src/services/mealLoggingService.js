import { userRecipeService } from './userRecipeService.js';

class MealLoggingService {
  constructor() {
    this.storageKey = 'dinefit_meal_logs';
    this.favoritesKey = 'dinefit_favorites';
    this.maxRecentMeals = 10;
    this.currentUser = null;
  }

  setCurrentUser(user) {
    this.currentUser = user;
  }

  getCurrentTimestamp() {
    return new Date().toISOString();
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  }

  async logMeal(recipe, mealType = 'Unknown') {
    if (this.currentUser) {
      try {
        return await userRecipeService.logMeal(this.currentUser.$id, recipe, mealType);
      } catch (error) {
        console.error('Database meal logging failed, falling back to localStorage:', error);
        return this.logMealToLocalStorage(recipe, mealType);
      }
    } else {
      return this.logMealToLocalStorage(recipe, mealType);
    }
  }

  logMealToLocalStorage(recipe, mealType = 'Unknown') {
    try {
      const mealLog = {
        id: Date.now() + Math.random(),
        recipeId: recipe.id,
        name: recipe.name || recipe.title,
        image: recipe.image,
        category: recipe.category,
        timestamp: this.getCurrentTimestamp(),
        type: mealType,
        ingredients: this.extractIngredientsText(recipe),
        servings: recipe.servings || 1,
        cookingTime: recipe.cookingTime || recipe.readyInMinutes || 'Unknown',
        source: recipe.source || 'spoonacular'
      };
      const existingLogs = this.getMealLogsFromLocalStorage();
      const updatedLogs = [mealLog, ...existingLogs];
      const trimmedLogs = updatedLogs.slice(0, this.maxRecentMeals);
      localStorage.setItem(this.storageKey, JSON.stringify(trimmedLogs));
      console.log(`🍽️ Meal logged: ${mealLog.name} at ${this.formatTime(mealLog.timestamp)}`);
      return mealLog;
    } catch (error) {
      console.error('Error logging meal:', error);
      return null;
    }
  }

  async getMealLogs() {
    if (this.currentUser) {
      try {
        return await userRecipeService.getMealLogs(this.currentUser.$id);
      } catch (error) {
        console.error('Database meal logs failed, falling back to localStorage:', error);
        return this.getMealLogsFromLocalStorage();
      }
    } else {
      return this.getMealLogsFromLocalStorage();
    }
  }

  async getAllMealLogs() {
    if (this.currentUser) {
      try {
        return await userRecipeService.getAllMealLogs(this.currentUser.$id);
      } catch (error) {
        console.error('Fetching all meal logs failed, falling back to localStorage:', error);
        return this.getMealLogsFromLocalStorage();
      }
    } else {
      return this.getMealLogsFromLocalStorage();
    }
  }

  getMealLogsFromLocalStorage() {
    try {
      const logs = localStorage.getItem(this.storageKey);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Error getting meal logs:', error);
      return [];
    }
  }

  async getRecentMeals(limit = 10) {
    const logs = await this.getMealLogs();
    return logs.slice(0, limit).map(log => ({
      ...log,
      time: this.formatTime(log.timestamp),
      date: this.formatDate(log.timestamp),
      displayTime: `${this.formatDate(log.timestamp)} at ${this.formatTime(log.timestamp)}`
    }));
  }

  async clearMealLogs() {
    if (this.currentUser) {
      try {
        await userRecipeService.clearMealLogs(this.currentUser.$id);
      } catch (error) {
        console.error('Database clear failed, clearing localStorage:', error);
        localStorage.removeItem(this.storageKey);
      }
    } else {
      localStorage.removeItem(this.storageKey);
    }
    console.log('🗑️ All meal logs cleared');
  }

  extractIngredientsText(recipe) {
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      return recipe.ingredients.slice(0, 3).map(ing => ing.name || ing.original || ing).join(', ');
    }
    return recipe.category || 'Various ingredients';
  }

  async addToFavorites(recipe) {
    if (this.currentUser) {
      try {
        return await userRecipeService.addToFavorites(this.currentUser.$id, recipe);
      } catch (error) {
        console.error('Database favorites failed, falling back to localStorage:', error);
        return this.addToFavoritesLocalStorage(recipe);
      }
    } else {
      return this.addToFavoritesLocalStorage(recipe);
    }
  }

  addToFavoritesLocalStorage(recipe) {
    try {
      const favorite = {
        id: recipe.id,
        name: recipe.name || recipe.title,
        image: recipe.image,
        category: recipe.category,
        cookingTime: recipe.cookingTime || recipe.readyInMinutes || 'Unknown',
        difficulty: recipe.difficulty || 'Medium',
        addedAt: this.getCurrentTimestamp(),
        source: recipe.source || 'spoonacular',
        recipeData: recipe
      };
      const favorites = this.getFavoritesFromLocalStorage();
      if (favorites.some(fav => fav.id === recipe.id)) {
        console.log(`⭐ Recipe already in favorites: ${recipe.name}`);
        return favorite;
      }
      const updatedFavorites = [favorite, ...favorites];
      localStorage.setItem(this.favoritesKey, JSON.stringify(updatedFavorites));
      console.log(`⭐ Added to favorites: ${recipe.name}`);
      return favorite;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return null;
    }
  }

  async removeFromFavorites(recipeId) {
    if (this.currentUser) {
      try {
        return await userRecipeService.removeFromFavorites(this.currentUser.$id, recipeId);
      } catch (error) {
        console.error('Database remove favorites failed, falling back to localStorage:', error);
        return this.removeFromFavoritesLocalStorage(recipeId);
      }
    } else {
      return this.removeFromFavoritesLocalStorage(recipeId);
    }
  }

  removeFromFavoritesLocalStorage(recipeId) {
    try {
      const favorites = this.getFavoritesFromLocalStorage();
      const updatedFavorites = favorites.filter(fav => fav.id !== recipeId);
      localStorage.setItem(this.favoritesKey, JSON.stringify(updatedFavorites));
      console.log(`💔 Removed from favorites: ${recipeId}`);
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  }

  async isFavorited(recipeId) {
    if (this.currentUser) {
      try {
        return await userRecipeService.isFavorited(this.currentUser.$id, recipeId);
      } catch (error) {
        console.error('Database favorites check failed, falling back to localStorage:', error);
        return this.isFavoritedLocalStorage(recipeId);
      }
    } else {
      return this.isFavoritedLocalStorage(recipeId);
    }
  }

  isFavoritedLocalStorage(recipeId) {
    const favorites = this.getFavoritesFromLocalStorage();
    return favorites.some(fav => fav.id === recipeId);
  }

  async getFavorites() {
    if (this.currentUser) {
      try {
        return await userRecipeService.getFavorites(this.currentUser.$id);
      } catch (error) {
        console.error('Database get favorites failed, falling back to localStorage:', error);
        return this.getFavoritesFromLocalStorage();
      }
    } else {
      return this.getFavoritesFromLocalStorage();
    }
  }

  getFavoritesFromLocalStorage() {
    try {
      const favorites = localStorage.getItem(this.favoritesKey);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  async toggleFavorite(recipe) {
    if (this.currentUser) {
      try {
        return await userRecipeService.toggleFavorite(this.currentUser.$id, recipe);
      } catch (error) {
        console.error('Database toggle favorite failed, falling back to localStorage:', error);
        return this.toggleFavoriteLocalStorage(recipe);
      }
    } else {
      return this.toggleFavoriteLocalStorage(recipe);
    }
  }

  toggleFavoriteLocalStorage(recipe) {
    const isCurrentlyFavorited = this.isFavoritedLocalStorage(recipe.id);
    if (isCurrentlyFavorited) {
      this.removeFromFavoritesLocalStorage(recipe.id);
      return false;
    } else {
      this.addToFavoritesLocalStorage(recipe);
      return true;
    }
  }

  async getStats() {
    if (this.currentUser) {
      try {
        return await userRecipeService.getStats(this.currentUser.$id);
      } catch (error) {
        console.error('Database stats failed, falling back to localStorage:', error);
        return this.getStatsFromLocalStorage();
      }
    } else {
      return this.getStatsFromLocalStorage();
    }
  }

  getStatsFromLocalStorage() {
    const logs = this.getMealLogsFromLocalStorage();
    const favorites = this.getFavoritesFromLocalStorage();
    const mealsByType = logs.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1;
      return acc;
    }, {});
    const today = new Date().toDateString();
    const todayMeals = logs.filter(log => 
      new Date(log.timestamp).toDateString() === today
    ).length;
    return {
      totalMealsLogged: logs.length,
      totalFavorites: favorites.length,
      todayMeals,
      mealsByType,
      lastMealTime: logs.length > 0 ? logs[0].timestamp : null
    };
  }

  suggestMealType() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return 'Breakfast';
    if (hour >= 11 && hour < 16) return 'Lunch';
    if (hour >= 16 && hour < 19) return 'Snack';
    if (hour >= 19 || hour < 6) return 'Dinner';
    return 'Snack';
  }

  // Migration helper
  async migrateUserData() {
    if (this.currentUser) {
      try {
        console.log('🔄 Starting migration from localStorage to database for user:', this.currentUser.email);
        const migrationResult = await userRecipeService.migrateLocalStorageToDatabase(this.currentUser.$id);
        console.log('✅ Migration completed:', migrationResult);
        return migrationResult;
      } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
      }
    }
  }

  async clearLocalStorageData() {
    try {
      await userRecipeService.clearLocalStorage();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

export const mealLoggingService = new MealLoggingService();
export default mealLoggingService;
