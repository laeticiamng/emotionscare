import React from 'react';
import { Button, ButtonProps } from './ui/button';

export const PastelButton: React.FC<ButtonProps> = ({ className = '', ...props }) => {
  return (
    <Button
      className={`bg-gradient-to-r from-pink-200 to-blue-200 text-slate-700 hover:from-pink-300 hover:to-blue-300 ${className}`}
      {...props}
    />
  );
};

export default PastelButton;
