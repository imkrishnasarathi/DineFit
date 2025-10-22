import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

import hero from "../assets/hero.jpg";
import search from "../assets/search.png";
import second from "../assets/second.png";
import third from "../assets/third.png";
import fourth from "../assets/fourth.png";
import fifth from "../assets/fifth.png";
import sixth from "../assets/sixth.png";

const Home = () => {
  const { user, isAuthenticated, loading } = useAuth();

  const whatweprovide = [
    {
      id: 1,
      title: "Personalized Meal Recommendations",
      desc: "Discover healthy meal suggestions tailored to your preferences and nutritional goals.",
      img: search,
    },
    {
      id: 2,
      title: "AI-Driven Nutrition Insights",
      desc: "Get data-driven insights to understand your eating habits and improve your health.",
      img: second,
    },
    {
      id: 3,
      title: "Seamless Calorie Tracking",
      desc: "Easily log your meals and automatically calculate nutritional values.",
      img: third,
    },
    {
      id: 4,
      title: "Smart Fitness Integration",
      desc: "Sync your fitness data to balance calorie intake and expenditure.",
      img: fourth,
    },
    {
      id: 5,
      title: "Restaurant Meal Suggestions",
      desc: "Find healthy meal options at your favorite restaurants using AI-based analysis.",
      img: fifth,
    },
    {
      id: 6,
      title: "Comprehensive Dashboard",
      desc: "Monitor your daily progress with a clear and user-friendly dashboard.",
      img: sixth,
    },
  ];

  return (
    <div className="relative w-full">
      {/* Hero Section */}
      <div className="relative">
        <img
          src={hero}
          alt="Hero"
          className="w-full h-[90vh] object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            DineFit: Eat Smart. Live Better.
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl">
            Your AI-powered companion for personalized nutrition, calorie
            tracking, and smart meal recommendations.
          </p>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/signup"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* What We Provide Section */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          What We Provide
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {whatweprovide.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 text-center"
            >
              <img
                src={item.img}
                alt={item.title}
                className="h-32 mx-auto mb-6 object-contain"
              />
              <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
