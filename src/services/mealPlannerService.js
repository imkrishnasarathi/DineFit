import { advancedRecipeService } from './advancedRecipeService.js';
import BrowserCache from '../utils/BrowserCache.js';

class MealPlannerService {
  constructor() {
    this.cache = new BrowserCache({ 
      stdTTL: 3600,  // Cache for 1 hour
      checkperiod: 600 
    });
    this.mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    this.currentPlans = new Map(); // Store active meal plans
  }

  /**
   * Generate a complete meal plan for specified days
   * @param {Object} userProfile - User's dietary preferences and restrictions
   * @param {number} days - Number of days to plan for (1-7)
   * @param {Object} options - Additional options like calorie target, meal count
   * @returns {Object} Complete meal plan
   */
  async generateMealPlan(userProfile, days = 1, options = {}) {
    try {
      const planId = this.generatePlanId(userProfile, days, options);
      
      // Check cache first
      const cachedPlan = this.cache.get(planId);
      if (cachedPlan) {
        console.log('📋 Returning cached meal plan');
        return cachedPlan;
      }

      console.log(`🍽️ Generating ${days}-day meal plan...`);

      const mealPlan = {
        id: planId,
        createdAt: new Date().toISOString(),
        days: days,
        totalCalories: 0,
        userProfile: userProfile,
        options: options,
        meals: {}
      };

      // Generate meals for each day
      for (let day = 1; day <= days; day++) {
        const dayKey = `day${day}`;
        mealPlan.meals[dayKey] = await this.generateDayMeals(userProfile, options);
      }

      // Calculate total calories across all days
      mealPlan.totalCalories = this.calculateTotalCalories(mealPlan.meals);
      mealPlan.avgCaloriesPerDay = Math.round(mealPlan.totalCalories / days);

      // Cache the plan
      this.cache.set(planId, mealPlan, 3600);
      this.currentPlans.set(planId, mealPlan);

      console.log(`✅ Meal plan generated: ${days} days, ${mealPlan.avgCaloriesPerDay} avg calories/day`);
      return mealPlan;

    } catch (error) {
      console.error('Error generating meal plan:', error);
      return this.getDefaultMealPlan(userProfile, days);
    }
  }

  /**
   * Generate meals for a single day
   */
  async generateDayMeals(userProfile, options = {}) {
    const mealsPerDay = parseInt(userProfile?.mealsPerDay) || 3;
    const includesnacks = mealsPerDay > 3;
    
    const dayMeals = {
      breakfast: null,
      lunch: null,
      dinner: null
    };

    if (includesnacks) {
      dayMeals.snack = null;
    }

    // Get recipes for each meal type
    for (const mealType of Object.keys(dayMeals)) {
      try {
        console.log(`🔍 Getting recipes for ${mealType}...`);
        const mealRecipes = await this.getRecipesForMealType(mealType, userProfile);
        console.log(`📝 Found ${mealRecipes?.length || 0} recipes for ${mealType}`);
        
        if (mealRecipes && mealRecipes.length > 0) {
          // Select a random recipe from the suitable ones
          const selectedRecipe = mealRecipes[Math.floor(Math.random() * Math.min(mealRecipes.length, 3))];
          console.log(`✅ Selected ${selectedRecipe.name} for ${mealType}`);
          dayMeals[mealType] = {
            ...selectedRecipe,
            mealType: mealType,
            plannedFor: mealType,
            servings: this.calculateServings(selectedRecipe, mealType),
            estimatedCalories: this.estimateCalories(selectedRecipe, mealType)
          };
        } else {
          console.log(`⚠️ No recipes found for ${mealType}, using default`);
          dayMeals[mealType] = this.getDefaultMealForType(mealType);
        }
      } catch (error) {
        console.warn(`❌ Error getting ${mealType} recipe:`, error);
        dayMeals[mealType] = this.getDefaultMealForType(mealType);
      }
    }

    return dayMeals;
  }

