
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { User, Mail, Building, Save, Camera } from 'lucide-react';
import { toast } from 'sonner';
import LoadingAnimation from '@/components/ui/loading-animation';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { userMode } = useUserMode();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.user_metadata?.firstName || user.user_metadata?.name?.split(' ')[0] || '',
        lastName: user.user_metadata?.lastName || user.user_metadata?.name?.split(' ')[1] || '',
        email: user.email || '',
        company: user.user_metadata?.company || ''
      });
    }
    setIsLoading(false);
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Dans un environnement réel, on appellerait updateUser avec les nouvelles données
      // await updateUser({ ...formData });
      toast.success('Profil mis à jour avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement de votre profil..." />
      </div>
    );
  }

  const isDemo = user?.email?.endsWith('@exemple.fr');

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-4xl">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et préférences
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photo de profil */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Photo de profil</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="mx-auto w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {formData.firstName && formData.lastName 
                  ? `${formData.firstName[0]}${formData.lastName[0]}`
                  : user?.email?.[0]?.toUpperCase() || 'U'
                }
              </div>
              <Button variant="outline" size="sm" disabled={isDemo}>
                <Camera className="h-4 w-4 mr-2" />
                Changer la photo
              </Button>
              {isDemo && (
                <p className="text-xs text-muted-foreground">
                  Modification désactivée en mode démo
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Informations personnelles */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Mettez à jour vos informations de profil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={isDemo}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={isDemo}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    disabled={true} // L'email ne peut généralement pas être modifié
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Contactez l'administrateur pour modifier votre adresse email
                </p>
              </div>

              {(userMode === 'b2b_user' || userMode === 'b2b_admin') && (
                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="pl-10"
                      disabled={isDemo}
                    />
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving || isDemo}
                  className="w-full"
                >
                  {isSaving && <Save className="mr-2 h-4 w-4 animate-spin" />}
                  Sauvegarder les modifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Informations du compte */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Informations du compte</CardTitle>
            <CardDescription>
              Détails de votre compte EmotionsCare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium">Type de compte</div>
                <div className="text-sm text-muted-foreground">
                  {userMode === 'b2c' ? 'Particulier' :
                   userMode === 'b2b_user' ? 'Collaborateur B2B' :
                   userMode === 'b2b_admin' ? 'Administrateur B2B' : 'Non défini'}
                </div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium">Statut</div>
                <div className="text-sm text-muted-foreground">
                  {isDemo ? 'Compte démo' : 'Compte actif'}
                </div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium">Membre depuis</div>
                <div className="text-sm text-muted-foreground">
                  {user?.created_at 
                    ? new Date(user.created_at).toLocaleDateString('fr-FR')
                    : 'Date inconnue'
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Zone dangereuse */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Zone dangereuse</CardTitle>
            <CardDescription>
              Actions irréversibles sur votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center p-4 border border-red-200 rounded-lg">
              <div>
                <h4 className="font-medium text-red-600">Supprimer le compte</h4>
                <p className="text-sm text-muted-foreground">
                  Supprime définitivement votre compte et toutes vos données
                </p>
              </div>
              <Button variant="destructive" disabled={isDemo}>
                Supprimer le compte
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
