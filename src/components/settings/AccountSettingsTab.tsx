// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { z } from 'zod';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Camera,
  Shield,
  CreditCard,
  Trash2,
  Save,
  Edit3,
  Crown,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Validation schema
const accountSchema = z.object({
  displayName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  email: z.string().email('Adresse email invalide').max(255, 'Email trop long'),
  phone: z.string().regex(/^[+]?[\d\s()-]{0,20}$/, 'Numéro de téléphone invalide').optional().or(z.literal('')),
  bio: z.string().max(500, 'La bio ne peut pas dépasser 500 caractères').optional().or(z.literal('')),
  location: z.string().max(100, 'La localisation ne peut pas dépasser 100 caractères').optional().or(z.literal('')),
  birthDate: z.string().optional().or(z.literal('')),
  website: z.string().url('URL invalide').optional().or(z.literal(''))
});

const AccountSettingsTab: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    bio: user?.user_metadata?.bio || '',
    location: user?.user_metadata?.location || '',
    birthDate: user?.user_metadata?.birth_date || '',
    website: user?.user_metadata?.website || ''
  });

  const [preferences, setPreferences] = useState({
    publicProfile: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    marketingEmails: false,
    dataAnalytics: true
  });

  const handleSave = () => {
    try {
      // Validate form data
      accountSchema.parse(formData);
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès."
      });
      setIsEditing(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Erreur de validation",
          description: firstError.message,
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Suppression de compte",
      description: "Cette action nécessite une confirmation par email.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      {/* Profil principal */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations du profil
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? 'Annuler' : 'Modifier'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Photo de profil */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="text-lg">
                {formData.displayName.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Changer la photo
              </Button>
              <p className="text-sm text-muted-foreground">
                JPG, PNG max 5MB
              </p>
            </div>
            <div className="ml-auto">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Nom d'affichage</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Date de naissance</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                disabled={!isEditing}
                placeholder="Ville, Pays"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                disabled={!isEditing}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biographie</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              disabled={!isEditing}
              placeholder="Parlez-nous de vous..."
              rows={3}
            />
          </div>

          {isEditing && (
            <Button onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder les modifications
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Confidentialité du profil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Confidentialité du profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Profil public</Label>
              <p className="text-sm text-muted-foreground">
                Permet aux autres utilisateurs de voir votre profil
              </p>
            </div>
            <Switch
              checked={preferences.publicProfile}
              onCheckedChange={(checked) => setPreferences({...preferences, publicProfile: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Afficher l'email</Label>
              <p className="text-sm text-muted-foreground">
                Votre email sera visible sur votre profil public
              </p>
            </div>
            <Switch
              checked={preferences.showEmail}
              onCheckedChange={(checked) => setPreferences({...preferences, showEmail: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Autoriser les messages</Label>
              <p className="text-sm text-muted-foreground">
                Les utilisateurs peuvent vous envoyer des messages privés
              </p>
            </div>
            <Switch
              checked={preferences.allowMessages}
              onCheckedChange={(checked) => setPreferences({...preferences, allowMessages: checked})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Abonnement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Abonnement Premium
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Plan Premium</span>
                <Badge variant="secondary">Actif</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Accès complet à toutes les fonctionnalités IA
              </p>
              <p className="text-sm font-medium">
                Prochain renouvellement: 15 février 2025
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">29€</div>
              <div className="text-sm text-muted-foreground">/mois</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Gérer l'abonnement
            </Button>
            <Button variant="outline" className="flex-1">
              Facturation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Zone dangereuse */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Zone dangereuse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-800 mb-2">Supprimer le compte</h4>
            <p className="text-sm text-red-600 mb-3">
              Cette action est irréversible. Toutes vos données seront définitivement supprimées.
            </p>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Supprimer mon compte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettingsTab;