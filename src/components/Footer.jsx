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

                {/* Social Links */}
                <div className="text-center md:text-left">
                    <h3 className="font-semibold text-[hsl(var(--card-foreground))] mb-4 text-lg">Follow Me</h3>
                    <div className="flex justify-center md:justify-start gap-6 text-2xl">

                        <a
                            href="https://github.com/imkrishnasarathi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-teal-500 transition-colors duration-300"
                        >
                            <FaGithub />
                        </a>

                        <a
                            href="https://x.com/CodesKae"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-teal-500 transition-colors duration-300"
                        >
                            <FaTwitter />
                        </a>

                        <a
                            href="https://www.youtube.com/@krishcodes"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-teal-500 transition-colors duration-300"
                        >
                            <FaYoutube />
                        </a>
                    </div>
                </div>
            </div>



            {/* Bottom bar */}
            <div className="border-t border-[hsl(var(--border))] text-center py-4 text-[hsl(var(--muted-foreground))] text-sm">
                © {new Date().getFullYear()} DineFit. All rights reserved. | Built with ❤️ by Krishnasarathi
            </div>
        </footer>
    );
}
