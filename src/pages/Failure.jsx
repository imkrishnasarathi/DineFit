import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Failure() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-4">
          Login Failed
        </h1>
        <p className="text-lg text-[hsl(var(--muted-foreground))] mb-6">
          We're sorry, but there was an issue with your Google login. This could be due to:
        </p>
        <ul className="text-sm text-[hsl(var(--muted-foreground))] mb-6 text-left space-y-2">
          <li>• You denied permission to the app</li>
          <li>• Network connectivity issues</li>
          <li>• Temporary service unavailability</li>
        </ul>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
          Redirecting you back to the home page...
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border border-[hsl(var(--border))] border-t-[hsl(var(--destructive))] mx-auto"></div>
      </div>
    </div>
  );
}

export default Failure;