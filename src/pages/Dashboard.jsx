import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'
import ProfileSetup from '../components/ProfileSetup'
import { mealLoggingService } from '../services/mealLoggingService'

const Dashboard = () => {
  const { user, userProfile, hasProfile, isGuest } = useAuth();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [firstTimeProfile, setfirstTimeProfile] = useState(false);
  const [recentMeals, setRecentMeals] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [mealStats, setMealStats] = useState();

  useEffect(() => {
    loadMealData();
    const skippedProfile = localStorage.getItem('skippedProfileSetup');
    if (hasProfile) {
      setfirstTimeProfile(false); 
    } else if (skippedProfile === 'true') {
      setfirstTimeProfile(true); 
    }

  }, []);

  const loadMealData = async () => {
    const meals = await mealLoggingService.getRecentMeals(10);
    const favs = await mealLoggingService.getFavorites();
    const stats = await mealLoggingService.getStats();
    setRecentMeals(meals);
    setFavorites(favs);
    setMealStats(stats);
  };

  const handleClearMeals = async () => {
    if (window.confirm('Are you sure you want to clear all meal logs?')) {
      await mealLoggingService.clearMealLogs();
      await loadMealData();
    }
  };
  const userPreferences = {
    allergies: userProfile?.allergies || 'None specified',
    dietaryPreferences: userProfile?.dietaryPreferences || 'None specified',
    favoriteCuisines: userProfile?.favoriteCuisines || 'Not set',
    cookingTime: userProfile?.cookingTime || 'Not set',
    mealsPerDay: userProfile?.mealsPerDay || '3'
  };
  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(var(--background))]"></div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-emerald-200/20 to-teal-300/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-200/15 to-blue-300/15 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute -bottom-32 left-1/4 w-72 h-72 bg-gradient-to-r from-teal-200/20 to-emerald-300/20 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero */}
        <div className="text-center mb-8 backdrop-blur-sm bg-[hsl(var(--card)/0.6)] rounded-3xl p-6 sm:p-8 shadow-xl border border-[hsl(var(--border))]">
          <div className="flex justify-between items-start mb-4">
            <div />
            <Link
              to="/settings"
              className="p-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors duration-200 backdrop-blur-sm bg-[hsl(var(--card))]/50 rounded-xl hover:bg-[hsl(var(--card))]/70"
              title="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[hsl(var(--card-foreground))] mb-3">
            Welcome back, {user?.name || 'User'}! <span className="text-[hsl(var(--primary))]">🍽️</span>
          </h1>

          {isGuest && (
            <div className="mb-4 inline-flex items-center px-3 py-1 bg-[hsl(var(--card))]/80 backdrop-blur-sm border border-[hsl(var(--border))]/50 text-[hsl(var(--muted-foreground))] rounded-full text-sm font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Guest Mode
            </div>
          )}

          <p className="text-xl sm:text-2xl text-[hsl(var(--muted-foreground))] mb-4">Discover recipes tailored to your taste</p>

          <div className="flex justify-center items-center space-x-6 text-sm text-[hsl(var(--muted-foreground))] backdrop-blur-sm bg-[hsl(var(--card))]/50 rounded-2xl p-4 inline-flex">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-[hsl(var(--primary))] rounded-full mr-2"></span>
              Meals/Day: {userPreferences.mealsPerDay}
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-2"></span>
              Cooking Time: {userPreferences.cookingTime}
            </span>
            {userPreferences.allergies && userPreferences.allergies !== 'None specified' && (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-[hsl(var(--muted))] rounded-full mr-2"></span>
                Allergies: {userPreferences.allergies}
              </span>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <div className="backdrop-blur-sm bg-[hsl(var(--card))]/50 p-6 sm:p-8 rounded-3xl shadow-xl border border-[hsl(var(--border))] hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Favorite Cuisines</h3>
              <span className="text-3xl">🌮</span>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-[hsl(var(--card-foreground))]">{userPreferences.favoriteCuisines}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Discover new recipes from your preferred cuisines</p>
            </div>
          </div>

          <div className="backdrop-blur-sm bg-[hsl(var(--card))]/50 p-6 sm:p-8 rounded-3xl shadow-xl border border-[hsl(var(--border))] hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Dietary Preferences</h3>
              <span className="text-3xl">🥗</span>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-[hsl(var(--card-foreground))]">{userPreferences.dietaryPreferences}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Recipes that match your lifestyle</p>
            </div>
          </div>

          <div className="backdrop-blur-sm bg-[hsl(var(--card))]/50 p-6 sm:p-8 rounded-3xl shadow-xl border border-[hsl(var(--border))] hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Cooking Time</h3>
              <span className="text-3xl">⏰</span>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-[hsl(var(--card-foreground))]">{userPreferences.cookingTime}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Recipes that fit your schedule</p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-8">
          <Link to="/recipes" className="w-full sm:w-auto bg-[hsl(var(--primary))] hover:brightness-105 text-[hsl(var(--primary-foreground))] font-semibold text-lg px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-center">🔍 Discover Recipes</Link>
          <Link to="/favorites" className="w-full sm:w-auto bg-[hsl(var(--destructive))] hover:brightness-95 text-[hsl(var(--destructive-foreground))] font-semibold text-lg px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-center">❤️ My Favorites</Link>
          <Link to="/settings" className="w-full sm:w-auto bg-[hsl(var(--accent))] hover:brightness-95 text-[hsl(var(--accent-foreground))] font-semibold text-lg px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-center">📝 Update Preferences</Link>
        </div>

        {/* Recent Meals */}
        <div className="bg-[hsl(var(--card))] rounded-2xl shadow-lg p-6 sm:p-8 max-w-5xl mx-auto border border-[hsl(var(--border))]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--card-foreground))]">Recent Meals</h2>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">Last 10 meals</div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recentMeals.map((meal) => (
              <div key={meal.id} className="flex items-center p-4 bg-[hsl(var(--card))]/60 rounded-xl hover:bg-[hsl(var(--card))]/70 transition-colors duration-200 border border-[hsl(var(--border))]">
                <div className="w-12 h-12 bg-[hsl(var(--muted))]/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-[hsl(var(--primary))] text-xl">{meal.type === 'Breakfast' ? '🌅' : meal.type === 'Lunch' ? '☀️' : meal.type === 'Dinner' ? '🌙' : meal.type === 'Snack' ? '🍪' : '🥗'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-[hsl(var(--card-foreground))] truncate">{meal.name}</h3>
                    <span className="font-medium text-[hsl(var(--primary))] text-sm ml-2">{meal.type}</span>
                  </div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">{meal.time}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{meal.ingredients}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/meal-history" className="w-full sm:w-auto bg-[hsl(var(--primary))] hover:brightness-105 text-[hsl(var(--primary-foreground))] font-semibold text-lg px-8 py-3 rounded-xl shadow-lg text-center">👀 View Full Meal History</Link>
          </div>
        </div>

        {/* Today's Activity */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-[hsl(var(--primary))] rounded-2xl p-6 text-[hsl(var(--primary-foreground))] text-center">
            <h3 className="text-xl font-bold mb-2">Today's Activity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-2xl font-bold">{recentMeals.slice(0, 4).length}</div>
                <div className="opacity-90">Meals Logged</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{userPreferences.mealsPerDay}</div>
                <div className="opacity-90">Daily Goal</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{userPreferences.favoriteCuisines ? '✅' : '❌'}</div>
                <div className="opacity-90">Profile Complete</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showProfileSetup && (
        <ProfileSetup isFirstTime={!hasProfile} onComplete={() => setShowProfileSetup(false)} onSkip={() => setShowProfileSetup(false)} />
      )}
    </div>
  );
};
export default Dashboard