import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useButtonActions } from '@/hooks/useButtonActions';

interface FunctionalButtonProps extends Omit<ButtonProps, 'onClick'> {
  actionId: string;
  onClick: () => Promise<any> | any;
  loadingText?: string;
  successMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
  showSuccessIcon?: boolean;
  disableOnSuccess?: boolean;
  resetAfterSuccess?: number; // ms
  children: React.ReactNode;
}

export const FunctionalButton: React.FC<FunctionalButtonProps> = ({
  actionId,
  onClick,
  loadingText = "Chargement...",
  successMessage,
  errorMessage,
  loadingMessage,
  showSuccessIcon = false,
  disableOnSuccess = false,
  resetAfterSuccess,
  children,
  disabled,
  className,
  ...props
}) => {
  const { executeAction, getActionState, resetActionState } = useButtonActions();
  const { isLoading, isSuccess, error } = getActionState(actionId);

  const handleClick = async () => {
    try {
      await executeAction(actionId, onClick, {
        successMessage,
        errorMessage,
        loadingMessage
      });

      if (resetAfterSuccess) {
        setTimeout(() => {
          resetActionState(actionId);
        }, resetAfterSuccess);
      }
    } catch (error) {
      // Error is already handled in executeAction
    }
  };

  const isDisabled = disabled || isLoading || (disableOnSuccess && isSuccess);

  return (
    <Button
      {...props}
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        "transition-all duration-200",
        isSuccess && showSuccessIcon && "bg-green-600 hover:bg-green-700",
        className
      )}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {isSuccess && showSuccessIcon && (
        <span className="mr-2">✓</span>
      )}
      {isLoading ? loadingText : children}
    </Button>
  );
};

export default FunctionalButton;