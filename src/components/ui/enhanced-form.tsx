import React from 'react';
import { useForm, FieldValues, Path, FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: 'text' | 'email' | 'password' | 'textarea' | 'number';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  className?: string;
}

interface EnhancedFormProps<T extends FieldValues> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
  fields: FormFieldProps<T>[];
  submitLabel?: string;
  loadingLabel?: string;
  className?: string;
  defaultValues?: Partial<T>;
}

/**
 * Formulaire accessible et robuste avec :
 * - Validation en temps réel
 * - Messages d'erreur liés aux champs
 * - États de chargement
 * - Support complet du clavier
 * - Annonces pour lecteurs d'écran
 */
export function EnhancedForm<T extends FieldValues>({
  schema,
  onSubmit,
  fields,
  submitLabel = 'Envoyer',
  loadingLabel = 'Envoi en cours...',
  className,
  defaultValues
}: EnhancedFormProps<T>) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    reset
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur'
  });

  const handleFormSubmit = async (data: T) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await onSubmit(data);
      setSubmitSuccess(true);
      
      // Annonce de succès pour les lecteurs d'écran
      const announcement = document.createElement('div');
      announcement.textContent = 'Formulaire envoyé avec succès';
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
      
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Une erreur inattendue s\'est produite';
      setSubmitError(errorMessage);
      
      // Annonce d'erreur pour les lecteurs d'écran
      const announcement = document.createElement('div');
      announcement.textContent = `Erreur : ${errorMessage}`;
      announcement.setAttribute('aria-live', 'assertive');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn('space-y-6', className)}
      noValidate
    >
      {/* Messages globaux */}
      <AnimatePresence>
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <span className="text-sm text-destructive font-medium">
              {submitError}
            </span>
          </motion.div>
        )}

        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 p-4 bg-success/10 border border-success/20 rounded-lg"
            role="alert"
            aria-live="polite"
          >
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
            <span className="text-sm text-success font-medium">
              Formulaire envoyé avec succès !
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Champs du formulaire */}
      <div className="space-y-4">
        {fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            register={register}
            error={errors[field.name]}
            disabled={isSubmitting || field.disabled}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            reset();
            setSubmitError(null);
            setSubmitSuccess(false);
          }}
          disabled={isSubmitting || !isDirty}
        >
          Réinitialiser
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {loadingLabel}
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}

// Composant de champ individuel
interface FormFieldComponentProps<T extends FieldValues> {
  field: FormFieldProps<T>;
  register: any;
  error?: any;
  disabled?: boolean;
}

function FormField<T extends FieldValues>({
  field,
  register,
  error,
  disabled
}: FormFieldComponentProps<T>) {
  const [showPassword, setShowPassword] = React.useState(false);
  const fieldId = `field-${field.name}`;
  const errorId = `${fieldId}-error`;
  const descriptionId = `${fieldId}-description`;

  const commonProps = {
    id: fieldId,
    disabled,
    'aria-invalid': !!error,
    'aria-describedby': cn(
      field.description && descriptionId,
      error && errorId
    ),
    className: cn(
      'transition-colors',
      error && 'border-destructive focus:border-destructive focus:ring-destructive/20'
    )
  };

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={fieldId}
        className={cn(
          'text-sm font-medium',
          field.required && 'after:content-["*"] after:text-destructive after:ml-1',
          disabled && 'opacity-50'
        )}
      >
        {field.label}
      </Label>

      {field.description && (
        <p id={descriptionId} className="text-xs text-muted-foreground">
          {field.description}
        </p>
      )}

      <div className="relative">
        {field.type === 'textarea' ? (
          <Textarea
            {...register(field.name, { required: field.required })}
            placeholder={field.placeholder}
            rows={4}
            {...commonProps}
          />
        ) : field.type === 'password' ? (
          <>
            <Input
              {...register(field.name, { required: field.required })}
              type={showPassword ? 'text' : 'password'}
              placeholder={field.placeholder}
              {...commonProps}
              className={cn(commonProps.className, 'pr-10')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              tabIndex={disabled ? -1 : 0}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </>
        ) : (
          <Input
            {...register(field.name, { 
              required: field.required,
              valueAsNumber: field.type === 'number'
            })}
            type={field.type || 'text'}
            placeholder={field.placeholder}
            {...commonProps}
          />
        )}
      </div>

      {/* Message d'erreur */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            id={errorId}
            className="text-xs text-destructive font-medium flex items-center space-x-1"
            role="alert"
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span>{error.message}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}