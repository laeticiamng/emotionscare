
import React from 'react';
import { useUserMode } from '@/contexts/UserModeContext';
import MainLayout from '@/components/layout/MainLayout';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumButton from '@/components/ui/PremiumButton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Moon, Globe, Shield, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const PreferencesPage: React.FC = () => {
  const { userMode } = useUserMode();
  const [preferences, setPreferences] = React.useState({
    notifications: true,
    darkMode: false,
    autoScans: true,
    dataSharing: false,
    weeklyReports: true,
    soundEffects: true
  });

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const preferenceCategories = [
    {
      title: 'Notifications',
      icon: <Bell className="h-6 w-6" />,
      items: [
        { key: 'notifications', label: 'Notifications générales', description: 'Recevoir des notifications importantes' },
        { key: 'weeklyReports', label: 'Rapports hebdomadaires', description: 'Résumé de votre bien-être chaque semaine' }
      ]
    },
    {
      title: 'Interface',
      icon: <Palette className="h-6 w-6" />,
      items: [
        { key: 'darkMode', label: 'Mode sombre', description: 'Interface adaptée pour les environnements peu éclairés' },
        { key: 'soundEffects', label: 'Effets sonores', description: 'Sons d\'interaction et de feedback' }
      ]
    },
    {
      title: 'Fonctionnalités',
      icon: <Settings className="h-6 w-6" />,
      items: [
        { key: 'autoScans', label: 'Scans automatiques', description: 'Analyses émotionnelles programmées' }
      ]
    },
    {
      title: 'Confidentialité',
      icon: <Shield className="h-6 w-6" />,
      items: [
        { key: 'dataSharing', label: 'Partage de données', description: 'Contribuer à l\'amélioration de nos services' }
      ]
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-8" data-testid="page-root">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ⚙️ Préférences
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Personnalisez votre expérience EmotionsCare
            </p>
          </motion.div>
        </div>

        {/* Preferences Categories */}
        <div className="space-y-6">
          {preferenceCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
            >
              <PremiumCard className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {category.title}
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {category.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (categoryIndex * 0.1) + (itemIndex * 0.05), duration: 0.4 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                    >
                      <div className="flex-1">
                        <Label htmlFor={item.key} className="text-lg font-medium text-gray-900 dark:text-white cursor-pointer">
                          {item.label}
                        </Label>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          {item.description}
                        </p>
                      </div>
                      <Switch
                        id={item.key}
                        checked={preferences[item.key as keyof typeof preferences]}
                        onCheckedChange={(checked) => handlePreferenceChange(item.key, checked)}
                      />
                    </motion.div>
                  ))}
                </div>
              </PremiumCard>
            </motion.div>
          ))}
        </div>

        {/* Profile Section */}
        {userMode && (
          <PremiumCard className="p-8" gradient>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Profil utilisateur
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <Globe className="h-8 w-8 text-white mb-4" />
                <h4 className="font-semibold text-lg mb-2 text-white">Mode d'utilisation</h4>
                <p className="text-white/90 mb-4">
                  {userMode === 'b2c' ? 'Utilisateur particulier' : 
                   userMode === 'b2b_user' ? 'Collaborateur entreprise' : 
                   'Administrateur RH'}
                </p>
                <PremiumButton variant="ghost" size="sm">
                  Modifier
                </PremiumButton>
              </div>
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <Shield className="h-8 w-8 text-white mb-4" />
                <h4 className="font-semibold text-lg mb-2 text-white">Sécurité</h4>
                <p className="text-white/90 mb-4">
                  Gérez vos paramètres de sécurité et confidentialité
                </p>
                <PremiumButton variant="ghost" size="sm">
                  Configurer
                </PremiumButton>
              </div>
            </div>
          </PremiumCard>
        )}

        {/* Save Button */}
        <div className="text-center">
          <PremiumButton variant="primary" className="px-12 py-4">
            Enregistrer les préférences
          </PremiumButton>
        </div>
      </div>
    </MainLayout>
  );
};

export default PreferencesPage;
