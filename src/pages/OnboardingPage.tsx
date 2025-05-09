import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from '@/contexts/AuthContext';
import { UserPreferences } from '@/types';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  // If setUser doesn't exist, we can try to find an alternative or just remove this line
  // const { user, setUser } = useAuth();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    theme: 'light',
    notifications_enabled: true,
    font_size: 'medium',
    language: 'en',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Fix the theme type by removing "system" if not supported
    const theme: "light" | "dark" | "pastel" = formData.theme === "system" ? "light" : formData.theme as "light" | "dark" | "pastel";

    const preferences: UserPreferences = {
      theme: theme,
      notifications_enabled: formData.notifications_enabled === true || formData.notifications_enabled === 'true',
      font_size: formData.font_size as 'small' | 'medium' | 'large',
      language: formData.language,
    };

    console.log('Onboarding form submitted with preferences:', preferences);
    // Here you would typically call an API to save the preferences
    // and then redirect the user to the dashboard or another appropriate page.
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bienvenue !</h1>
      <p className="mb-4">Personnalisez votre expérience :</p>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <Label htmlFor="theme">Thème:</Label>
          <Select name="theme" onValueChange={(value) => setFormData(prev => ({ ...prev, theme: value }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Clair</SelectItem>
              <SelectItem value="dark">Sombre</SelectItem>
              <SelectItem value="pastel">Pastel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <Label htmlFor="font_size">Taille de la police:</Label>
          <Select name="font_size" onValueChange={(value) => setFormData(prev => ({ ...prev, font_size: value }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select font size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Petite</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Commencer</Button>
      </form>
    </div>
  );
};

export default OnboardingPage;
