import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from './ThemeToggle'
const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  if (loading) {
    return (
      <nav className={`sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 shadow-md transition-all duration-300 ${
        isHomePage 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-800 dark:text-gray-200 border-b border-gray-200/20 dark:border-gray-700/20' 
          : 'bg-green-600 dark:bg-green-700 text-white'
      }`}>
        <div className="flex items-center justify-between">
          <h1 className="text-base sm:text-lg lg:text-xl font-semibold">DineFit</h1>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <div className="text-sm">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }
  return (
    <nav className={`sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 shadow-md transition-all duration-300 ${
      isHomePage 
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-800 dark:text-gray-200 border-b border-gray-200/20 dark:border-gray-700/20' 
        : 'bg-green-600 dark:bg-green-700 text-white'
    }`}>
      <div className="flex items-center justify-between">
        <h1 className="text-base sm:text-lg lg:text-xl font-semibold">DineFit</h1>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
          {user ? (
            <>
              <span className={`text-sm sm:text-base px-2 sm:px-3 py-1 border-2 rounded ${
                isHomePage 
                  ? 'border-green-500 dark:border-green-400 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30' 
                  : 'border-green-400 text-white'
              }`}>
                Welcome, {user.name || user.email}
              </span>
              <NavLink 
                to="/dashboard" 
                className={({isActive}) => `text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                  isActive 
                    ? (isHomePage ? 'bg-green-600 dark:bg-green-500 text-white' : 'bg-green-800 text-white')
                    : (isHomePage ? 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-300' : 'text-white hover:bg-green-700')
                }`}
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/meal-planner" 
                className={({isActive}) => `text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                  isActive 
                    ? (isHomePage ? 'bg-green-600 dark:bg-green-500 text-white' : 'bg-green-800 text-white')
                    : (isHomePage ? 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-300' : 'text-white hover:bg-green-700')
                }`}
              >
                Meal Planner
              </NavLink>
              <button 
                onClick={handleLogout}
                className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                  isHomePage 
                    ? 'text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300' 
                    : 'text-white hover:bg-green-700'
                }`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink 
                to="/" 
                className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                  isHomePage 
                    ? 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-300' 
                    : 'text-white hover:bg-green-700'
                }`}
              >
                Home
              </NavLink>
              <NavLink 
                to="/login" 
                className={({isActive}) => `text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                  isActive 
                    ? (isHomePage ? 'bg-green-600 dark:bg-green-500 text-white' : 'bg-green-800 text-white')
                    : (isHomePage ? 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-300' : 'text-white hover:bg-green-700')
                }`}
              >
                Login
              </NavLink>
              {!isHomePage && (
                <NavLink 
                  to="/signup" 
                  className={({isActive}) => `text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                    isActive 
                      ? 'bg-green-800 text-white hover:bg-green-700'
                      : 'text-white hover:bg-green-700'
                  }`}
                >
                  Signup
                </NavLink>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
export default Navbar