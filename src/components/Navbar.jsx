
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const [menuOpen, setMenuOpen] = useState(false);


import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  const navClasses = `sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 shadow-md transition-all duration-300 ${
    isHomePage
      ? 'bg-white/80 backdrop-blur-md text-gray-800 border-b border-gray-200/20'
      : 'bg-green-600 text-white'
  }`;

  const baseLink =
    'block text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200';

  const activeLink = (isActive) =>
    isActive
      ? isHomePage
        ? 'bg-green-600 text-white'
        : 'bg-green-800 text-white'
      : isHomePage
      ? 'text-gray-700 hover:bg-green-100 hover:text-green-700'
      : 'text-white hover:bg-green-700';

  return (
    <nav className={navClasses}>
      <div className="flex items-center justify-between">
        <h1 className="text-base sm:text-lg lg:text-xl font-semibold">DineFit</h1>

        <button
          className="sm:hidden flex flex-col space-y-1 focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className={`block h-0.5 w-5 bg-current transform transition duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block h-0.5 w-5 bg-current transition duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-5 bg-current transform transition duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>

        <div className="hidden sm:flex space-x-4 items-center">
          {loading ? (
            <div className="text-sm">Loading...</div>
          ) : user ? (

  if (loading) {
    return (
      <nav
        className={`sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 shadow-md transition-all duration-300 ${
          isHomePage
            ? "bg-white/80 backdrop-blur-md text-gray-800 border-b border-gray-200/20"
            : "bg-green-600 text-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-base sm:text-lg lg:text-xl font-semibold">
            DineFit
          </h1>
          <div className="text-sm">Loading...</div>
        </div>
      </nav>
    );
  }
  return (
    <nav
      className={`sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 shadow-md transition-all duration-300 ${
        isHomePage
          ? "bg-white/80 backdrop-blur-md text-gray-800 border-b border-gray-200/20"
          : "bg-green-600 text-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <Navlink to={user ? "/dashboard" : "/"}>
          <h1 className="text-base sm:text-lg lg:text-xl font-semibold">
            DineFit
          </h1>
        </Navlink>
        <div className="flex space-x-2 sm:space-x-4">
          {user ? (

            <>
              <span
                className={`text-sm sm:text-base px-2 sm:px-3 py-1 border-2 rounded ${
                  isHomePage

                    ? 'border-green-500 text-green-700 bg-green-50'
                    : 'border-green-400 text-white'
                }`}

                    ? "border-green-500 text-green-700 bg-green-50"
                    : "border-green-400 text-white"
                }`}
              >
                Welcome, {user.name || user.email}
              </span>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                    isActive
                      ? isHomePage
                        ? "bg-green-600 text-white"
                        : "bg-green-800 text-white"
                      : isHomePage
                      ? "text-gray-700 hover:bg-green-100 hover:text-green-700"
                      : "text-white hover:bg-green-700"
                  }`
                }

              >
                Welcome, {user.name || user.email}
              </span>
              <NavLink to="/dashboard" className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                Dashboard
              </NavLink>

              <NavLink to="/meal-planner" className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                Meal Planner
              </NavLink>
              <button
                onClick={handleLogout}
                className={`${baseLink} ${
                  isHomePage
                    ? 'text-gray-700 hover:bg-red-100 hover:text-red-700'
                    : 'text-white hover:bg-green-700'

              <NavLink
                to="/meal-planner"
                className={({ isActive }) =>
                  `text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                    isActive
                      ? isHomePage
                        ? "bg-green-600 text-white"
                        : "bg-green-800 text-white"
                      : isHomePage
                      ? "text-gray-700 hover:bg-green-100 hover:text-green-700"
                      : "text-white hover:bg-green-700"
                  }`
                }
              >
                Meal Planner
              </NavLink>
              <NavLink
                to="/about"
                className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                  isHomePage
                    ? "text-gray-700 hover:bg-green-100 hover:text-green-700"
                    : "text-white hover:bg-green-700"
                }`}
              >
                About
              </NavLink>

              <button
                onClick={handleLogout}
                className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                  isHomePage
                    ? "text-gray-700 hover:bg-red-100 hover:text-red-700"
                    : "text-white hover:bg-green-700"

                }`}
              >
                Logout
              </button>
            </>
          ) : (
            <>

              <NavLink to="/" className={`${baseLink} ${isHomePage ? 'text-gray-700 hover:bg-green-100 hover:text-green-700' : 'text-white hover:bg-green-700'}`}>
                Home
              </NavLink>
              <NavLink to="/login" className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                Login
              </NavLink>
              {!isHomePage && (
                <NavLink to="/signup" className={({ isActive }) => `${baseLink} ${isActive ? 'bg-green-800 text-white hover:bg-green-700' : 'text-white hover:bg-green-700'}`}>

              <NavLink
                to="/"
                className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                  isHomePage
                    ? "text-gray-700 hover:bg-green-100 hover:text-green-700"
                    : "text-white hover:bg-green-700"
                }`}
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                  isHomePage
                    ? "text-gray-700 hover:bg-green-100 hover:text-green-700"
                    : "text-white hover:bg-green-700"
                }`}
              >
                About
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                    isActive
                      ? isHomePage
                        ? "bg-green-600 text-white"
                        : "bg-green-800 text-white"
                      : isHomePage
                      ? "text-gray-700 hover:bg-green-100 hover:text-green-700"
                      : "text-white hover:bg-green-700"
                  }`
                }
              >
                Login
              </NavLink>
              {!isHomePage && (
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    `text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                      isActive
                        ? "bg-green-800 text-white hover:bg-green-700"
                        : "text-white hover:bg-green-700"
                    }`
                  }
                >

                  Signup
                </NavLink>
              )}
            </>
          )}
        </div>
      </div>

      <div
        className={`sm:hidden flex flex-col mt-3 space-y-2 transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {loading ? (
          <div className="text-sm">Loading...</div>
        ) : user ? (
          <>
            <span
              className={`text-sm px-2 py-1 ${
                isHomePage
                  ? 'border-green-500 text-green-700 bg-green-50'
                  : ' text-white'
              }`}
            >
              Welcome, {user.name || user.email}
            </span>
            <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
              Dashboard
            </NavLink>
            <NavLink to="/meal-planner" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
              Meal Planner
            </NavLink>
            <button
              onClick={handleLogout}
              className={`border-2 border-white ${baseLink} ${
                isHomePage
                  ? 'text-gray-700 hover:bg-red-100 hover:text-red-700'
                  : 'text-white hover:bg-green-700'
              }`}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/" onClick={() => setMenuOpen(false)} className={`${baseLink} ${isHomePage ? 'text-gray-700 hover:bg-green-100 hover:text-green-700' : 'text-white hover:bg-green-700'}`}>
              Home
            </NavLink>
            <NavLink to="/login" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
              Login
            </NavLink>
            {!isHomePage && (
              <NavLink to="/signup" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${baseLink} ${isActive ? 'bg-green-800 text-white hover:bg-green-700' : 'text-white hover:bg-green-700'}`}>
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
