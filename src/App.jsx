import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Recipes from "./pages/Recipes";
import Favorites from "./pages/Favorites";
import Success from "./pages/Success";
import Failure from "./pages/Failure";
import MealPlanner from "./pages/EnhancedMealPlanner";
import MealHistory from "./pages/MealHistory";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import "./index.css";

function App() {
  console.log("App component rendering...");
  return (
    <div className="App">
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/success" element={<Success />} />
            <Route path="/failure" element={<Failure />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipes"
              element={
                <ProtectedRoute>
                  <Recipes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meal-history"
              element={
                <ProtectedRoute>
                  <MealHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meal-planner"
              element={
                <ProtectedRoute>
                  <MealPlanner />
                </ProtectedRoute>
              }
            />

            <Route path="/about" element={<About />} />

            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            <Route
              path="*"
              element={
                <div className="p-8 text-center">404 - Page Not Found</div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </div>
  );
}

export default App;
