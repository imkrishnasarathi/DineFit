import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { forceLogout } from '../utils/sessionUtils';
import { Eye, EyeOff } from 'lucide-react';
import { account } from '../appwriteClient';

const Login = () => {
    const { login, guestLogin, user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showSessionConflict, setShowSessionConflict] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });


    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleLogin = async (event) => {
        event.preventDefault();
        if (!isOnline) {
            setError('No internet connection. Please check your network and try again.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await login(formData.email, formData.password);
            console.log('Login successful, redirecting...');
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            if (error.message.includes('session already exists') || error.message.includes('session') && error.code === 401) {
                setShowSessionConflict(true);
                setError('Session conflict detected. Please clear your session and try again.');
            } else {
                setError(error.message || 'Login failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    const handleClearSession = async () => {
        setIsLoading(true);
        try {
            await forceLogout();
        } catch (error) {
            console.log('Force logout completed');
        }
    };

    const handleGuestLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            await guestLogin();
            navigate('/dashboard');
        } catch (error) {
            console.error('Guest login failed:', error);
            setError(error.message || 'Guest login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    const handleGoogleOAuth = () => {
        console.log("clicked")
        account.createOAuth2Session(
            "google",
            `${process.env.BASE_URL}/success`,
            `${process.env.BASE_URL}/failure`,
        )
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">

            <div className="absolute inset-0 bg-[hsl(var(--background))]"></div>

            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-emerald-200/30 to-teal-300/30 rounded-full blur-3xl animate-float"></div>
                <div className="absolute top-1/2 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-200/25 to-blue-300/25 rounded-full blur-3xl animate-float-delayed"></div>
                <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-gradient-to-r from-teal-200/30 to-emerald-300/30 rounded-full blur-3xl animate-float-slow"></div>

                <div className="absolute top-20 right-20 w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 transform rotate-45 animate-spin-slow opacity-15"></div>
                <div className="absolute bottom-32 left-16 w-8 h-24 bg-gradient-to-b from-cyan-400 to-blue-500 transform -skew-y-12 animate-sway opacity-20"></div>
            </div>

            <div className="relative z-10 flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
                <div className="w-full max-w-md backdrop-blur-sm bg-[hsl(var(--card))]/50 p-8 sm:p-10 lg:p-12 rounded-3xl shadow-2xl border border-[hsl(var(--border))]">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                            Welcome Back
                        </h1>
                        <p className="text-lg sm:text-xl text-[hsl(var(--muted-foreground))]">Sign in to continue your fitness journey</p>

                        {!isOnline && (
                            <div className="mt-4 p-3 bg-[hsl(var(--accent))]/20 backdrop-blur-sm border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] rounded-xl">
                                <div className="flex items-center justify-center">
                                    <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-2 animate-pulse"></div>
                                    <span className="text-sm font-medium">No internet connection</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-[hsl(var(--destructive))]/20 backdrop-blur-sm border border-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] rounded-2xl">
                                <p className="text-sm font-medium">{error}</p>
                                {showSessionConflict && (
                                    <button
                                        type="button"
                                        onClick={handleClearSession}
                                        className="mt-3 w-full px-4 py-2 bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] rounded-xl hover:brightness-90 transition-colors duration-200 text-sm font-medium"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Clearing Session...' : 'Clear Session & Retry'}
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">
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
                                    className="w-full px-4 py-3 text-lg bg-[hsl(var(--input))] backdrop-blur-sm border border-[hsl(var(--border))] rounded-2xl focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all duration-200 placeholder:[hsl(var(--muted-foreground))] shadow-lg"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"} // toggle type
                                        name="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full px-4 py-3 pr-12 text-lg bg-[hsl(var(--input))] backdrop-blur-sm border border-[hsl(var(--border))] rounded-2xl focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all duration-200 placeholder:[hsl(var(--muted-foreground))] shadow-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-3 flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--card-foreground))]"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-[hsl(var(--primary-foreground))] bg-[hsl(var(--primary))] rounded-2xl hover:brightness-95 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-70 disabled:transform-none"
                        >
                            <span className="absolute inset-0 bg-[hsl(var(--primary))] rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></span>
                            <span className="relative">
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[hsl(var(--primary-foreground))]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing In...
                                    </div>
                                ) : (
                                    'Sign In to DineFit'
                                )}
                            </span>
                        </button>
                    </form>


                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[hsl(var(--border))]/50"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[hsl(var(--card))]/40 backdrop-blur-sm text-[hsl(var(--muted-foreground))] rounded-xl">or</span>
                        </div>
                    </div>


                    <button
                        type="button"
                        onClick={handleGuestLogin}
                        disabled={isLoading}
                        className="group relative w-full inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-[hsl(var(--card-foreground))] bg-[hsl(var(--card))]/40 backdrop-blur-sm border-2 border-[hsl(var(--border))]/50 rounded-2xl hover:brightness-95 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:transform-none"
                    >
                        <span className="relative flex items-center">
                            <svg className="w-5 h-5 mr-3 text-[hsl(var(--muted-foreground))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {isLoading ? 'Starting Guest Session...' : 'Continue as Guest'}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={handleGoogleOAuth}
                        disabled={isLoading}
                        className="mt-2 group relative w-full inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-[hsl(var(--card-foreground))] bg-[hsl(var(--card))]/40 backdrop-blur-sm border-2 border-[hsl(var(--border))]/50 rounded-2xl hover:brightness-95 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:transform-none"
                    >
                        continue with google
                    </button>


                    <div className="mt-4 p-3 bg-[hsl(var(--muted))]/20 backdrop-blur-sm border border-[hsl(var(--border))]/50 text-[hsl(var(--muted-foreground))] rounded-xl">
                        <p className="text-sm text-center">
                            <span className="font-medium">Guest Mode:</span> Try DineFit without creating an account.
                        </p>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-[hsl(var(--muted-foreground))]">
                            Don't have an account?{' '}
                            <a href="/signup" className="font-semibold text-[hsl(var(--primary))] hover:brightness-95 transition-colors duration-200">
                                Join DineFit
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Login