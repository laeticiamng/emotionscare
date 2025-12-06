
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  className?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  id = "time-input",
  className = "",
  label,
  required = false,
  disabled = false,
}) => {
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={id} className="mb-2 block">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Input
        type="time"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
};

export default TimeInput;
