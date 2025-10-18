// src/components/Footer.jsx
import React from "react";
import { FaGithub, FaTwitter, FaLinkedin, FaDev, FaInstagram, FaYoutube } from "react-icons/fa";
import { SiNetlify } from "react-icons/si";

export default function Footer() {
    return (
    <footer className="mt-10 bg-[hsl(var(--card))]/30 backdrop-blur-lg border-t border-[hsl(var(--border))] shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

                {/* Branding */}
                <div className="text-center md:text-left max-w-md">
                    <h2 className="text-3xl font-extrabold text-teal-600 tracking-wide">DineFit</h2>
                    <p className="text-[hsl(var(--muted-foreground))] mt-3 leading-relaxed">
                        Plan delicious meals with ease.
                        Smart, fast, and personalized recipe discovery.
                    </p>
                </div>

            <a
              href="https://www.youtube.com/@krishcodes"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-500 transition-colors duration-300"
            >
              <FaYoutube />
            </a>

            <a
              href="https://www.linkedin.com/in/krish-kumar-a6214730a/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-500 transition-colors duration-300"
            >
              <FaLinkedin />
            </a>

          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-2 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 text-sm text-gray-700">
        <NavLink to="/privacy-policy">Privacy Policy</NavLink>
      </div>
      {/* Bottom bar */}
      <div className="border-t border-white/20 text-center py-4 text-gray-600 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()} DineFit. All rights reserved. | Built with
        ❤️ by Krishnasarathi
      </div>
    </footer>
  );
}
