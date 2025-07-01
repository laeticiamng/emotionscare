
import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Users, Bell, Shield, Palette, Database } from 'lucide-react';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumButton from '@/components/ui/PremiumButton';

const SettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Paramètres Administrateur
          </h1>
          <p className="text-lg text-muted-foreground">
            Configurez et personnalisez votre plateforme EmotionsCare
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gestion des utilisateurs */}
          <PremiumCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Gestion des Utilisateurs</h3>
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Invitations en attente</h4>
                  <p className="text-sm text-muted-foreground">3 invitations envoyées</p>
                </div>
                <PremiumButton variant="primary" size="sm">
                  Gérer
                </PremiumButton>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Rôles et permissions</h4>
                  <p className="text-sm text-muted-foreground">Configurer les accès</p>
                </div>
                <PremiumButton variant="secondary" size="sm">
                  Configurer
                </PremiumButton>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Import/Export utilisateurs</h4>
                  <p className="text-sm text-muted-foreground">Gestion en lot</p>
                </div>
                <PremiumButton variant="accent" size="sm">
                  Accéder
                </PremiumButton>
              </div>
            </div>
          </PremiumCard>

          {/* Notifications */}
          <PremiumCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Notifications</h3>
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications push</h4>
                  <p className="text-sm text-muted-foreground">Alertes en temps réel</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Emails de rapport</h4>
                  <p className="text-sm text-muted-foreground">Rapports hebdomadaires</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Alertes système</h4>
                  <p className="text-sm text-muted-foreground">Maintenance et mises à jour</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </PremiumCard>

          {/* Sécurité */}
          <PremiumCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Sécurité & Confidentialité</h3>
              <Shield className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-800">Authentification à deux facteurs</h4>
                <p className="text-sm text-red-600 mb-3">Recommandé pour la sécurité</p>
                <PremiumButton variant="accent" size="sm">
                  Activer 2FA
                </PremiumButton>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium">Politique de mots de passe</h4>
                <p className="text-sm text-muted-foreground mb-3">Définir les exigences</p>
                <PremiumButton variant="secondary" size="sm">
                  Configurer
                </PremiumButton>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium">Journal d'audit</h4>
                <p className="text-sm text-muted-foreground mb-3">Traçabilité des actions</p>
                <PremiumButton variant="primary" size="sm">
                  Consulter
                </PremiumButton>
              </div>
            </div>
          </PremiumCard>

          {/* Personnalisation */}
          <PremiumCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Personnalisation</h3>
              <Palette className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <h4 className="font-medium">Thème de la plateforme</h4>
                <p className="text-sm text-muted-foreground mb-3">Couleurs et apparence</p>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full cursor-pointer border-2 border-blue-600"></div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full cursor-pointer"></div>
                  <div className="w-8 h-8 bg-green-500 rounded-full cursor-pointer"></div>
                  <div className="w-8 h-8 bg-orange-500 rounded-full cursor-pointer"></div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium">Logo de l'entreprise</h4>
                <p className="text-sm text-muted-foreground mb-3">Personnaliser la marque</p>
                <PremiumButton variant="accent" size="sm">
                  Télécharger
                </PremiumButton>
              </div>
            </div>
          </PremiumCard>
        </div>

        {/* Section données */}
        <div className="mt-8">
          <PremiumCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Gestion de Données</h3>
              <Database className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="text-4xl mb-4">📊</div>
                <h4 className="font-bold mb-2">Export de données</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Exporter toutes les données de la plateforme
                </p>
                <PremiumButton variant="primary" size="sm">
                  Exporter
                </PremiumButton>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="text-4xl mb-4">🔄</div>
                <h4 className="font-bold mb-2">Sauvegarde</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Planifier les sauvegardes automatiques
                </p>
                <PremiumButton variant="secondary" size="sm">
                  Configurer
                </PremiumButton>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                <div className="text-4xl mb-4">🗑️</div>
                <h4 className="font-bold mb-2">Suppression</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Gérer la rétention des données
                </p>
                <PremiumButton variant="accent" size="sm">
                  Paramétrer
                </PremiumButton>
              </div>
            </div>
          </PremiumCard>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
