import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
      <nav className={`sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 shadow-md transition-all duration-300 bg-background text-foreground border-b`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src="/dine-fit-logo.svg" alt="DineFit" className="h-12 w-12 sm:h-16 sm:w-16" />
            <span className="ml-2 text-base sm:text-lg lg:text-xl font-semibold">DineFit</span>
          </div>
          <div className="text-sm">Loading...</div>
        </div>
      </nav>
    );
  }
  return (
    <nav className={`sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 shadow-md transition-all duration-300 bg-background text-foreground border-b`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src="/dine-fit-logo.svg" alt="DineFit" className="h-12 w-100 sm:h-16 sm:w-100" />
          {/* <span className="ml-2 text-base sm:text-lg lg:text-xl font-semibold">DineFit</span> */}
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className={`p-2 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              theme === 'dark'
                ? 'bg-[hsl(var(--border))] text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--border))/0.9]'
                : 'bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--card))/0.95]'
            }`}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          {user ? (
            <>
              <span className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded-full transition-colors duration-200 ${
                isHomePage
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm'
                  : 'bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border border-[hsl(var(--border))]'
              }`}>
                Welcome, {user.name || user.email}
              </span>
              <NavLink 
                to="/dashboard" 
                className={({isActive}) => `text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                    isActive 
                    ? (isHomePage ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]')
                    : (isHomePage ? 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))] hover:text-[hsl(var(--primary))]' : 'text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--primary))]')
                }`}
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/meal-planner" 
                className={({isActive}) => `text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                  isActive 
          ? (isHomePage ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]')
          : (isHomePage ? 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))] hover:text-[hsl(var(--primary))]' : 'text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]')
                }`}
              >
                Meal Planner
              </NavLink>
              <button 
                onClick={handleLogout}
                className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                  isHomePage 
                    ? 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))] hover:text-[hsl(var(--destructive))]' 
                    : 'text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]'
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
                    ? 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))] hover:text-[hsl(var(--primary))]' 
                    : 'text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]'
                }`}
              >
                Home
              </NavLink>
              <NavLink 
                to="/login" 
                className={({isActive}) => `text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                  isActive 
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : (isHomePage ? 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))] hover:text-[hsl(var(--primary))]' : 'text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]')
                }`}
              >
                Login
              </NavLink>
              {!isHomePage && (
                <NavLink 
                  to="/signup" 
                  className={({isActive}) => `text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                    isActive 
                      ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                      : 'text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]'
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