import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { validatePassword } from "../utils/validation";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import PasswordStrength from "../components/PasswordStrength";
import { account } from "../appwriteClient";

const Signup = () => {
  const { signup, user } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Real-time password matching validation
    if (formData.confirmPassword === "") {
      setPasswordsMatch(null);
    } else if (formData.password === formData.confirmPassword) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }

    setIsLoading(true);
    try {
      await signup(formData.email, formData.password, formData.name);
      console.log("Signup successful, redirecting...");
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
      setError(error.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleOAuth = () => {
    console.log("clicked")
    const origin = window.location.origin;
    account.createOAuth2Session(
      "google",
      `${origin}/success`,
      `${origin}/failure`,
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Background gradients (toned down for dark) */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/10 via-teal-200/8 to-cyan-200/8"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-emerald-200/10 to-teal-300/8 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-200/8 to-blue-300/8 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute -bottom-32 left-1/4 w-72 h-72 bg-gradient-to-r from-teal-200/10 to-emerald-300/8 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-20 right-20 w-12 h-12 bg-gradient-to-r from-emerald-400/8 to-teal-500/8 transform rotate-45 animate-spin-slow opacity-15"></div>
        <div className="absolute bottom-32 left-16 w-8 h-24 bg-gradient-to-b from-cyan-400/8 to-blue-500/8 transform -skew-y-12 animate-sway opacity-20"></div>
      </div>

      {/* Card */}
      <div className="relative z-10 flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md backdrop-blur-sm bg-[hsl(var(--card))]/50 p-8 sm:p-10 lg:p-12 rounded-3xl shadow-2xl border border-[hsl(var(--border))]">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
              Join DineFit
            </h1>
            <p className="text-lg sm:text-xl text-[hsl(var(--muted-foreground))]">
              Start your personalized fitness journey today
            </p>
            <button onClick={handleGoogleOAuth} className="border-2 border-[hsl(var(--primary))] rounded-xl px-4 py-2 mt-6 text-[hsl(var(--card-foreground))]">continue with google</button>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="p-4 bg-[hsl(var(--destructive))/0.12] backdrop-blur-sm border border-[hsl(var(--destructive))/0.24] text-[hsl(var(--destructive-foreground))] rounded-2xl">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[hsl(var(--card-foreground))] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3 text-lg bg-[hsl(var(--input))] backdrop-blur-sm border border-[hsl(var(--border))] rounded-2xl focus:ring-2 focus:ring-[hsl(var(--primary))/0.24] focus:border-[hsl(var(--primary))] transition-all duration-200 placeholder:[color:theme(var(--muted-foreground))] shadow-lg text-[hsl(var(--card-foreground))]"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[hsl(var(--card-foreground))] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 text-lg bg-[hsl(var(--input))] backdrop-blur-sm border border-[hsl(var(--border))] rounded-2xl focus:ring-2 focus:ring-[hsl(var(--primary))/0.24] focus:border-[hsl(var(--primary))] transition-all duration-200 placeholder:[color:theme(var(--muted-foreground))] shadow-lg text-[hsl(var(--card-foreground))]"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[hsl(var(--card-foreground))] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword1 ? "text" : "password"}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
                    required
                    className="w-full px-4 py-3 text-lg bg-[hsl(var(--input))] backdrop-blur-sm border border-[hsl(var(--border))] rounded-2xl focus:ring-2 focus:ring-[hsl(var(--primary))/0.24] focus:border-[hsl(var(--primary))] transition-all duration-200 placeholder:[color:theme(var(--muted-foreground))] shadow-lg text-[hsl(var(--card-foreground))]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword1(!showPassword1)}
                    className="absolute inset-y-0 right-3 flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--card-foreground))]"
                  >
                    {showPassword1 ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <PasswordStrength password={formData.password} />
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword2 ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                    className={`w-full px-4 py-3 text-lg bg-[hsl(var(--input))] backdrop-blur-sm border rounded-2xl focus:ring-2 transition-all duration-200 placeholder:[color:theme(var(--muted-foreground))] shadow-lg text-[hsl(var(--card-foreground))] ${
                      passwordsMatch === null
                        ? "border-[hsl(var(--border))] focus:ring-[hsl(var(--primary))/0.24] focus:border-[hsl(var(--primary))]"
                        : passwordsMatch
                        ? "border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))/0.32] focus:border-[hsl(var(--primary))]"
                        : "border-[hsl(var(--destructive))/0.6] focus:ring-[hsl(var(--destructive))/0.32] focus:border-[hsl(var(--destructive))/0.8]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword2(!showPassword2)}
                    className="absolute inset-y-0 right-3 flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--card-foreground))]"
                  >
                    {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordsMatch !== null && (
                  <div className="mt-2 flex items-center gap-2">
                    {passwordsMatch ? (
                      <>
                        <CheckCircle2 size={16} className="text-[hsl(var(--primary))]" />
                        <span className="text-sm font-medium text-[hsl(var(--primary))]">
                          Passwords match
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle size={16} className="text-[hsl(var(--destructive))]" />
                        <span className="text-sm font-medium text-[hsl(var(--destructive))]">
                          Passwords do not match
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-[hsl(var(--primary-foreground))] bg-[hsl(var(--primary))] rounded-2xl hover:brightness-95 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-70 disabled:transform-none"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative">
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-[hsl(var(--primary-foreground))]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : (
                  "Create Your DineFit Account"
                )}
              </span>
            </button>
          </form>

          {/* Login link */}
          <div className="text-center mt-6">
            <p className="text-[hsl(var(--muted-foreground))]">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-[hsl(var(--primary))] hover:brightness-95 transition-colors duration-200"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
