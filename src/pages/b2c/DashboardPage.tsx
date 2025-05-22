
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import QuickAccessMenu from '@/components/dashboard/QuickAccessMenu';
import { Sparkles, Sun, Moon, Cloud, CloudRain, CloudLightning } from 'lucide-react';

const B2CDashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Bienvenue, {user?.name || 'utilisateur'}
        </h1>
        <p className="text-muted-foreground">
          Votre espace personnel de bien-être émotionnel.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Votre météo émotionnelle</p>
                <h2 className="text-2xl font-bold mt-1">Plutôt serein</h2>
                <p className="mt-1">Votre niveau de bien-être est à 72%</p>
              </div>
              <div className="h-16 w-16 flex items-center justify-center bg-blue-200 dark:bg-blue-700 rounded-full">
                <Sun className="h-10 w-10 text-yellow-500 dark:text-yellow-300" />
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-5 gap-2">
              {[
                { icon: <Sun className="h-5 w-5" />, label: "Ensoleillé", active: true },
                { icon: <Cloud className="h-5 w-5" />, label: "Mitigé", active: false },
                { icon: <CloudRain className="h-5 w-5" />, label: "Pluvieux", active: false },
                { icon: <CloudLightning className="h-5 w-5" />, label: "Orageux", active: false },
                { icon: <Sparkles className="h-5 w-5" />, label: "Radieux", active: false },
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col items-center p-2 rounded-lg ${item.active ? 'bg-white dark:bg-slate-800 shadow-sm' : ''}`}
                >
                  <div className={`${item.active ? 'text-blue-500 dark:text-blue-400' : 'text-muted-foreground'}`}>
                    {item.icon}
                  </div>
                  <span className="text-xs mt-1">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-4">Accès rapide</h2>
        <QuickAccessMenu />
      </motion.div>
      
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between items-center border-b pb-2">
                  <span className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>Journal émotionnel</span>
                  </span>
                  <span className="text-xs text-muted-foreground">Il y a 2h</span>
                </li>
                <li className="flex justify-between items-center border-b pb-2">
                  <span className="flex items-center">
                    <Music className="h-4 w-4 mr-2" />
                    <span>Session de musique</span>
                  </span>
                  <span className="text-xs text-muted-foreground">Hier</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    <span>Conversation avec le coach</span>
                  </span>
                  <span className="text-xs text-muted-foreground">Il y a 3 jours</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Citation inspirante</CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="border-l-4 border-blue-500 pl-4 italic">
                "Prendre soin de soi n'est pas un luxe, c'est une nécessité. Ce n'est pas de l'égoïsme, c'est de la préservation de soi, et c'est un acte de guerre politique contre les forces qui tentent de vous réduire à la passivité et au désespoir."
              </blockquote>
              <p className="text-right mt-2 font-medium">— Audre Lorde</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2CDashboardPage;

import { BookOpen, Music, MessageCircle } from 'lucide-react';
