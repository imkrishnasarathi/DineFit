
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navClasses = `sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 shadow-md transition-all duration-300 ${
    isHomePage
      ? "bg-white/80 backdrop-blur-md text-gray-800 border-b border-gray-200/20"
      : "bg-green-600 text-white"
  }`;

  const baseLink = "block text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200";
  const activeLink = (isActive) =>
    isActive
      ? isHomePage
        ? "bg-green-600 text-white"
        : "bg-green-800 text-white"
      : isHomePage
      ? "text-gray-700 hover:bg-green-100 hover:text-green-700"
      : "text-white hover:bg-green-700";

  if (loading) {
    return (
      <nav className={navClasses}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src="/dine-fit-logo.svg" alt="DineFit" className="h-10 w-10 sm:h-12 sm:w-12" />
            <span className="ml-2 text-base sm:text-lg lg:text-xl font-semibold">DineFit</span>
          </div>
          <div className="text-sm">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={navClasses}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src="/dine-fit-logo.svg" alt="DineFit" className="h-10 w-10 sm:h-12 sm:w-12" />
          <span className="ml-2 text-base sm:text-lg lg:text-xl font-semibold">DineFit</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden sm:flex space-x-4 items-center">
          {user ? (
            <>
              <span className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded ${isHomePage ? 'bg-green-50 text-green-700 border border-green-200' : 'text-white'}`}>
                Welcome, {user.name || user.email}
              </span>
              <NavLink to="/dashboard" className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                Dashboard
              </NavLink>
              <NavLink to="/meal-planner" className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                Meal Planner
              </NavLink>
              <button onClick={handleLogout} className={`${baseLink} ${isHomePage ? 'text-red-600' : 'text-white'}`}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/" className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                Home
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                About
              </NavLink>
              <NavLink to="/login" className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                Login
              </NavLink>
              {!isHomePage && (
                <NavLink to="/signup" className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                  Signup
                </NavLink>
              )}
            </>
          )}
          <button onClick={toggleTheme} aria-label="Toggle theme" className="px-2 py-1 rounded">
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="sm:hidden">
          <button onClick={() => setMenuOpen((s) => !s)} className="p-2">
            <span className="sr-only">Toggle menu</span>
            <div className={`w-5 h-0.5 bg-current mb-1 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-current mb-1 ${menuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-current ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </button>
        </div>
      </div>
      

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="sm:hidden mt-3 space-y-2">
          {user ? (
            <>
              <div className="px-2">Welcome, {user.name || user.email}</div>
              <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                Dashboard
              </NavLink>
              <NavLink to="/meal-planner" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                Meal Planner
              </NavLink>
              <button onClick={handleLogout} className={`${baseLink}`}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                Home
              </NavLink>
              <NavLink to="/login" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                Login
              </NavLink>
              <NavLink to="/signup" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                Signup
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
