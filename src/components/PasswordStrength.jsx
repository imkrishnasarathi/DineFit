import { getPasswordStrength, getPasswordStrengthLabel, validatePassword } from '../utils/validation'

const PasswordStrength = ({ password }) => {
  if (!password) return null

  const strength = getPasswordStrength(password)
  const label = getPasswordStrengthLabel(strength)
  const validation = validatePassword(password)

  const progress = (strength / 6) * 100

  const requirements = [
    { test: password.length >= 8, text: 'At least 8 characters' },
    { test: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { test: /[a-z]/.test(password), text: 'One lowercase letter' },
    { test: /[0-9]/.test(password), text: 'One number' },
    { test: /[!@#$%^&*(),.?":{}|<>_]/.test(password), text: 'One special character' }
  ]

  return (
    <div className="mt-3 p-3 bg-[hsl(var(--card)/0.6)] backdrop-blur-sm rounded-lg border border-[hsl(var(--border))]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Password Strength:</span>
        <span className="text-sm font-semibold text-[hsl(var(--primary))]">{label}</span>
      </div>

      <div className="w-full bg-[hsl(var(--muted))] rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            strength <= 1 ? 'bg-[hsl(var(--destructive))]' :
            strength <= 3 ? 'bg-[hsl(var(--muted-foreground))]' :
            'bg-[hsl(var(--primary))]'
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center text-xs">
            <span className={`mr-2 ${req.test ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`}>
              {req.test ? '✓' : '○'}
            </span>
            <span className={req.test ? 'text-[hsl(var(--primary-foreground))]' : 'text-[hsl(var(--muted-foreground))]'}>
              {req.text}
            </span>
          </div>
        ))}
      </div>

      {validation.isValid && (
        <div className="mt-2 text-xs text-[hsl(var(--primary))] font-medium">✓ Password meets all requirements</div>
      )}
    </div>
  )
}

export default PasswordStrength
