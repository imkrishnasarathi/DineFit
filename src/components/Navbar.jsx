import React, { useState } from "react";
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

  if (loading) {
    return (
      <nav className="sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 shadow-md bg-background text-foreground border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/dine-fit-logo.svg"
              alt="DineFit"
              className="h-12 w-12 sm:h-16 sm:w-16"
            />
            <span className="ml-2 text-lg font-semibold">DineFit</span>
          </div>
          <div className="text-sm">Loading...</div>
        </div>
      </nav>
    );
  }

  const baseLink =
    "text-sm sm:text-base px-3 py-1 rounded transition-colors duration-200";

  const activeLink = (isActive) =>
    isActive
      ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
      : isHomePage
      ? "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))] hover:text-[hsl(var(--primary))]"
      : "text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]";

  return (
    <nav className="sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 shadow-md bg-background text-foreground border-b transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/dine-fit-logo.svg"
            alt="DineFit"
            className="h-12 w-12 sm:h-16 sm:w-16"
          />
          <span className="ml-2 text-lg font-semibold hidden sm:inline">
            DineFit
          </span>
        </div>

        {/* Theme Toggle + Desktop Nav */}
        <div className="hidden sm:flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
              theme === "dark"
                ? "bg-[hsl(var(--border))] text-[hsl(var(--card-foreground))]"
                : "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]"
            }`}
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          {user ? (
            <>
              <span className="text-sm sm:text-base px-3 py-1 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm">
                Welcome, {user.name || user.email}
              </span>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/meal-planner"
                className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}
              >
                Meal Planner
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-sm sm:text-base px-3 py-1 rounded transition-colors duration-200 hover:bg-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive-foreground))]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/"
                className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}
              >
                Home
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}
              >
                Login
              </NavLink>
              {!isHomePage && (
                <NavLink
                  to="/signup"
                  className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}
                >
                  Signup
                </NavLink>
              )}
            </>
          )}
        </div>

        {/* Hamburger Button (Mobile) */}
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

      {/* Mobile Menu */}
      <div
        className={`sm:hidden flex flex-col mt-3 space-y-2 transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {user ? (
          <>
            <span className="text-sm px-2 py-1 text-[hsl(var(--primary))]">
              Welcome, {user.name || user.email}
            </span>
            <NavLink
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/meal-planner"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}
            >
              Meal Planner
            </NavLink>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1 rounded hover:bg-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive-foreground))]"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}
            >
              Login
            </NavLink>
            {!isHomePage && (
              <NavLink
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}
              >
                Signup
              </NavLink>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;