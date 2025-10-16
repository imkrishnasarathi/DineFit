/**
 * Enhanced Meal Planner Service
 * 
 * Features:
 * - Multi-format export (JSON, TXT, PDF)
 * - Advanced caching with user-specific keys
 * - Intelligent recipe filtering
 * - Nutritional tracking
 * - Performance optimization
 */

import BrowserCache from '../utils/BrowserCache.js';
import { advancedRecipeService } from './advancedRecipeService.js';

class EnhancedMealPlannerService {
  constructor() {
    // Memory cache for active session data
    this.memoryCache = new BrowserCache({
      stdTTL: 3600, // 1 hour default TTL
      checkperiod: 600, // Check every 10 minutes
      maxKeys: 500
    });

    // Browser storage cache for persistent data
    this.persistentCachePrefix = 'dinefit_mealplan_';
    this.userCachePrefix = '';
    
    // Performance metrics
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      apiCalls: 0,
      exportCount: 0
    };

    this.initializeCache();
  }

  /**
   * Initialize cache with existing data from localStorage
   */
  initializeCache() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.persistentCachePrefix)) {
          const data = JSON.parse(localStorage.getItem(key));
          if (data.expiry && data.expiry > Date.now()) {
            const cacheKey = key.replace(this.persistentCachePrefix, '');
            this.memoryCache.set(cacheKey, data.value, Math.floor((data.expiry - Date.now()) / 1000));
          } else {
            localStorage.removeItem(key);
          }
        }
      });
      console.log('✅ Meal planner cache initialized');
    } catch (error) {
      console.warn('Cache initialization warning:', error);
    }
  }

  /**
   * Set user-specific cache prefix for personalized caching
   */
  setUser(userId) {
    this.userCachePrefix = userId ? `user_${userId}_` : '';
  }

  /**
   * Generate cache key based on user preferences and parameters
   */
  generateCacheKey(type, params) {
    const userKey = this.userCachePrefix;
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${JSON.stringify(params[key])}`)
      .join('|');
    return `${userKey}${type}_${btoa(sortedParams)}`;
  }

  /**
   * Get data from cache (memory first, then persistent storage)
   */
  async getFromCache(cacheKey) {
    // Try memory cache first
    const memoryResult = this.memoryCache.get(cacheKey);
    if (memoryResult) {
      this.metrics.cacheHits++;
      console.log('🚀 Cache HIT (memory):', cacheKey);
      return memoryResult;
    }

    // Try persistent storage
    try {
      const storageKey = this.persistentCachePrefix + cacheKey;
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const data = JSON.parse(stored);
        if (data.expiry && data.expiry > Date.now()) {
          // Restore to memory cache
          const ttl = Math.floor((data.expiry - Date.now()) / 1000);
          this.memoryCache.set(cacheKey, data.value, ttl);
          this.metrics.cacheHits++;
          console.log('🚀 Cache HIT (persistent):', cacheKey);
          return data.value;
        } else {
          // Expired, remove it
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.warn('Cache retrieval error:', error);
    }

    this.metrics.cacheMisses++;
    console.log('❌ Cache MISS:', cacheKey);
    return null;
  }

  /**
   * Set data in both memory and persistent cache
   */
  async setCache(cacheKey, data, ttl = 3600) {
    try {
      // Set in memory cache
      this.memoryCache.set(cacheKey, data, ttl);

      // Set in persistent storage
      const storageKey = this.persistentCachePrefix + cacheKey;
      const cacheData = {
        value: data,
        expiry: Date.now() + (ttl * 1000),
        created: Date.now()
      };
      localStorage.setItem(storageKey, JSON.stringify(cacheData));
      
      console.log('💾 Cached:', cacheKey, `(TTL: ${ttl}s)`);
    } catch (error) {
      console.warn('Cache set error:', error);
    }
  }

  /**
   * Generate meal plan with intelligent caching
   */
  async generateMealPlan(preferences) {
    const cacheKey = this.generateCacheKey('mealplan', preferences);
    const cached = await this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    this.metrics.apiCalls++;
    console.log('🔄 Generating fresh meal plan...');

    try {
      const mealPlan = {
        id: Date.now(),
        date: new Date().toISOString(),
        preferences,
        meals: {},
        metadata: {
          generatedAt: new Date().toISOString(),
          version: '2.0',
          source: 'enhanced-planner'
        }
      };

      // Generate meals for each type
      const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
      
      for (const mealType of mealTypes) {
        if (preferences.customDishes && preferences.customDishes[mealType]) {
          // Use custom dish
          mealPlan.meals[mealType] = {
            name: preferences.customDishes[mealType],
            type: mealType,
            custom: true
          };
        } else {
          // Get recipe from service
          const recipe = await this.getRecipeForMealType(mealType, preferences);
          mealPlan.meals[mealType] = recipe;
        }
      }

      // Calculate nutritional summary
      mealPlan.nutrition = await this.calculateNutrition(mealPlan.meals);

      // Cache the result
      await this.setCache(cacheKey, mealPlan, 1800); // 30 minutes

      return mealPlan;
    } catch (error) {
      console.error('Error generating meal plan:', error);
      throw error;
    }
  }

  /**
   * Get recipe for specific meal type with filtering
   */
  async getRecipeForMealType(mealType, preferences) {
    const cacheKey = this.generateCacheKey(`recipe_${mealType}`, preferences);
    const cached = await this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Get recipes based on user profile
      const recipes = await advancedRecipeService.getPersonalizedRecipes(preferences.userProfile);
      
      // Filter recipes by meal type
      const filteredRecipes = this.filterRecipesByMealType(recipes, mealType, preferences);
      
      // Select random recipe
      const selectedRecipe = filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];
      
      // Enhance recipe data
      const enhancedRecipe = {
        ...selectedRecipe,
        type: mealType,
        selected: true
      };

      // Cache for 2 hours
      await this.setCache(cacheKey, enhancedRecipe, 7200);
      
      return enhancedRecipe;
    } catch (error) {
      console.error(`Error getting recipe for ${mealType}:`, error);
      return {
        name: `Default ${mealType}`,
        type: mealType,
        error: true
      };
    }
  }

  /**
   * Filter recipes by meal type with intelligent matching
   */
  filterRecipesByMealType(recipes, mealType, preferences) {
    const mealTypeKeywords = {
      breakfast: ['breakfast', 'morning', 'brunch', 'oat', 'cereal', 'toast', 'egg', 'pancake', 'waffle'],
      lunch: ['lunch', 'sandwich', 'salad', 'soup', 'wrap', 'bowl'],
      dinner: ['dinner', 'main', 'entree', 'pasta', 'curry', 'steak', 'fish', 'chicken'],
      snacks: ['snack', 'appetizer', 'side', 'finger food', 'dip', 'chips']
    };

    const keywords = mealTypeKeywords[mealType] || [];
    
    const scored = recipes.map(recipe => {
      let score = 0;
      const name = recipe.name?.toLowerCase() || '';
      const category = recipe.category?.toLowerCase() || '';
      const tags = recipe.tags?.map(t => t.toLowerCase()).join(' ') || '';
      
      const searchText = `${name} ${category} ${tags}`;
      
      // Score based on keyword matches
      keywords.forEach(keyword => {
        if (searchText.includes(keyword)) {
          score += 10;
        }
      });
      
      // Bonus for exact meal type match
      if (category === mealType) {
        score += 50;
      }
      
      // Consider cooking time for breakfast (prefer quick)
      if (mealType === 'breakfast' && recipe.readyInMinutes && recipe.readyInMinutes < 20) {
        score += 5;
      }
      
      return { recipe, score };
    });
    
    // Sort by score and return top recipes
    const sorted = scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
    
    // If no matches found, return all recipes (fallback)
    return sorted.length > 0 
      ? sorted.map(item => item.recipe)
      : recipes;
  }

  /**
   * Calculate nutritional summary (placeholder - can be enhanced with real API)
   */
  async calculateNutrition(meals) {
    // This is a simplified version - can be enhanced with actual nutritional data
    return {
      totalCalories: 2000,
      protein: 80,
      carbs: 250,
      fat: 65,
      fiber: 30,
      estimatedValues: true
    };
  }

  /**
   * Export meal plan as JSON
   */
  exportAsJSON(mealPlan, includeMetadata = true) {
    try {
      this.metrics.exportCount++;
      
      const exportData = {
        mealPlan: {
          id: mealPlan.id,
          date: mealPlan.date,
          diet: mealPlan.preferences?.diet || mealPlan.diet,
          meals: mealPlan.meals || mealPlan.plan,
          images: mealPlan.images
        },
        metadata: includeMetadata ? {
          exportedAt: new Date().toISOString(),
          version: '2.0',
          source: 'DineFit Enhanced Meal Planner',
          generatedAt: mealPlan.metadata?.generatedAt || mealPlan.date
        } : undefined,
        nutrition: mealPlan.nutrition,
        userPreferences: includeMetadata ? mealPlan.preferences : undefined
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dinefit-mealplan-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('✅ Exported meal plan as JSON');
      return true;
    } catch (error) {
      console.error('Error exporting JSON:', error);
      return false;
    }
  }

  /**
   * Export meal plan as formatted text
   */
  exportAsText(mealPlan) {
    try {
      this.metrics.exportCount++;
      
      const meals = mealPlan.meals || mealPlan.plan || {};
      const diet = mealPlan.preferences?.diet || mealPlan.diet || 'Balanced';
      
      let content = `═══════════════════════════════════════════════════\n`;
      content += `           DINEFIT MEAL PLAN\n`;
      content += `═══════════════════════════════════════════════════\n\n`;
      content += `Generated: ${new Date(mealPlan.date).toLocaleString()}\n`;
      content += `Diet Type: ${diet}\n`;
      content += `Plan ID: ${mealPlan.id}\n\n`;
      
      if (mealPlan.nutrition && !mealPlan.nutrition.estimatedValues) {
        content += `───────────────────────────────────────────────────\n`;
        content += `NUTRITIONAL SUMMARY\n`;
        content += `───────────────────────────────────────────────────\n`;
        content += `Total Calories: ${mealPlan.nutrition.totalCalories} kcal\n`;
        content += `Protein: ${mealPlan.nutrition.protein}g\n`;
        content += `Carbohydrates: ${mealPlan.nutrition.carbs}g\n`;
        content += `Fat: ${mealPlan.nutrition.fat}g\n`;
        content += `Fiber: ${mealPlan.nutrition.fiber}g\n\n`;
      }

      content += `───────────────────────────────────────────────────\n`;
      content += `YOUR MEALS\n`;
      content += `───────────────────────────────────────────────────\n\n`;

      const mealEmojis = {
        breakfast: '🌅',
        lunch: '🌞',
        dinner: '🌙',
        snacks: '🍎'
      };

      Object.entries(meals).forEach(([mealType, meal]) => {
        const emoji = mealEmojis[mealType] || '🍽️';
        const mealName = typeof meal === 'string' ? meal : meal.name || 'Not specified';
        
        content += `${emoji} ${mealType.toUpperCase()}\n`;
        content += `   ${mealName}\n`;
        
        if (meal.readyInMinutes) {
          content += `   ⏱️  Ready in: ${meal.readyInMinutes} minutes\n`;
        }
        if (meal.category) {
          content += `   🏷️  Category: ${meal.category}\n`;
        }
        if (meal.servings) {
          content += `   👥 Servings: ${meal.servings}\n`;
        }
        content += `\n`;
      });

      content += `───────────────────────────────────────────────────\n`;
      content += `\nExported from DineFit - Your Personal Meal Planner\n`;
      content += `https://dinefit.app\n`;
      content += `═══════════════════════════════════════════════════\n`;

      const blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dinefit-mealplan-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('✅ Exported meal plan as Text');
      return true;
    } catch (error) {
      console.error('Error exporting text:', error);
      return false;
    }
  }

  /**
   * Export meal plan as PDF (requires jsPDF)
   */
  async exportAsPDF(mealPlan) {
    try {
      this.metrics.exportCount++;
      
      // Try to dynamically import jsPDF
      let jsPDF;
      try {
        const jsPDFModule = await import('jspdf');
        jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
      } catch (error) {
        console.warn('PDF export requires jsPDF library. Install with: npm install jspdf');
        console.warn('Falling back to text export.');
        return this.exportAsText(mealPlan);
      }
      
      // Create PDF with jsPDF
      const doc = new jsPDF();
      const meals = mealPlan.meals || mealPlan.plan || {};
      const diet = mealPlan.preferences?.diet || mealPlan.diet || 'Balanced';
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(34, 197, 94); // Green color
      doc.text('DineFit Meal Plan', 105, 20, { align: 'center' });
      
      // Metadata
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date(mealPlan.date).toLocaleString()}`, 20, 35);
      doc.text(`Diet Type: ${diet}`, 20, 42);
      
      // Meals
      let yPosition = 55;
      doc.setFontSize(12);
      doc.setTextColor(0);
      
      Object.entries(meals).forEach(([mealType, meal]) => {
        const mealName = typeof meal === 'string' ? meal : meal.name || 'Not specified';
        
        doc.setFont(undefined, 'bold');
        doc.text(mealType.toUpperCase(), 20, yPosition);
        doc.setFont(undefined, 'normal');
        doc.text(mealName, 20, yPosition + 7);
        
        yPosition += 20;
        
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      });
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('Exported from DineFit', 105, 285, { align: 'center' });
      
      doc.save(`dinefit-mealplan-${new Date().toISOString().split('T')[0]}.pdf`);
      console.log('✅ Exported meal plan as PDF');
      return true;
    } catch (error) {
      console.error('Error exporting PDF:', error);
      return false;
    }
  }

  /**
   * Export with format selection
   */
  async export(mealPlan, format = 'json', options = {}) {
    switch (format.toLowerCase()) {
      case 'json':
        return this.exportAsJSON(mealPlan, options.includeMetadata);
      case 'text':
      case 'txt':
        return this.exportAsText(mealPlan);
      case 'pdf':
        return await this.exportAsPDF(mealPlan);
      default:
        console.error('Unsupported export format:', format);
        return false;
    }
  }

  /**
   * Save meal plan to local storage with caching
   */
  saveMealPlan(mealPlan) {
    try {
      const plans = this.getSavedPlans();
      const newPlan = {
        ...mealPlan,
        id: mealPlan.id || Date.now(),
        savedAt: new Date().toISOString()
      };
      
      plans.push(newPlan);
      localStorage.setItem('savedMealPlans', JSON.stringify(plans));
      
      // Invalidate the cache so it reads fresh data next time
      this.memoryCache.del('all_saved_plans');
      
      // Cache the individual plan
      const cacheKey = `saved_plan_${newPlan.id}`;
      this.setCache(cacheKey, newPlan, 86400); // Cache for 24 hours
      
      console.log('✅ Meal plan saved');
      return newPlan;
    } catch (error) {
      console.error('Error saving meal plan:', error);
      throw error;
    }
  }

  /**
   * Get all saved meal plans with caching
   */
  getSavedPlans() {
    const cacheKey = 'all_saved_plans';
    const cached = this.memoryCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    try {
      const plans = JSON.parse(localStorage.getItem('savedMealPlans') || '[]');
      this.memoryCache.set(cacheKey, plans, 300); // Cache for 5 minutes
      return plans;
    } catch (error) {
      console.error('Error getting saved plans:', error);
      return [];
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    const cacheStats = this.memoryCache.getStats();
    return {
      cache: {
        hits: this.metrics.cacheHits,
        misses: this.metrics.cacheMisses,
        hitRate: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) || 0,
        ...cacheStats
      },
      api: {
        calls: this.metrics.apiCalls,
        reduction: this.metrics.cacheHits > 0 
          ? Math.round((this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.apiCalls)) * 100)
          : 0
      },
      exports: {
        total: this.metrics.exportCount
      }
    };
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this.memoryCache.flushAll();
    
    // Clear persistent cache
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.persistentCachePrefix)) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('🗑️ All caches cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const memoryStats = this.memoryCache.getStats();
    const persistentKeys = Object.keys(localStorage).filter(key => 
      key.startsWith(this.persistentCachePrefix)
    ).length;
    
    return {
      memory: {
        keys: memoryStats.keys,
        hitRate: memoryStats.hitRatio,
        size: `${Math.round(memoryStats.vsize / 1024)}KB`
      },
      persistent: {
        keys: persistentKeys
      },
      performance: this.getMetrics()
    };
  }
}

// Export singleton instance
export const enhancedMealPlannerService = new EnhancedMealPlannerService();
export default enhancedMealPlannerService;
