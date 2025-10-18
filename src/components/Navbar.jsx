import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleLogout = () => setShowLogoutConfirm(true);

  const confirmLogout = async () => {
    try {
      await logout();
      setShowLogoutConfirm(false);
    } catch (error) {
      console.error("Logout failed:", error);
      setShowLogoutConfirm(false);
    }
  };

  const cancelLogout = () => setShowLogoutConfirm(false);

  // Navbar classes
  const navClasses = `sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 shadow-md transition-all duration-300 bg-background text-foreground border-b`;

  const linkClasses = (isActive, isHomePage) =>
    `text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
      isActive
        ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
        : isHomePage
        ? "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))] hover:text-[hsl(var(--primary))]"
        : "text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
    }`;

  if (loading) {
    return (
      <nav className={navClasses}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/dine-fit-logo.svg"
              alt="DineFit"
              className="h-12 w-12 sm:h-16 sm:w-16"
            />
            <span className="ml-2 text-base sm:text-lg lg:text-xl font-semibold">
              DineFit
            </span>
          </div>
          <div className="text-sm">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadein">
          <div
            className={`rounded-xl shadow-2xl p-8 min-w-[320px] max-w-xs text-center border animate-pop
              ${theme === 'dark'
                ? 'bg-gray-900 border-gray-700 text-gray-100'
                : 'bg-white border-gray-200 text-gray-800'}
            `}
          >
            <h2 className="text-xl font-bold mb-5">Are you sure you want to sign out?</h2>
            <div className="flex justify-center gap-6 mt-4">
              <button
                className="px-5 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-150"
                onClick={confirmLogout}
                autoFocus
              >
                Yes
              </button>
              <button
                className={`px-5 py-2 rounded-lg font-semibold shadow focus:outline-none focus:ring-2 transition-all duration-150
                  ${theme === 'dark'
                    ? 'bg-gray-800 text-gray-100 hover:bg-gray-700 focus:ring-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300'}
                `}
                onClick={cancelLogout}
              >
                Cancel
              </button>
            </div>
          </div>
          <style>{`
            @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
            @keyframes pop { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
            .animate-fadein { animation: fadein 0.2s ease; }
            .animate-pop { animation: pop 0.2s cubic-bezier(.4,2,.3,1); }
          `}</style>
        </div>
      )}

      {/* Navbar */}
      <nav className={navClasses}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/dine-fit-logo.svg"
              alt="DineFit"
              className="h-12 w-12 sm:h-16 sm:w-16"
            />
          </div>

          {/* Right side (theme + links) */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={`Switch to ${
                theme === "dark" ? "light" : "dark"
              } mode`}
              className={`p-2 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                theme === "dark"
                  ? "bg-[hsl(var(--border))] text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--border))/0.9]"
                  : "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--card))/0.95]"
              }`}
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>

            {/* Desktop Nav */}
            <div className="hidden sm:flex space-x-4 items-center">
              {user ? (
                <>
                  <span className="text-sm sm:text-base px-2 sm:px-3 py-1 rounded-full bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border border-[hsl(var(--border))]">
                    Welcome, {user.name || user.email}
                  </span>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) => linkClasses(isActive, isHomePage)}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/meal-planner"
                    className={({ isActive }) => linkClasses(isActive, isHomePage)}
                  >
                    Meal Planner
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/"
                    className={({ isActive }) => linkClasses(isActive, isHomePage)}
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/login"
                    className={({ isActive }) => linkClasses(isActive, isHomePage)}
                  >
                    Login
                  </NavLink>
                  {!isHomePage && (
                    <NavLink
                      to="/signup"
                      className={({ isActive }) => linkClasses(isActive, isHomePage)}
                    >
                      Signup
                    </NavLink>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="sm:hidden flex flex-col space-y-1 focus:outline-none"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span
                className={`block h-0.5 w-5 bg-current transform transition duration-300 ${
                  menuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              ></span>
              <span
                className={`block h-0.5 w-5 bg-current transition duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block h-0.5 w-5 bg-current transform transition duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              ></span>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className={`sm:hidden flex flex-col mt-3 space-y-2 transition-all duration-300 overflow-hidden ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {user ? (
            <>
              <span className="text-sm px-2 py-1">
                Welcome, {user.name || user.email}
              </span>
              <NavLink
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => linkClasses(isActive, isHomePage)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/meal-planner"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => linkClasses(isActive, isHomePage)}
              >
                Meal Planner
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-sm px-2 py-1 border-2 rounded text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => linkClasses(isActive, isHomePage)}
              >
                Home
              </NavLink>
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => linkClasses(isActive, isHomePage)}
              >
                Login
              </NavLink>
              {!isHomePage && (
                <NavLink
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => linkClasses(isActive, isHomePage)}
                >
                  Signup
                </NavLink>
              )}
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
