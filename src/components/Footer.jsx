import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/20 py-8 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              DineFit
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your personal recipe companion for delicious, healthy meals.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 text-sm"
                  aria-label="About page"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 text-sm"
                  aria-label="Contact page"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 text-sm"
                  aria-label="Privacy Policy page"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 text-sm"
                  aria-label="Terms of Service page"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com/placeholder"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our GitHub page"
                className="text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://linkedin.com/in/placeholder"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our LinkedIn page"
                className="text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://twitter.com/placeholder"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Twitter page"
                className="text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              >
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200/20 text-center text-gray-600 text-sm">
          <p>&copy; 2024 DineFit. All rights reserved.</p>
        </div>
      </div>
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-full shadow-lg hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label="Scroll to top of page"
      >
        <FaArrowUp size={16} />
      </button>
    </footer>
  );
};

export default Footer;