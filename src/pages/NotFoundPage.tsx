
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const popularPages = [
    { name: 'Accueil', path: '/', icon: Home },
    { name: 'Scanner Émotions', path: '/scan', icon: Search },
    { name: 'Musique Thérapeutique', path: '/music', icon: MapPin },
    { name: 'Coach IA', path: '/coach', icon: MapPin }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="space-y-6">
              <div className="text-center">
                <div className="text-8xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
                  404
                </div>
                <CardTitle className="text-3xl font-bold text-gray-800 mb-4">
                  Page introuvable
                </CardTitle>
                <p className="text-xl text-gray-600 mb-8">
                  Oops ! La page que vous recherchez n'existe pas ou a été déplacée.
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="flex items-center gap-2 px-6 py-3 text-lg"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Retour
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 text-lg"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Accueil
                </Button>
              </div>

              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Pages populaires
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {popularPages.map((page) => (
                    <Button
                      key={page.path}
                      onClick={() => navigate(page.path)}
                      variant="ghost"
                      className="flex items-center gap-2 p-3 hover:bg-blue-50 rounded-xl"
                    >
                      <page.icon className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{page.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
