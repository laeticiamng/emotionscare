import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvitationFormData, UserRole } from '@/types';

// Adapting to correct UserRole type to include 'employee'
// This is just a portion of the file to fix the type error
type ExtendedUserRole = UserRole | 'employee';

const InvitationForm: React.FC<{
  onInvitationSent: () => void;
}> = ({ onInvitationSent }) => {
  const [formData, setFormData] = useState<InvitationFormData & { role: ExtendedUserRole }>({
    email: '',
    role: 'employee' as ExtendedUserRole,
    message: '',
    expires_in_days: 7
  });
  
  const roles: { value: UserRole; label: string }[] = [
    { value: 'admin', label: 'Administrateur' },
    { value: 'manager', label: 'Manager' },
    { value: 'user', label: 'Utilisateur' },
    { value: 'therapist', label: 'Thérapeute' },
    { value: 'coach', label: 'Coach' },
    { value: 'guest', label: 'Invité' },
    { value: 'employee', label: 'Employé' }
  ];

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting invitation:', formData);
    
    // Here you would typically call an API to send the invitation
    
    // Reset form
    setFormData({
      email: '',
      role: 'employee' as ExtendedUserRole,
      message: '',
      expires_in_days: 7
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="email@example.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Rôle</Label>
        <select
          value={formData.role}
          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as ExtendedUserRole }))}
        >
          <option value="admin">Administrateur</option>
          <option value="manager">Manager</option>
          <option value="employee">Employé</option>
          <option value="guest">Invité</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message (Optionnel)</Label>
        <Textarea
          id="message"
          value={formData.message || ''}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="Message personnalisé pour l'invitation"
          className="h-24"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="expires">Expire dans</Label>
        <Select 
          value={formData.expires_in_days.toString()} 
          onValueChange={(value) => handleChange('expires_in_days', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Jours avant expiration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 jours</SelectItem>
            <SelectItem value="7">7 jours</SelectItem>
            <SelectItem value="14">14 jours</SelectItem>
            <SelectItem value="30">30 jours</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" className="w-full">
        Envoyer l'invitation
      </Button>
    </form>
  );
};

export default InvitationForm;
