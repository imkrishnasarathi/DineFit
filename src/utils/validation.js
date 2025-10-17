// Password validation utilities
export const validatePassword = (password) => {
    console.log('🔍 Validating password:', password);
    
    if (!password || password.length < 8) {
        console.log('❌ Password too short');
        return {
            isValid: false,
            message: 'Password must be at least 8 characters long'
        };
    }
    
    if (password.length > 256) {
        console.log('❌ Password too long');
        return {
            isValid: false,
            message: 'Password must be less than 256 characters long'
        };
    }
    
    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
        console.log('❌ Password missing uppercase letter');
        return {
            isValid: false,
            message: 'Password must contain at least one uppercase letter'
        };
    }
    
    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
        console.log('❌ Password missing lowercase letter');
        return {
            isValid: false,
            message: 'Password must contain at least one lowercase letter'
        };
    }
    
    // Check for number
    if (!/[0-9]/.test(password)) {
        console.log('❌ Password missing number');
        return {
            isValid: false,
            message: 'Password must contain at least one number'
        };
    }
    
    // Check for special character
    if (!/[!@#$%^&*(),.?":{}|<>_]/.test(password)) {
        console.log('❌ Password missing special character');
        return {
            isValid: false,
            message: 'Password must contain at least one special character (!@#$%^&*_)'
        };
    }
    
    console.log('✅ Password validation passed');
    return {
        isValid: true,
        message: 'Password meets all requirements'
    };
};

// Email validation
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Get password strength score (0-6)
export const getPasswordStrength = (password) => {
    if (!password) return 0;
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character type checks
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>_]/.test(password)) score++;
    
    return score;
};

// Check if password is strong enough (all requirements met)
export const isPasswordStrong = (password) => {
    return validatePassword(password).isValid;
};

// Get password strength label
export const getPasswordStrengthLabel = (score) => {
    switch (score) {
        case 0:
        case 1: return 'Very Weak';
        case 2: return 'Weak';
        case 3: return 'Fair';
        case 4: return 'Good';
        case 5: return 'Strong';
        case 6: return 'Very Strong';
        default: return 'Unknown';
    }
};

// Get password strength color
export const getPasswordStrengthColor = (score) => {
    switch (score) {
        case 0:
        case 1: return 'text-[hsl(var(--destructive))]';
        case 2: return 'text-[hsl(var(--accent))]';
        case 3: return 'text-[hsl(var(--muted))]';
        case 4: return 'text-[hsl(var(--primary))]';
        case 5: return 'text-[hsl(var(--accent))]';
        case 6: return 'text-[hsl(var(--primary))]';
        default: return 'text-[hsl(var(--muted))]';
    }
};
