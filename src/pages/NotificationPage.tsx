import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications] = useState([
    {
      id: 1,
      title: 'Nouvelle séance de musicothérapie disponible',
      message: 'Une playlist personnalisée a été générée pour votre état émotionnel',
      time: 'Il y a 5 minutes',
      unread: true,
      type: 'info'
    },
    {
      id: 2,
      title: 'Rappel: Exercice de respiration',
      message: 'N\'oubliez pas votre session de respiration quotidienne',
      time: 'Il y a 1 heure',
      unread: true,
      type: 'reminder'
    },
    {
      id: 3,
      title: 'Scan émotionnel complété',
      message: 'Votre analyse émotionnelle est prête. Découvrez vos résultats.',
      time: 'Il y a 2 heures',
      unread: false,
      type: 'success'
    }
  ]);

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mb-6 hover:bg-blue-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Notifications
              </h1>
              <p className="text-xl text-gray-600">
                Restez informé de vos activités
              </p>
            </div>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </Button>
          </div>

          <div className="space-y-4">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: notification.id * 0.1 }}
              >
                <Card className={`bg-white/80 backdrop-blur-sm shadow-xl border-0 ${
                  notification.unread ? 'ring-2 ring-blue-200' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        notification.type === 'info' ? 'bg-blue-100' :
                        notification.type === 'reminder' ? 'bg-yellow-100' :
                        'bg-green-100'
                      }`}>
                        <Bell className={`h-5 w-5 ${
                          notification.type === 'info' ? 'text-blue-600' :
                          notification.type === 'reminder' ? 'text-yellow-600' :
                          'text-green-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          {notification.unread && (
                            <Badge variant="default" className="bg-blue-500">
                              Nouveau
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500">
                          {notification.time}
                        </p>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline">
              Marquer tout comme lu
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationPage;