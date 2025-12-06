import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  className,
}) => {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      setHours(h);
      setMinutes(m);
    }
  }, [value]);
  
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val === '') {
      setHours('');
      return;
    }
    
    const numVal = parseInt(val);
    if (isNaN(numVal)) return;
    
    if (numVal >= 0 && numVal <= 23) {
      setHours(val.padStart(2, '0'));
      onChange(`${val.padStart(2, '0')}:${minutes}`);
    }
  };
  
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val === '') {
      setMinutes('');
      return;
    }
    
    const numVal = parseInt(val);
    if (isNaN(numVal)) return;
    
    if (numVal >= 0 && numVal <= 59) {
      setMinutes(val.padStart(2, '0'));
      onChange(`${hours}:${val.padStart(2, '0')}`);
    }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Input
        className="w-[4rem] text-center"
        type="text"
        maxLength={2}
        inputMode="numeric"
        pattern="[0-9]*"
        value={hours}
        onChange={handleHoursChange}
        placeholder="HH"
      />
      <span className="text-lg font-medium">:</span>
      <Input
        className="w-[4rem] text-center"
        type="text"
        maxLength={2}
        inputMode="numeric"
        pattern="[0-9]*"
        value={minutes}
        onChange={handleMinutesChange}
        placeholder="MM"
      />
    </div>
  );
};

export default TimePicker;
