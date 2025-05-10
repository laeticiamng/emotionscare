
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvitationFormData, UserRole } from '@/types';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InvitationFormProps {
  onInvitationSent?: () => void;
}

const InvitationForm: React.FC<InvitationFormProps> = ({ onInvitationSent }) => {
  const [inviteData, setInviteData] = useState<InvitationFormData>({
    email: '',
    role: 'employee',
    message: '',
    expires_in_days: 7
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInviteData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing again
    if (error) setError(null);
  };
  
  const handleRoleChange = (value: string) => {
    setInviteData(prev => ({ ...prev, role: value }));
    
    // Clear error when user makes a selection
    if (error) setError(null);
  };
  
  const handleExpiryChange = (value: string) => {
    setInviteData(prev => ({ ...prev, expires_in_days: parseInt(value, 10) }));
  };
  
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!inviteData.email) {
      setError('Veuillez entrer une adresse email.');
      return;
    }
    
    if (!validateEmail(inviteData.email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }
    
    if (!inviteData.role) {
      setError('Veuillez sélectionner un rôle.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, this would send the invitation via API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success!
      setSuccess(true);
      setInviteData({
        email: '',
        role: 'employee',
        message: '',
        expires_in_days: 7
      });
      
      // Notify parent component
      if (onInvitationSent) {
        onInvitationSent();
      }
      
      // Reset success message after a delay
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error sending invitation:', err);
      setError('Une erreur est survenue lors de l\'envoi de l\'invitation. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="bg-primary/10 text-primary border-primary">
          <AlertDescription>
            Invitation envoyée avec succès à {inviteData.email}.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email du destinataire</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="collaborateur@entreprise.fr"
          value={inviteData.email}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Rôle</Label>
        <Select
          value={inviteData.role}
          onValueChange={handleRoleChange}
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="employee">Employé</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="admin">Administrateur</SelectItem>
            <SelectItem value="user">Utilisateur Standard</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="expires_in_days">Expiration de l'invitation</Label>
        <Select
          value={inviteData.expires_in_days?.toString()}
          onValueChange={handleExpiryChange}
        >
          <SelectTrigger id="expires_in_days">
            <SelectValue placeholder="Sélectionner une durée de validité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 jour</SelectItem>
            <SelectItem value="3">3 jours</SelectItem>
            <SelectItem value="7">7 jours</SelectItem>
            <SelectItem value="14">14 jours</SelectItem>
            <SelectItem value="30">30 jours</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message personnalisé (optionnel)</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Bonjour, je vous invite à rejoindre notre plateforme..."
          value={inviteData.message}
          onChange={handleInputChange}
          rows={3}
        />
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Envoi en cours...' : 'Envoyer l\'invitation'}
        </Button>
      </div>
    </form>
  );
};

export default InvitationForm;
