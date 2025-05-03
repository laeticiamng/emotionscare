
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateAnonymityCode } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRole } from '@/types';

const OnboardingPage = () => {
  const { user, updateUserProfile } = useAuth();
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [role, setRole] = useState<UserRole | undefined>(user?.role);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock avatar options (in a real app, this would be file upload)
  const avatarOptions = [
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=2',
    'https://i.pravatar.cc/150?img=3',
    'https://i.pravatar.cc/150?img=4',
    'https://i.pravatar.cc/150?img=5',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role || !avatar) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un rôle et un avatar",
        variant: "destructive"
      });
      return;
    }

    // Generate anonymity code if not present
    const anonymityCode = user?.anonymity_code || generateAnonymityCode();
    
    setIsSubmitting(true);
    try {
      await updateUserProfile({
        role,
        avatar,
        anonymity_code: anonymityCode
      });
      
      toast({
        title: "Profil complété",
        description: "Bienvenue sur Cocoon Wellbeing Hub!",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cocoon-50 to-cocoon-100 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cocoon-800">Finalisez votre profil</h1>
          <p className="text-muted-foreground mt-2">Quelques informations pour personnaliser votre expérience</p>
        </div>

        <Card className="shadow-lg border-cocoon-200">
          <CardHeader>
            <CardTitle>Bienvenue, {user?.name}!</CardTitle>
            <CardDescription>
              Complétez votre profil pour accéder à votre espace de bien-être
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Choisissez votre avatar</Label>
                <div className="flex justify-center">
                  <div className="grid grid-cols-5 gap-3">
                    {avatarOptions.map((avatarUrl) => (
                      <Avatar 
                        key={avatarUrl} 
                        className={`w-14 h-14 cursor-pointer transition-all duration-200 ${
                          avatar === avatarUrl ? 'ring-4 ring-primary' : 'opacity-70 hover:opacity-100'
                        }`}
                        onClick={() => setAvatar(avatarUrl)}
                      >
                        <AvatarImage src={avatarUrl} alt="Avatar option" />
                        <AvatarFallback>?</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Votre rôle</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Interne">Interne</SelectItem>
                    <SelectItem value="Infirmier">Infirmier</SelectItem>
                    <SelectItem value="Aide-soignant">Aide-soignant</SelectItem>
                    <SelectItem value="Médecin">Médecin</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Traitement..." : "Terminer"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
