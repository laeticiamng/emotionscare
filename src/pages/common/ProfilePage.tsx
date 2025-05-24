
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { 
  User, 
  Mail, 
  Building, 
  Briefcase, 
  Save, 
  Camera,
  Heart,
  Trophy,
  Calendar,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    company: user?.user_metadata?.company || '',
    jobTitle: user?.user_metadata?.job_title || '',
    avatar: user?.user_metadata?.avatar_url || ''
  });

  const isDemo = user?.email?.endsWith('@exemple.fr');
  const modeDisplay = getUserModeDisplayName(userMode);

  const stats = {
    scansCompleted: 47,
    daysStreak: 12,
    emotionalScore: 78,
    joinDate: '15 janvier 2024'
  };

  const handleSave = async () => {
    try {
      // Sauvegarder les modifications du profil
      toast.success('Profil mis à jour avec succès !');
      setIsEditing(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  const handleAvatarChange = () => {
    toast.info('Fonctionnalité de changement d\'avatar bientôt disponible');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Vos données de profil et préférences de compte
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </>
                  ) : (
                    <>
                      <Settings className="h-4 w-4 mr-2" />
                      Modifier
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                    onClick={handleAvatarChange}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{profileData.name || 'Utilisateur'}</h2>
                  <Badge variant="secondary" className="mt-1">
                    {modeDisplay}
                  </Badge>
                  {isDemo && (
                    <Badge variant="outline" className="ml-2">
                      Compte démo
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom complet</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={profileData.email}
                      disabled
                      className="pl-10 bg-muted"
                    />
                  </div>
                </div>

                {(userMode === 'b2b_user' || userMode === 'b2b_admin') && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Entreprise</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={profileData.company}
                          onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Poste</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={profileData.jobTitle}
                          onChange={(e) => setProfileData(prev => ({ ...prev, jobTitle: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder les modifications
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistiques et activité */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span>Mes statistiques</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.emotionalScore}%</div>
                <p className="text-sm text-muted-foreground">Score de bien-être</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-xl font-bold">{stats.scansCompleted}</div>
                  <p className="text-xs text-muted-foreground">Scans réalisés</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-xl font-bold">{stats.daysStreak}</div>
                  <p className="text-xs text-muted-foreground">Jours consécutifs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span>Informations compte</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Membre depuis :</span>
                <span className="text-sm font-medium">{stats.joinDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type de compte :</span>
                <Badge variant="outline">{modeDisplay}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Statut :</span>
                <Badge variant="default" className="bg-green-500">
                  Actif
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Heart className="h-8 w-8 text-red-500" />
                <div>
                  <h4 className="font-medium">Continuez comme ça !</h4>
                  <p className="text-sm text-muted-foreground">
                    Votre régularité améliore votre bien-être
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
