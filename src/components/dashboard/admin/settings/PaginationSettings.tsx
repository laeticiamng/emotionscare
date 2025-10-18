// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

// Default settings for pagination
const DEFAULT_SETTINGS = {
  mode: 'paginated' as PaginationMode,
  defaultLimit: '25',
  maxLimit: '100'
};

type PaginationMode = 'paginated' | 'loadMore' | 'infinite';

interface PaginationSettings {
  mode: PaginationMode;
  defaultLimit: string;
  maxLimit: string;
}

const PaginationSettings: React.FC = () => {
  const [settings, setSettings] = useState<PaginationSettings>({ ...DEFAULT_SETTINGS });
  const [isSaving, setIsSaving] = useState(false);
  
  // Load settings on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    // For this demo, we'll use localStorage
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('emotionscare-admin-pagination-settings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        logger.error('Error loading pagination settings', error as Error, 'UI');
        // Fall back to defaults
        setSettings({ ...DEFAULT_SETTINGS });
      }
    };
    
    loadSettings();
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Validate inputs
      const maxLimitNum = parseInt(settings.maxLimit);
      const defaultLimitNum = parseInt(settings.defaultLimit);
      
      if (isNaN(maxLimitNum) || isNaN(defaultLimitNum)) {
        toast.error('Les valeurs des limites doivent être des nombres');
        return;
      }
      
      if (defaultLimitNum > maxLimitNum) {
        toast.error('La limite par défaut ne peut pas dépasser la limite maximale');
        return;
      }
      
      // In a real app, this would be an API call
      // For this demo, we'll use localStorage
      localStorage.setItem('emotionscare-admin-pagination-settings', JSON.stringify(settings));
      localStorage.setItem('emotionscare-pagination-mode', settings.mode);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Paramètres de pagination enregistrés', {
        description: 'Les modifications ont été appliquées avec succès.'
      });
    } catch (error) {
      logger.error('Error saving pagination settings', error as Error, 'UI');
      toast.error('Une erreur est survenue lors de l\'enregistrement des paramètres');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de pagination</CardTitle>
        <CardDescription>
          Configurez le comportement de pagination pour tous les utilisateurs de l'application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="pagination-settings-form" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Mode de pagination</h3>
              <RadioGroup 
                value={settings.mode} 
                onValueChange={(value) => setSettings({ ...settings, mode: value as PaginationMode })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paginated" id="paginated" />
                  <Label htmlFor="paginated">Pagination numérotée</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="loadMore" id="load-more" />
                  <Label htmlFor="load-more">Charger plus</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="infinite" id="infinite" />
                  <Label htmlFor="infinite">Défilement infini</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Taille des pages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-limit">Limite par défaut</Label>
                  <Select 
                    value={settings.defaultLimit} 
                    onValueChange={(value) => setSettings({ ...settings, defaultLimit: value })}
                  >
                    <SelectTrigger id="default-limit">
                      <SelectValue placeholder="Choisir une limite" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 éléments</SelectItem>
                      <SelectItem value="25">25 éléments</SelectItem>
                      <SelectItem value="50">50 éléments</SelectItem>
                      <SelectItem value="100">100 éléments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-limit">
                    Limite maximale
                    <span className="ml-1 text-xs text-muted-foreground">(pour éviter de surcharger le serveur)</span>
                  </Label>
                  <Input 
                    id="max-limit"
                    type="number" 
                    min="10"
                    max="500"
                    value={settings.maxLimit} 
                    onChange={(e) => setSettings({ ...settings, maxLimit: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit" form="pagination-settings-form" disabled={isSaving}>
          {isSaving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaginationSettings;