  /**
   * Get recipes suitable for a specific meal type
   */
  async getRecipesForMealType(mealType, userProfile) {
    const cacheKey = `meal_${mealType}_${this.getUserProfileHash(userProfile)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    let searchQuery = '';
    let dietaryParams = {};

    // Define meal-specific search terms
    switch (mealType) {
      case 'breakfast':
        searchQuery = 'breakfast healthy morning meal';
        break;
      case 'lunch':
        searchQuery = 'lunch healthy midday meal';
        break;
      case 'dinner':
        searchQuery = 'dinner healthy evening meal';
        break;
      case 'snack':
        searchQuery = 'healthy snack light meal';
        break;
      default:
        searchQuery = 'healthy meal';
    }

    // Apply user dietary preferences
    if (userProfile?.dietaryPreferences) {
      const dietary = userProfile.dietaryPreferences.toLowerCase();
      if (dietary.includes('vegetarian')) {
        searchQuery += ' vegetarian';
        dietaryParams.diet = 'vegetarian';
      }
      if (dietary.includes('vegan')) {
        searchQuery += ' vegan';
        dietaryParams.diet = 'vegan';
      }
      if (dietary.includes('keto')) {
        searchQuery += ' keto low-carb';
        dietaryParams.diet = 'ketogenic';
      }
      if (dietary.includes('paleo')) {
        searchQuery += ' paleo';
        dietaryParams.diet = 'paleo';
      }
    }

    try {
      // Try to get recipes using the advanced recipe service
      console.log(`🔍 Searching recipes for ${mealType} with query: "${searchQuery}"`);
      const recipes = await advancedRecipeService.searchRecipes(searchQuery, userProfile);
      console.log(`📝 Got ${recipes?.length || 0} raw recipes for ${mealType}`);
      
      // Filter recipes suitable for meal type
      const suitableRecipes = this.filterRecipesByMealType(recipes, mealType);
      console.log(`✅ Filtered to ${suitableRecipes?.length || 0} suitable recipes for ${mealType}`);
      
      // If no suitable recipes found, try a broader search
      if (!suitableRecipes || suitableRecipes.length === 0) {
        console.log(`⚠️ No suitable recipes found for ${mealType}, trying broader search...`);
        const broaderRecipes = await advancedRecipeService.searchRecipes('healthy meal', userProfile);
        const broaderFiltered = this.filterRecipesByMealType(broaderRecipes, mealType);
        
        if (broaderFiltered && broaderFiltered.length > 0) {
          console.log(`✅ Found ${broaderFiltered.length} recipes with broader search for ${mealType}`);
          this.cache.set(cacheKey, broaderFiltered, 1800);
          return broaderFiltered;
        }
      }
      
      // Cache the results
      this.cache.set(cacheKey, suitableRecipes, 1800); // 30 min cache
      
      return suitableRecipes;
    } catch (error) {
      console.warn(`❌ Error searching recipes for ${mealType}:`, error);
      return this.getDefaultRecipesForMealType(mealType);
    }
  }

  /**
   * Filter recipes that are suitable for a specific meal type
   */
  filterRecipesByMealType(recipes, mealType) {
    if (!recipes || recipes.length === 0) {
      console.log(`⚠️ No recipes to filter for ${mealType}`);
      return [];
    }

    console.log(`🔍 Filtering ${recipes.length} recipes for ${mealType}`);
    
    const filtered = recipes.filter(recipe => {
      const title = recipe.name?.toLowerCase() || '';
      const category = recipe.category?.toLowerCase() || '';
      const readyTime = recipe.readyInMinutes || 30;

      switch (mealType) {
        case 'breakfast':
          return (
            title.includes('breakfast') ||
            title.includes('morning') ||
            title.includes('pancake') ||
            title.includes('omelette') ||
            title.includes('cereal') ||
            title.includes('toast') ||
            readyTime <= 30
          );
        case 'lunch':
          // More inclusive lunch filtering - lunch can be many things
          return (
            title.includes('lunch') ||
            title.includes('salad') ||
            title.includes('sandwich') ||
            title.includes('bowl') ||
            title.includes('wrap') ||
            title.includes('soup') ||
            title.includes('pasta') ||
            title.includes('rice') ||
            title.includes('chicken') ||
            title.includes('fish') ||
            title.includes('beef') ||
            title.includes('vegetable') ||
            category.includes('main') ||
            // If it's not breakfast, dinner, or dessert specific, it can be lunch
            (!title.includes('breakfast') && 
             !title.includes('morning') && 
             !title.includes('pancake') && 
             !title.includes('cereal') &&
             !title.includes('dinner') && 
             !title.includes('evening') &&
             !title.includes('dessert') &&
             !title.includes('cake') &&
             !title.includes('cookie') &&
             readyTime <= 60)
          );
        case 'dinner':
          return (
            title.includes('dinner') ||
            title.includes('main') ||
            category.includes('main') ||
            (!title.includes('snack') && !title.includes('dessert'))
          );
        case 'snack':
          return (
            title.includes('snack') ||
            title.includes('bite') ||
            readyTime <= 20 ||
            category.includes('snack') ||
            category.includes('appetizer')
          );
        default:
          return true;
      }
    });
    
    console.log(`✅ Filtered result: ${filtered.length} recipes suitable for ${mealType}`);
    if (filtered.length > 0) {
      console.log(`📋 Sample ${mealType} recipes:`, filtered.slice(0, 3).map(r => r.name));
    }
    
    return filtered;
  }

  /**
   * Replace a meal in an existing plan
   */
  async replaceMeal(planId, day, mealType, userProfile) {
    try {
      const plan = this.currentPlans.get(planId) || this.cache.get(planId);
      if (!plan) {
        throw new Error('Meal plan not found');
      }

      console.log(`🔄 Replacing ${mealType} for day ${day}...`);

      // Get alternative recipes for this meal type
      const mealRecipes = await this.getRecipesForMealType(mealType, userProfile);
      
      if (mealRecipes && mealRecipes.length > 0) {
        // Get current meal to avoid selecting the same one
        const currentMeal = plan.meals[`day${day}`]?.[mealType];
        let availableRecipes = mealRecipes;
        
        if (currentMeal) {
          availableRecipes = mealRecipes.filter(recipe => recipe.id !== currentMeal.id);
        }
        
        if (availableRecipes.length === 0) {
          availableRecipes = mealRecipes; // Fallback to all recipes
        }

        // Select a new random recipe
        const newRecipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
        
        // Update the plan
        plan.meals[`day${day}`][mealType] = {
          ...newRecipe,
          mealType: mealType,
          plannedFor: mealType,
          servings: this.calculateServings(newRecipe, mealType),
          estimatedCalories: this.estimateCalories(newRecipe, mealType)
        };

        // Recalculate total calories
        plan.totalCalories = this.calculateTotalCalories(plan.meals);
        plan.avgCaloriesPerDay = Math.round(plan.totalCalories / plan.days);

        // Update cache
        this.cache.set(planId, plan, 3600);
        this.currentPlans.set(planId, plan);

        console.log(`✅ Meal replaced successfully`);
        return plan;
      }
    } catch (error) {
      console.error('Error replacing meal:', error);
      throw error;
    }
  }

  /**
   * Save meal plan to user's account (if logged in)
   */   
  async saveMealPlan(planId, userProfile, userId = null) {
    try {
      const plan = this.currentPlans.get(planId) || this.cache.get(planId);
      if (!plan) {
        throw new Error('Meal plan not found');
      }

      const planToSave = {
        ...plan,
        savedAt: new Date().toISOString(),
        name: `Meal Plan - ${new Date().toLocaleDateString()}`
      };

      // Save to localStorage as backup
      const savedPlans = this.getSavedPlans();
      savedPlans[planId] = planToSave;
      localStorage.setItem('savedMealPlans', JSON.stringify(savedPlans));
      
      // TODO: Save to Appwrite database if userId is provided
      // This would require extending the userRecipeService to handle meal plans
      if (userId) {
        console.log('🔄 Database integration for meal plans coming soon...');
        // await userRecipeService.saveMealPlan(userId, planToSave);
      }
      
      console.log(`✅ Meal plan saved locally`);
      return true;
    } catch (error) {
      console.error('Error saving meal plan:', error);
      return false;
    }
  }

  /**
   * Get saved meal plans
   */
  getSavedPlans() {
    try {
      const saved = localStorage.getItem('savedMealPlans');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('Error loading saved plans:', error);
      return {};
    }
  }

  /**
   * Export meal plan to different formats
   */
  exportMealPlan(plan, format = 'json') {
    switch (format.toLowerCase()) {
      case 'json':
        return this.exportToJSON(plan);
      case 'text':
        return this.exportToText(plan);
      case 'pdf':
        return this.exportToPDF(plan);
      default:
        return this.exportToJSON(plan);
    }
  }

  exportToJSON(plan) {
    const exportData = {
      ...plan,
      exportedAt: new Date().toISOString(),
      format: 'json'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `meal-plan-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  exportToText(plan) {
    let textContent = `MEAL PLAN\n`;
    textContent += `Generated: ${new Date(plan.createdAt).toLocaleDateString()}\n`;
    textContent += `Days: ${plan.days}\n`;
    textContent += `Average Calories/Day: ${plan.avgCaloriesPerDay}\n\n`;

    for (let day = 1; day <= plan.days; day++) {
      const dayKey = `day${day}`;
      const dayMeals = plan.meals[dayKey];
      
      textContent += `DAY ${day}\n`;
      textContent += `${'='.repeat(20)}\n`;
      
      Object.entries(dayMeals).forEach(([mealType, meal]) => {
        if (meal) {
          textContent += `${mealType.toUpperCase()}: ${meal.name}\n`;
          textContent += `  Prep time: ${meal.cookingTime || 'N/A'}\n`;
          textContent += `  Servings: ${meal.servings || 1}\n`;
          textContent += `  Estimated calories: ${meal.estimatedCalories || 'N/A'}\n\n`;
        }
      });
      
      textContent += '\n';
    }

    const dataBlob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `meal-plan-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  // Helper methods
  generatePlanId(userProfile, days, options) {
    const hash = this.getUserProfileHash(userProfile);
    const timestamp = Date.now();
    return `plan_${hash}_${days}d_${timestamp}`;
  }

  getUserProfileHash(userProfile) {
    if (!userProfile) return 'default';
    const profileStr = JSON.stringify({
      dietary: userProfile.dietaryPreferences,
      allergies: userProfile.allergies,
      dislikes: userProfile.dislikedFoods,
      meals: userProfile.mealsPerDay
    });
    return btoa(profileStr).substring(0, 8);
  }

  calculateServings(recipe, mealType) {
    const baseServings = recipe.servings || 1;
    
    // Adjust servings based on meal type
    switch (mealType) {
      case 'snack':
        return Math.max(1, Math.floor(baseServings / 2));
      case 'breakfast':
      case 'lunch':
      case 'dinner':
      default:
        return baseServings;
    }
  }

  estimateCalories(recipe, mealType) {
    // Basic calorie estimation based on meal type and recipe info
    const baseCalories = {
      breakfast: 350,
      lunch: 500,
      dinner: 600,
      snack: 200
    };

    let calories = baseCalories[mealType] || 400;

    // Adjust based on recipe properties
    if (recipe.healthScore > 80) calories -= 50;
    if (recipe.vegetarian) calories -= 30;
    if (recipe.vegan) calories -= 50;
    if (recipe.readyInMinutes > 60) calories += 100;

    return Math.max(150, calories);
  }

  calculateTotalCalories(mealsObject) {
    let total = 0;
    Object.values(mealsObject).forEach(dayMeals => {
      Object.values(dayMeals).forEach(meal => {
        if (meal && meal.estimatedCalories) {
          total += meal.estimatedCalories;
        }
      });
    });
    return total;
  }

  getDefaultMealPlan(userProfile, days) {
    const plan = {
      id: `default_${Date.now()}`,
      createdAt: new Date().toISOString(),
      days: days,
      totalCalories: 0,
      userProfile: userProfile,
      meals: {}
    };

    for (let day = 1; day <= days; day++) {
      const dayKey = `day${day}`;
      plan.meals[dayKey] = {
        breakfast: this.getDefaultMealForType('breakfast'),
        lunch: this.getDefaultMealForType('lunch'),
        dinner: this.getDefaultMealForType('dinner')
      };

      if (parseInt(userProfile?.mealsPerDay) > 3) {
        plan.meals[dayKey].snack = this.getDefaultMealForType('snack');
      }
    }

    plan.totalCalories = this.calculateTotalCalories(plan.meals);
    plan.avgCaloriesPerDay = Math.round(plan.totalCalories / days);

    return plan;
  }

  getDefaultMealForType(mealType) {
    const defaults = {
      breakfast: {
        id: `default-breakfast-${Date.now()}`,
        name: 'Healthy Oatmeal Bowl',
        cookingTime: '10 min',
        difficulty: 'Easy',
        servings: 1,
        estimatedCalories: 320,
        mealType: mealType,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400'
      },
      lunch: {
        id: `default-lunch-${Date.now()}`,
        name: 'Mediterranean Salad',
        cookingTime: '15 min',
        difficulty: 'Easy',
        servings: 1,
        estimatedCalories: 450,
        mealType: mealType,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
      },
      dinner: {
        id: `default-dinner-${Date.now()}`,
        name: 'Grilled Protein with Vegetables',
        cookingTime: '30 min',
        difficulty: 'Medium',
        servings: 1,
        estimatedCalories: 580,
        mealType: mealType,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
      },
      snack: {
        id: `default-snack-${Date.now()}`,
        name: 'Healthy Mixed Nuts',
        cookingTime: '0 min',
        difficulty: 'Easy',
        servings: 1,
        estimatedCalories: 180,
        mealType: mealType,
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400'
      }
    };

    return defaults[mealType] || defaults.lunch;
  }

  getDefaultRecipesForMealType(mealType) {
    return [this.getDefaultMealForType(mealType)];
  }
}

export const mealPlannerService = new MealPlannerService();