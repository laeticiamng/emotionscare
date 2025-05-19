
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedFormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  icon?: React.ReactNode;
  hint?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  autoComplete?: string;
}

const AnimatedFormField: React.FC<AnimatedFormFieldProps> = ({
  id,
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error,
  success,
  required = false,
  disabled = false,
  autoFocus = false,
  className = "",
  icon,
  hint,
  onBlur,
  autoComplete
}) => {
  const [hasFocus, setHasFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleFocus = () => {
    setHasFocus(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setHasFocus(false);

    if (onBlur) {
      // Show a brief validation animation
      setIsValidating(true);
      setTimeout(() => {
        setIsValidating(false);
        onBlur(e);
      }, 300);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determine the input type (for password toggle)
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Dynamic classes for focus and validation states
  const labelClasses = cn(
    'absolute left-3 transition-all duration-200 pointer-events-none',
    (hasFocus || value) 
      ? '-top-2.5 text-xs font-medium bg-background px-1 z-10' 
      : 'top-2.5 text-muted-foreground'
  );

  const inputClasses = cn(
    'border transition-all duration-200',
    hasFocus && 'border-primary shadow-sm ring-1 ring-primary/20',
    error && 'border-destructive focus:border-destructive',
    success && 'border-green-500 focus:border-green-500',
    isValidating && 'animate-pulse',
    icon && 'pl-10',
    type === 'password' && 'pr-10',
    className
  );

  return (
    <div className="space-y-2">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-2.5 text-muted-foreground">
            {icon}
          </div>
        )}

        <Input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          className={inputClasses}
          autoComplete={autoComplete}
          aria-describedby={error ? `${id}-error` : success ? `${id}-success` : hint ? `${id}-hint` : undefined}
        />
        
        <Label htmlFor={id} className={labelClasses}>
          {label}{required && <span className="text-destructive ml-1">*</span>}
        </Label>

        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            tabIndex={-1} // Prevents tab focus
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {/* Validation icons */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-2.5 text-destructive"
              aria-hidden="true"
            >
              <AlertCircle size={18} />
            </motion.div>
          )}

          {success && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-2.5 text-green-500"
              aria-hidden="true"
            >
              <CheckCircle2 size={18} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error message with animation */}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            className="text-sm text-destructive"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Success message with animation */}
      <AnimatePresence>
        {success && !error && (
          <motion.p
            id={`${id}-success`}
            className="text-sm text-green-500"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {success}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Hint text */}
      {hint && !error && !success && (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
};

export default AnimatedFormField;
