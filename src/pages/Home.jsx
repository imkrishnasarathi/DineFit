import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
const Home = () => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100"></div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-emerald-200/40 to-teal-300/40 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-200/30 to-blue-300/30 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute -bottom-32 left-1/4 w-72 h-72 bg-gradient-to-r from-teal-200/35 to-emerald-300/35 rounded-full blur-3xl animate-float-slow"></div>

        <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 transform rotate-45 animate-spin-slow opacity-20"></div>
        <div className="absolute bottom-32 left-16 w-12 h-32 bg-gradient-to-b from-cyan-400 to-blue-500 transform -skew-y-12 animate-sway opacity-25"></div>
        <div className="absolute top-1/2 left-1/3 w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full animate-bounce-slow opacity-30"></div>

        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-20 gap-8 p-8">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 50}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center">
          <div className="backdrop-blur-sm bg-white/30 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl border border-white/20 mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6 sm:mb-8">
              {isAuthenticated
                ? `Welcome back, ${user.name || user.email}!`
                : "Welcome to DineFit!"}
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-700 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed">
              {isAuthenticated
                ? "Ready to plan delicious meals?"
                : "Tired of guessing what to cook? Let DineFit help."}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative">Go to Dashboard →</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative">Start Your Journey</span>
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-emerald-700 bg-white/70 backdrop-blur-sm rounded-2xl hover:bg-white/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-emerald-200"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 mt-16 sm:mt-20">
            <div className="group relative backdrop-blur-sm bg-white/40 p-8 sm:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/30 hover:border-emerald-200/50 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 to-teal-100/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-6xl sm:text-7xl mb-6 filter drop-shadow-lg">
                  👨‍🍳
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                  Personal Recipes
                </h3>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  Discover recipes tailored to your personal taste preferences
                  and cooking style.
                </p>
              </div>
            </div>

            <div className="group relative backdrop-blur-sm bg-white/40 p-8 sm:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/30 hover:border-teal-200/50 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-100/20 to-cyan-100/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-6xl sm:text-7xl mb-6 filter drop-shadow-lg">
                  🔍
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                  Smart Discovery
                </h3>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  Find new recipes that match your flavor preferences and
                  dietary requirements.
                </p>
              </div>
            </div>

            <div className="group relative backdrop-blur-sm bg-white/40 p-8 sm:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/30 hover:border-cyan-200/50 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/20 to-blue-100/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-6xl sm:text-7xl mb-6 filter drop-shadow-lg">
                  ❤️
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  Recipe Favorites
                </h3>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  Save and organize recipes you love, creating your personalized
                  collection.
                </p>
              </div>
            </div>

            <div className="group relative backdrop-blur-sm bg-white/40 p-8 sm:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/30 hover:border-purple-200/50 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-pink-100/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <Link
                to={isAuthenticated ? "/meal-planner" : "/login"}
                className="relative z-10 block"
              >
                <div className="text-6xl sm:text-7xl mb-6 filter drop-shadow-lg">
                  🗓️
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  Meal Planner
                </h3>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  Plan your meals effortlessly with personalized diet options
                  and flexible scheduling.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
