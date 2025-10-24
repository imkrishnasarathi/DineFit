import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Success() {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated, refreshUserSession } = useAuth();
  const [redirecting, setRedirecting] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        console.log('OAuth success page loaded, attempts:', attempts);
        
        // If we already have a user, redirect immediately
        if (isAuthenticated && user) {
          console.log('User already authenticated, redirecting to dashboard:', user);
          setRedirecting(true);
          navigate('/dashboard', { replace: true });
          return;
        }

        // Try to refresh the session to get OAuth user data
        try {
          console.log('Attempting to refresh user session...');
          const refreshedUser = await refreshUserSession();
          console.log('Session refreshed successfully:', refreshedUser);
          
          if (refreshedUser) {
            setRedirecting(true);
            navigate('/dashboard', { replace: true });
            return;
          }
        } catch (refreshError) {
          console.log('Session refresh failed:', refreshError);
        }

        // If we still don't have a user after refresh, wait and try again
        if (attempts < 3) {
          console.log(`Waiting for OAuth session to be established... (attempt ${attempts + 1}/3)`);
          setAttempts(prev => prev + 1);
          
          setTimeout(() => {
            handleOAuthSuccess();
          }, 1500);
        } else {
          console.log('Max attempts reached, redirecting to home');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error handling OAuth success:', error);
        navigate('/', { replace: true });
      }
    };

    // Only run this effect if we're not already loading
    if (!loading) {
      handleOAuthSuccess();
    }
  }, [isAuthenticated, user, loading, navigate, refreshUserSession, attempts]);

  // Show loading state while redirecting
  if (loading || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border border-[hsl(var(--border))] border-t-[hsl(var(--primary))] mx-auto mb-4"></div>
          <p className="text-lg font-medium text-[hsl(var(--foreground))] mb-2">
            {redirecting ? 'Redirecting to Dashboard...' : 'Processing Login...'}
          </p>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Please wait while we complete your authentication
          </p>
        </div>
      </div>
    );
  }

  // Fallback success message (should rarely be seen)
  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-4">
          Login Successful!
        </h1>
        <p className="text-lg text-[hsl(var(--muted-foreground))] mb-6">
          Redirecting you to your dashboard...
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border border-[hsl(var(--border))] border-t-[hsl(var(--primary))] mx-auto"></div>
      </div>
    </div>
  );
}

export default Success;