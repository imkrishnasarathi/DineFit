import { databases } from '../appwriteClient';
import { Query, Permission, Role } from 'appwrite';

class UserRecipeService {
  constructor() {
    this.databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'dinefit_db';
    this.mealLogsCollectionId = 'meal_logs';
    this.favoritesCollectionId = 'user_favourites';
  }

  async logMeal(userId, recipe, mealType = 'Unknown') {
    try {
      const mealLog = {
        userId,
        recipeId: recipe.id.toString(),
        name: recipe.name || recipe.title,
        image: recipe.image,
        category: recipe.category,
        type: mealType,
        ingredients: this.extractIngredientsText(recipe),
        servings: recipe.servings || 1,
        cookingTime: recipe.cookingTime || recipe.readyInMinutes || 'Unknown',
        source: recipe.source || 'spoonacular',
        timestamp: new Date().toISOString()
      };

      const response = await databases.createDocument(
        this.databaseId,
        this.mealLogsCollectionId,
        'unique()',
        mealLog
      );

      console.log(`🍽️ Meal logged to database: ${mealLog.name}`);
      return response;
    } catch (error) {
      console.error('Error logging meal to database:', error);
      throw error;
    }
  }

  async getMealLogs(userId, limit = 10) {
    try {
      const response = await databases.listDocuments(
        this.databaseId,
        this.mealLogsCollectionId,
        [
          Query.equal('userId', userId),
          Query.orderDesc('timestamp'),
          Query.limit(limit)
        ]
      );

      return response.documents.map(log => ({
        id: log.$id,
        ...log,
        time: this.formatTime(log.timestamp),
        date: this.formatDate(log.timestamp),
        displayTime: `${this.formatDate(log.timestamp)} at ${this.formatTime(log.timestamp)}`
      }));
    } catch (error) {
      console.error('Error getting meal logs from database:', error);
      return [];
    }
  }

  async getAllMealLogs(userId) {
    try {
      const response = await databases.listDocuments(
        this.databaseId,
        this.mealLogsCollectionId,
        [
          Query.equal('userId', userId),
        ]
      );

      return response.documents.map(meal => ({
        id: meal.recipeId,
        ...meal,
        recipeData: meal.recipeData ? JSON.parse(meal.recipeData) : null
      }));
    } catch (error) {
      console.error('Error getting recipes from database:', error);
      return [];
    }
  }

  async addToFavorites(userId, recipe) {
    try {
      // Check if already exists
      const existing = await databases.listDocuments(
        this.databaseId,
        this.favoritesCollectionId,
        [
          Query.equal('userId', userId),
          Query.equal('recipeId', recipe.id.toString())
        ]
      );

      if (existing.documents.length > 0) {
        console.log(`⭐ Recipe already in favorites: ${recipe.name}`);
        return existing.documents[0];
      }

      const favorite = {
        userId,
        recipeId: recipe.id.toString(),
        name: recipe.name || recipe.title,
        image: recipe.image,
        category: recipe.category,
        cookingTime: recipe.cookingTime || recipe.readyInMinutes || 'Unknown',
        difficulty: recipe.difficulty || 'Medium',
        source: recipe.source || 'spoonacular',
        recipeData: JSON.stringify(recipe),
        addedAt: new Date().toISOString()
      };

      const response = await databases.createDocument(
        this.databaseId,
        this.favoritesCollectionId,
        'unique()',
        favorite
      );

      console.log(`⭐ Added to favorites in database: ${recipe.name}`);
      return response;
    } catch (error) {
      console.error('Error adding to favorites in database:', error);
      throw error;
    }
  }

