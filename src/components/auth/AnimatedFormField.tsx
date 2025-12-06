
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AnimatedFormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
}

const AnimatedFormField: React.FC<AnimatedFormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  autoFocus = false,
  placeholder,
  error,
  icon,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Label 
          htmlFor={id} 
          className={cn(
            "absolute transition-all duration-200 pointer-events-none",
            (isFocused || value) 
              ? "-top-6 left-0 text-xs font-medium text-primary" 
              : "top-2 left-9 text-sm text-muted-foreground"
          )}
        >
          {label}
        </Label>
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          
          <Input
            id={id}
            type={type}
            value={value}
            onChange={(e) => {
              onChange(e);
              if (!isTouched) setIsTouched(true);
            }}
            required={required}
            autoFocus={autoFocus}
            placeholder={isFocused ? placeholder : ""}
            className={cn(
              "pl-9 transition-all duration-200",
              isFocused ? "border-primary shadow-sm" : "border-input",
              error ? "border-destructive" : "",
              icon ? "pl-9" : "pl-3"
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          
          {isTouched && value && !error && type !== 'password' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </motion.div>
          )}
        </div>
      </div>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="text-xs text-destructive mt-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default AnimatedFormField;
