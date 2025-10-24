

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import hero from "../assets/hero.jpg";
import search from "../assets/search.png";
import second from "../assets/search.png";
import third from "../assets/third.png";
import fourth from "../assets/fourth.png";
import fifth from "../assets/fifth.png";
import sixth from "../assets/sixth.png";

const Home = () => {
  const { user, isAuthenticated, loading } = useAuth();

  const whatweprovide = [
    {
      title: "Smart Recipe Discovery",
      description:
        "Find recipes that match your dietary preferences, allergies, and nutritional goals with our intelligent search.",
      image: search,
    },
    {
      title: "Personalized Nutrition",
      description:
        "Track your daily macros and get recipe suggestions tailored to your specific health and fitness targets.",
      image: second,
    },
    {
      title: "Meal Planning Made Easy",
      description: "Plan your weekly meals effortlessly and never wonder what's for dinner again.",
      image: third,
    },
    {
      title: "Quick & Convenient",
      description: "Filter recipes by prep time and cooking difficulty to find meals that fit your schedule.",
      image: fourth,
    },
    {
      title: "Progress Tracking",
      description:
        "Monitor your nutrition intake, weight goals, and see your progress over time with detailed analytics.",
      image: fifth,
    },
    {
      title: "Dietary Preferences",
      description: "Support for vegetarian, vegan, keto, gluten-free, and many more dietary requirements.",
      image: sixth,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden bg-[hsl(var(--background))]">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--primary))] mx-auto mb-4"></div>
          <p className="text-lg text-[hsl(var(--muted-foreground))]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(var(--background))]"></div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-emerald-200/40 to-teal-300/40 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-200/30 to-blue-300/30 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute -bottom-32 left-1/4 w-72 h-72 bg-gradient-to-r from-teal-200/35 to-emerald-300/35 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      <div className="relative z-10 w-full min-h-screen bg-[rgba(0,187,167,0.1)] text-black">
        <div className="w-full min-h-screen flex flex-col lg:flex-row font-arimo container mx-auto px-6 py-10">
          {/* Left Section */}
          <div className="w-full lg:w-1/2 flex justify-center items-center text-center lg:text-left mb-10 lg:mb-0">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl sm:text-4xl lg:text-4xl leading-tight">
                Discover Recipes <br />
                That <span className="text-[#00BBA7]">Match Your Goals</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-700">
                DineFit helps you find delicious, cookable recipes aligned with your
                unique dietary preferences, allergies, and health goals. Don’t know
                what to cook? Let DineFit decide!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="px-4 py-2 bg-[#00BBA7] text-xs text-white backdrop-blur-lg rounded-xl text-center">
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link to="/login" className="px-4 py-2 bg-[#00BBA7] text-xs text-white backdrop-blur-lg rounded-xl text-center">
                    Start Your Journey
                  </Link>
                )}

                <button className="px-4 py-2 bg-white text-[#00BBA7] border-[#00BBA7] border rounded-xl text-xs backdrop-blur-lg">
                  Learn more
                </button>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-1/2 flex justify-center items-center">
            <div className="w-full max-w-[400px] p-4 rounded-2xl shadow-2xl">
              <img className="w-full block rounded-xl" src={hero} alt="hero" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center font-arimo px-4 py-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-4 text-center">
          Everything You Need to Eat <span className="text-[#00BBA7]">Healthier</span>
        </h2>
        <p className="text-sm sm:text-base max-w-md text-center mb-6 text-gray-700">
          Powerful features designed to help you discover, plan, and track your meals effortlessly.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {whatweprovide.map((item, index) => (
            <div key={index} className="w-full sm:w-64 md:w-72 lg:w-80 bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
              <img src={item.image} className="mb-3 w-10 h-10" alt={item.title} />
              <h3 className="mb-2 font-semibold text-base">{item.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 w-full min-h-[50vh] flex flex-col justify-center items-center font-arimo px-4 py-16 bg-[#00BC7DE5] text-white text-center">
        <div className="w-full max-w-lg flex flex-col justify-center items-center gap-4 px-6 py-10 rounded-3xl">
          <h4 className="text-xl sm:text-2xl lg:text-3xl font-semibold">Ready to Transform Your Eating Habits?</h4>
          <p className="text-sm sm:text-base">Join thousands of users who have discovered the joy of personalized, healthy cooking with DineFit.</p>
          <Link to="/login">
            <button className="bg-white px-4 py-2 text-[#00BC7DE5] rounded-xl text-xs sm:text-sm mt-2 hover:bg-gray-100 transition">Get Started for Free</button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;