  async removeFromFavorites(userId, recipeId) {
    try {
      const existing = await databases.listDocuments(
        this.databaseId,
        this.favoritesCollectionId,
        [
          Query.equal('userId', userId),
          Query.equal('recipeId', recipeId.toString())
        ]
      );

      if (existing.documents.length > 0) {
        await databases.deleteDocument(
          this.databaseId,
          this.favoritesCollectionId,
          existing.documents[0].$id
        );
        console.log(`💔 Removed from favorites in database: ${recipeId}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error removing from favorites in database:', error);
      throw error;
    }
  }

  async isFavorited(userId, recipeId) {
    try {
      const response = await databases.listDocuments(
        this.databaseId,
        this.favoritesCollectionId,
        [
          Query.equal('userId', userId),
          Query.equal('recipeId', recipeId.toString()),
          Query.limit(1)
        ]
      );

      return response.documents.length > 0;
    } catch (error) {
      console.error('Error checking if favorited:', error);
      return false;
    }
  }

  async getFavorites(userId) {
    try {
      const response = await databases.listDocuments(
        this.databaseId,
        this.favoritesCollectionId,
        [
          Query.equal('userId', userId),
          Query.orderDesc('addedAt')
        ]
      );

      return response.documents.map(fav => ({
        id: fav.$id,
        ...fav,
        recipeData: fav.recipeData ? JSON.parse(fav.recipeData) : null
      }));
    } catch (error) {
      console.error('Error getting favorites from database:', error);
      return [];
    }
  }

  async toggleFavorite(userId, recipe) {
    try {
      const isCurrentlyFavorited = await this.isFavorited(userId, recipe.id);
      
      if (isCurrentlyFavorited) {
        await this.removeFromFavorites(userId, recipe.id);
        return false;
      } else {
        await this.addToFavorites(userId, recipe);
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  async getStats(userId) {
    try {
      const [mealLogs, favorites] = await Promise.all([
        this.getMealLogs(userId, 100), // Get more for stats
        this.getFavorites(userId)
      ]);

      const mealsByType = mealLogs.reduce((acc, log) => {
        acc[log.type] = (acc[log.type] || 0) + 1;
        return acc;
      }, {});

      const today = new Date().toDateString();
      const todayMeals = mealLogs.filter(log => 
        new Date(log.timestamp).toDateString() === today
      ).length;

      return {
        totalMealsLogged: mealLogs.length,
        totalFavorites: favorites.length,
        todayMeals,
        mealsByType,
        lastMealTime: mealLogs.length > 0 ? mealLogs[0].timestamp : null
      };
    } catch (error) {
      console.error('Error getting stats from database:', error);
      return {
        totalMealsLogged: 0,
        totalFavorites: 0,
        todayMeals: 0,
        mealsByType: {},
        lastMealTime: null
      };
    }
  }

  async clearMealLogs(userId) {
    try {
      const response = await databases.listDocuments(
        this.databaseId,
        this.mealLogsCollectionId,
        [Query.equal('userId', userId)]
      );

      const deletePromises = response.documents.map(doc => 
        databases.deleteDocument(this.databaseId, this.mealLogsCollectionId, doc.$id)
      );

      await Promise.all(deletePromises);
      console.log('🗑️ All meal logs cleared from database');
    } catch (error) {
      console.error('Error clearing meal logs from database:', error);
      throw error;
    }
  }

  // Helper methods
  extractIngredientsText(recipe) {
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      return recipe.ingredients.slice(0, 3).map(ing => ing.name || ing.original || ing).join(', ');
    }
    return recipe.category || 'Various ingredients';
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

  suggestMealType() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return 'Breakfast';
    if (hour >= 11 && hour < 16) return 'Lunch';
    if (hour >= 16 && hour < 19) return 'Snack';
    if (hour >= 19 || hour < 6) return 'Dinner';
    return 'Snack';
  }

  // Migration methods to transfer localStorage data to database
  async migrateLocalStorageToDatabase(userId) {
    try {
      console.log('🔄 Starting migration from localStorage to database...');
      
      // Migrate meal logs
      const localMealLogs = JSON.parse(localStorage.getItem('dinefit_meal_logs') || '[]');
      if (localMealLogs.length > 0) {
        console.log(`📝 Migrating ${localMealLogs.length} meal logs...`);
        for (const log of localMealLogs) {
          try {
            const mealLog = {
              userId,
              recipeId: log.recipeId.toString(),
              name: log.name,
              image: log.image,
              category: log.category,
              type: log.type,
              ingredients: log.ingredients,
              servings: log.servings || 1,
              cookingTime: log.cookingTime,
              source: log.source || 'spoonacular',
              timestamp: log.timestamp
            };

            await databases.createDocument(
              this.databaseId,
              this.mealLogsCollectionId,
              'unique()',
              mealLog
            );
          } catch (error) {
            console.warn('Failed to migrate meal log:', log.name, error);
          }
        }
      }

      // Migrate favorites
      const localFavorites = JSON.parse(localStorage.getItem('dinefit_favorites') || '[]');
      if (localFavorites.length > 0) {
        console.log(`⭐ Migrating ${localFavorites.length} favorites...`);
        for (const fav of localFavorites) {
          try {
            const favorite = {
              userId,
              recipeId: fav.id.toString(),
              name: fav.name,
              image: fav.image,
              category: fav.category,
              cookingTime: fav.cookingTime,
              difficulty: fav.difficulty,
              source: fav.source || 'spoonacular',
              recipeData: JSON.stringify(fav.recipeData || fav),
              addedAt: fav.addedAt || new Date().toISOString()
            };

            await databases.createDocument(
              this.databaseId,
              this.favoritesCollectionId,
              'unique()',
              favorite
            );
          } catch (error) {
            console.warn('Failed to migrate favorite:', fav.name, error);
          }
        }
      }

      console.log('✅ Migration completed successfully');
      console.log('🗑️ You can now clear localStorage data');
      
      return {
        migratedMealLogs: localMealLogs.length,
        migratedFavorites: localFavorites.length
      };
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  async clearLocalStorage() {
    try {
      localStorage.removeItem('dinefit_meal_logs');
      localStorage.removeItem('dinefit_favorites');
      console.log('🗑️ LocalStorage data cleared');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

export const userRecipeService = new UserRecipeService();
export default userRecipeService;
